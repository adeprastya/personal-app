import type { Project } from "@/types/Project";
import { NextRequest } from "next/server";
import { filterEmptyObjectFields, generateId, timestampToReadable } from "@/utils/helper";
import { CloudStorageInstance } from "@/services/CloudStorage";
import ProjectCollection from "@/models/Project";
import {
	CreateProjectSchema,
	ImageFileSchema,
	UpdateProjectSchema,
	IdSchema,
	UpdateProjectPreviewDetailSchema
} from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";
import { CustomErrorResponse } from "@/lib/CustomErrorResponse";
import { ErrorHandler } from "@/lib/ErrorHandler";
import { successResponse } from "@/lib/response";

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
		const reqPreviews = reqForm.getAll("previews") as File[];

		if (reqPreviews.length > 6) {
			throw new CustomErrorResponse(400, "Too many preview files to add, max 6 previews per project");
		}

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
		const image_thumbnail_url = await CloudStorageInstance.storeFile(`projects/${id}/thumbnail`, thumbnail);

		const previews = reqPreviews.map(async (preview) => ({
			mimetype: preview.type,
			buffer: Buffer.from(await preview.arrayBuffer())
		}));
		const image_preview_urls = await Promise.all(
			previews.map(async (preview, i) =>
				CloudStorageInstance.storeFile(`projects/${id}/preview-${i + 1}`, await preview)
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

		// ----- Handle Optional Data Update -----
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

		// ----- Handle Optional Thumbnail Update -----
		const reqThumbnail = reqForm.get("thumbnail") as File;
		if (reqThumbnail) {
			validate(ImageFileSchema, {
				mimetype: reqThumbnail.type,
				size: reqThumbnail.size
			});

			const thumbnailPath = currentProject.image_thumbnail_url.replace(/^.*\/(projects\/.*\/.*)$/, "$1");

			if (currentProject.image_thumbnail_url) {
				await CloudStorageInstance.deleteFile(thumbnailPath);
			}

			const thumbnailBuffer = Buffer.from(await reqThumbnail.arrayBuffer());
			const thumbnailFile = { mimetype: reqThumbnail.type, buffer: thumbnailBuffer };
			const newThumbnailUrl = await CloudStorageInstance.storeFile(`projects/${id}/thumbnail`, thumbnailFile);

			reqData.image_thumbnail_url = newThumbnailUrl;
		}

		// ----- Handle Optional Preview Images Update -----
		const reqPreviews = reqForm.getAll("previews") as File[];
		const reqPreviewDetailString = reqForm.get("preview_detail") as string;
		let reqPreviewDetail: { update: string[]; delete: string[] } = { update: [], delete: [] };
		if (reqPreviewDetailString) {
			try {
				reqPreviewDetail = JSON.parse(reqPreviewDetailString);
			} catch (err) {
				throw new CustomErrorResponse(400, "preview_detail must be a valid JSON object", err);
			}
			validate(UpdateProjectPreviewDetailSchema, reqPreviewDetail);
		}
		if (Array.isArray(reqPreviews) && reqPreviews.length > 0) {
			reqPreviews.forEach((preview) => {
				validate(ImageFileSchema, {
					mimetype: preview.type,
					size: preview.size
				});
			});
		}

		let previewUrls: string[] = Array.isArray(currentProject.image_preview_urls)
			? [...currentProject.image_preview_urls]
			: [];

		// --- Handle Preview Additions ---
		if (Array.isArray(reqPreviewDetail.update) && reqPreviewDetail.update.length <= 0 && reqPreviews.length > 0) {
			if (previewUrls.length + reqPreviews.length > 6) {
				throw new CustomErrorResponse(400, "Too many preview files to add, max 6 previews per project");
			}

			const getNextPreviewIndex = (urls: string[]): number => {
				let max = 0;
				urls.forEach((url) => {
					const match = url.match(/preview-(\d+)/);
					if (match) {
						const num = parseInt(match[1], 10);
						if (num > max) max = num;
					}
				});
				return max + 1;
			};

			for (const file of reqPreviews) {
				if (previewUrls.length < 7) {
					const newPreviewBuffer = Buffer.from(await file.arrayBuffer());
					const newPreviewFile = { mimetype: file.type, buffer: newPreviewBuffer };
					const newNumber = getNextPreviewIndex(previewUrls);

					const newPreviewUrl = await CloudStorageInstance.storeFile(
						`projects/${id}/preview-${newNumber}`,
						newPreviewFile
					);

					previewUrls.push(newPreviewUrl);
				}
			}
		}

		// --- Handle Preview Updates ---
		if (
			Array.isArray(reqPreviewDetail.update) &&
			reqPreviewDetail.update.length > 0 &&
			reqPreviewDetail.update.length !== reqPreviews.length
		) {
			throw new CustomErrorResponse(400, "Number of preview files and update list not match");
		}
		if (Array.isArray(reqPreviewDetail.update) && reqPreviewDetail.update.length > 0 && reqPreviews.length > 0) {
			reqPreviewDetail.update.forEach((url) => {
				if (!previewUrls.includes(url)) {
					throw new CustomErrorResponse(400, "Invalid preview url in update list");
				}
			});

			await Promise.all(
				reqPreviewDetail.update.map(async (willUpdatedUrl, i) => {
					const file = reqPreviews[i];

					const oldFilePath = willUpdatedUrl.replace(/^.*\/(projects\/.*\/.*)$/, "$1");
					await CloudStorageInstance.deleteFile(oldFilePath);

					const newPreviewBuffer = Buffer.from(await file.arrayBuffer());
					const newPreviewFile = { mimetype: file.type, buffer: newPreviewBuffer };

					const cleanPreviewPath = oldFilePath.replace(/\.[^/.]+$/, "");

					const newPreviewUrl = await CloudStorageInstance.storeFile(cleanPreviewPath, newPreviewFile);

					const index = previewUrls.indexOf(willUpdatedUrl);
					if (index !== -1) {
						previewUrls[index] = newPreviewUrl;
					} else {
						previewUrls.push(newPreviewUrl);
					}
				})
			);
		}

		// --- Handle Preview Deletions ---
		if (Array.isArray(reqPreviewDetail.delete) && reqPreviewDetail.delete.length > 0) {
			if (reqPreviewDetail.delete.length > previewUrls.length) {
				throw new CustomErrorResponse(400, "Too many preview files to delete");
			}
			reqPreviewDetail.delete.forEach((url) => {
				if (!previewUrls.includes(url)) {
					throw new CustomErrorResponse(400, "Invalid preview url in delete list");
				}
			});

			const deletedUrls = await Promise.all(
				reqPreviewDetail.delete.map(async (willDeletedUrl) => {
					const filePath = willDeletedUrl.replace(/^.*\/(projects\/.*\/.*)$/, "$1");

					await CloudStorageInstance.deleteFile(filePath);

					return willDeletedUrl;
				})
			);

			previewUrls = previewUrls.filter((url) => !deletedUrls.includes(url));
		}

		reqData.image_preview_urls = previewUrls;

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
