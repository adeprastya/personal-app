import { NextRequest } from "next/server";
import type { Project } from "@/types/Project";
import ProjectCollection from "@/models/Project";
import { filterEmptyObjectFields, generateId, timestampToReadable } from "@/utils/helper";
import { successResponse } from "@/utils/response";
import { CloudStorageInstance } from "@/services/CloudStorage";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";
import { CreateProjectSchema, ImageFileSchema, UpdateProjectSchema, IdSchema } from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";
import { ErrorHandler } from "@/middlewares/ErrorHandler";

type Params = { params: Promise<{ id: string }> };

// PUBLIC API / Get All Project / Get Single Detailed Project
export const GET = ErrorHandler(async (req: NextRequest, { params }: Params) => {
	try {
		const param = await params;

		if (param.id) {
			const id = param.id[0];

			validate(IdSchema, id);

			const project = await ProjectCollection.findByField("id", "==", id);

			if (!project) {
				throw new CustomErrorResponse(404, "Project not found");
			}

			project.created_at = timestampToReadable(project.created_at);

			return successResponse(200, "Project retrieved successfully", project);
		}

		const projects = await ProjectCollection.findAll(["id", "created_at", "title", "tagline", "image_thumbnail_url"]);

		const sortedProjects = projects
			.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
			.map((project) => ({
				...project,
				created_at: timestampToReadable(project.created_at)
			}));

		return successResponse(200, "All projects retrieved successfully", sortedProjects);
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed getting projects", err);
	}
});

// PROTECTED API / Create Project
export const POST = ErrorHandler(async (req: NextRequest) => {
	try {
		const reqForm = await req.formData();
		let reqData = reqForm.get("data") as string;
		const reqThumbnail = reqForm.get("thumbnail") as File;
		const reqPreviews = reqForm.getAll("preview") as File[];

		try {
			reqData = JSON.parse(reqData);
		} catch (err) {
			throw new CustomErrorResponse(400, "Data must be a valid JSON object", err);
		}
		const cleanData: Partial<Project> = filterEmptyObjectFields(reqData as unknown as object);

		validate(CreateProjectSchema, cleanData);
		validate(ImageFileSchema, {
			mimetype: reqThumbnail.type,
			size: reqThumbnail.size
		});
		reqPreviews.forEach((preview) => {
			validate(ImageFileSchema, {
				mimetype: preview.type,
				size: preview.size
			});
		});

		const id = generateId();

		const thumbnail = {
			mimetype: reqThumbnail.type,
			buffer: Buffer.from(await reqThumbnail.arrayBuffer())
		};
		const image_thumbnail_url = await CloudStorageInstance.storeFile(
			`projects/${cleanData.title}-${id}/thumbnail`,
			thumbnail
		);

		const previews = reqPreviews.map(async (preview) => ({
			mimetype: preview.type,
			buffer: Buffer.from(await preview.arrayBuffer())
		}));
		const image_preview_urls = await Promise.all(
			previews.map(async (preview, i) =>
				CloudStorageInstance.storeFile(`projects/${cleanData.title}-${id}/preview-${i + 1}`, await preview)
			)
		);

		const data = {
			...(reqData as Partial<Project>),
			image_thumbnail_url,
			image_preview_urls,
			id,
			created_at: new Date().toISOString()
		};
		await ProjectCollection.create(data as Project);

		return successResponse(201, "Project created successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed creating project", err);
	}
});

// PROTECTED API / Update Project
export const PATCH = ErrorHandler(async (req: NextRequest, { params }: Params) => {
	try {
		const id = (await params).id[0];
		validate(IdSchema, id);

		const reqForm = await req.formData();

		// Handle Optional Data Update
		let reqData: Partial<Project> = {};
		const reqDataString = reqForm.get("data") as string;
		if (reqDataString) {
			try {
				reqData = JSON.parse(reqDataString);
			} catch (err) {
				throw new CustomErrorResponse(400, "Data must be a valid JSON object", err);
			}
			validate(UpdateProjectSchema, reqData);
		}

		const currentProject = await ProjectCollection.findByField("id", "==", id);
		if (!currentProject) {
			throw new CustomErrorResponse(404, "Project not found");
		}

		const projectTitle = reqData.title || currentProject.title;

		// Handle Optional Thumbnail Update
		const reqThumbnail = reqForm.get("thumbnail") as File;
		if (reqThumbnail) {
			validate(ImageFileSchema, {
				mimetype: reqThumbnail.type,
				size: reqThumbnail.size
			});

			if (currentProject.image_thumbnail_url) {
				const oldThumbnailPath = currentProject.image_thumbnail_url.replace(/^.*\/(projects\/.*\/.*)$/, "$1");
				await CloudStorageInstance.deleteFile(oldThumbnailPath);
			}

			const thumbnailBuffer = Buffer.from(await reqThumbnail.arrayBuffer());
			const thumbnailFile = { mimetype: reqThumbnail.type, buffer: thumbnailBuffer };
			const newThumbnailUrl = await CloudStorageInstance.storeFile(
				`projects/${projectTitle}-${id}/thumbnail`,
				thumbnailFile
			);
			reqData.image_thumbnail_url = newThumbnailUrl;
		}

		// // TODO: Know which preview index is being updated or deleted or added
		// // Handle Optional Preview Images Update
		// const reqPreviews = reqForm.getAll("preview") as File[];
		// if (reqPreviews && reqPreviews.length > 0) {
		// 	reqPreviews.forEach((preview) => {
		// 		validate(ImageFileSchema, {
		// 			mimetype: preview.type,
		// 			size: preview.size
		// 		});
		// 	});

		// 	if (currentProject.image_preview_urls && currentProject.image_preview_urls.length > 0) {
		// 		const oldPreviewPaths = currentProject.image_preview_urls.map((url) =>
		// 			url.replace(/^.*\/(projects\/.*\/.*)$/, "$1")
		// 		);
		// 		await Promise.all(oldPreviewPaths.map((path) => CloudStorageInstance.deleteFile(path)));
		// 	}

		// 	const newPreviewUrls = await Promise.all(
		// 		reqPreviews.map(async (preview, index) => {
		// 			const previewBuffer = Buffer.from(await preview.arrayBuffer());
		// 			const previewFile = { mimetype: preview.type, buffer: previewBuffer };
		// 			return CloudStorageInstance.storeFile(`projects/${projectTitle}-${id}/preview-${index + 1}`, previewFile);
		// 		})
		// 	);
		// 	reqData.image_preview_urls = newPreviewUrls;
		// }

		const cleanData = filterEmptyObjectFields(reqData);
		await ProjectCollection.update(id, cleanData as Partial<Project>);

		return successResponse(200, "Project updated successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed updating project", err);
	}
});

// PROTECTED API / Delete Project
export const DELETE = ErrorHandler(async (req: NextRequest, { params }: Params) => {
	try {
		const id = (await params).id[0];

		validate(IdSchema, id);

		const tempData = await ProjectCollection.findByField("id", "==", id);
		if (!tempData) {
			throw new CustomErrorResponse(404, "Project not found");
		}

		const image_url = tempData.image_thumbnail_url.replace(/^.*\/(projects\/.*\/.*)$/, "$1");
		await CloudStorageInstance.deleteFile(image_url);

		const image_preview_urls = tempData.image_preview_urls.map((url) => url.replace(/^.*\/(projects\/.*\/.*)$/, "$1"));
		await Promise.all(image_preview_urls.map((url) => CloudStorageInstance.deleteFile(url)));

		await ProjectCollection.delete(id);

		return successResponse(200, "Project deleted successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed deleting project", err);
	}
});
