import { NextRequest } from "next/server";
import type { Project } from "@/types/Project";
import ProjectCollection from "@/models/Project";
import { generateId, timestampToReadable } from "@/utils/helper";
import { successResponse } from "@/utils/response";
import { CloudStorageInstance } from "@/services/CloudStorage";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";
import { CreateProjectSchema, ImageFileSchema, UpdateProjectSchema, IdSchema } from "@/validations/ProjectSchema";
import { validate } from "@/validations/validate";
import { ErrorHandler } from "@/middlewares/ErrorHandler";

type Params = { params: Promise<{ id: string }> };

// PUBLIC API
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

			return successResponse(200, "Project retrieved successfully", project);
		}

		const projects = await ProjectCollection.findAll();

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

// PROTECTED API
export const POST = ErrorHandler(async (req: NextRequest) => {
	try {
		const reqForm = await req.formData();
		const reqImage = reqForm.get("image") as File;
		let reqData = reqForm.get("data") as string;

		validate(ImageFileSchema, {
			mimetype: reqImage?.type,
			size: reqImage?.size
		});

		try {
			reqData = JSON.parse(reqData);
		} catch (err) {
			throw new CustomErrorResponse(400, "Data must be a valid JSON object", err);
		}

		const cleanData = Object.fromEntries(
			Object.entries(reqData).filter(([, value]) => value !== "" && value !== null && value !== undefined)
		);

		validate(CreateProjectSchema, cleanData);

		const id = generateId();
		const image = {
			mimetype: reqImage.type,
			buffer: Buffer.from(await reqImage.arrayBuffer())
		};
		const image_url = await CloudStorageInstance.storeFile(`projects/${id}`, image);

		const data = {
			...(reqData as Partial<Project>),
			image_url,
			id,
			created_at: new Date().toISOString()
		};
		await ProjectCollection.create(data as Project);

		return successResponse(201, "Project created successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed creating project", err);
	}
});

// PROTECTED API
export const PATCH = ErrorHandler(async (req: NextRequest, { params }: Params) => {
	try {
		const id = (await params).id[0];
		let reqBody = await req.text();

		try {
			reqBody = JSON.parse(reqBody);
		} catch (err) {
			throw new CustomErrorResponse(400, "Data must be a valid JSON object", err);
		}

		validate(IdSchema, id);
		validate(UpdateProjectSchema, reqBody);

		await ProjectCollection.update(id, reqBody as Partial<Project>);

		return successResponse(200, "Project updated successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed updating project", err);
	}
});

// PROTECTED API
export const DELETE = ErrorHandler(async (req: NextRequest, { params }: Params) => {
	try {
		const id = (await params).id[0];

		validate(IdSchema, id);

		const tempData = await ProjectCollection.findByField("id", "==", id);
		if (!tempData) {
			throw new CustomErrorResponse(404, "Project not found");
		}

		const image_url = tempData.image_url.split("/").slice(-1)[0];
		await CloudStorageInstance.deleteFile(`projects/${image_url}`);

		await ProjectCollection.delete(id);

		return successResponse(200, "Project deleted successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed deleting project", err);
	}
});
