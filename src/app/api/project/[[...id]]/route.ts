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

export const GET = ErrorHandler(async () => {
	try {
		const result = await ProjectCollection.findAll();

		const projects = result.map((project) => ({
			...project,
			created_at: timestampToReadable(project.created_at)
		}));

		return successResponse(200, "All projects retrieved successfully", projects);
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed getting all projects", err);
	}
});

export const POST = ErrorHandler(async (req: NextRequest) => {
	try {
		const reqForm = await req.formData();
		const reqFile = reqForm.get("image") as File;
		let reqData = reqForm.get("data") as string;

		const fileToValidate = {
			mimetype: reqFile.type,
			size: reqFile.size
		};

		validate(ImageFileSchema, fileToValidate);

		try {
			reqData = JSON.parse(reqData);
		} catch (err) {
			throw new CustomErrorResponse(400, "Data must be a valid JSON object", err);
		}

		const cleanData = Object.fromEntries(
			Object.entries(reqData).filter(([, value]) => value !== "" && value !== null && value !== undefined)
		);

		validate(CreateProjectSchema, cleanData);

		const buffer = Buffer.from(await reqFile.arrayBuffer());
		const mimetype = reqFile.type;

		const id = generateId();
		const image_url = await CloudStorageInstance.storeFile(`projects/${id}`, { mimetype, buffer });

		const data = {
			...(reqData as Partial<Project>),
			id,
			image_url,
			created_at: new Date().toISOString()
		};
		await ProjectCollection.create(data as Project);

		return successResponse(201, "Project created successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed creating project", err);
	}
});

export const PATCH = ErrorHandler<Params>(async (req: NextRequest, { params }) => {
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

		const data = {
			...(reqBody as Partial<Project>)
		};

		await ProjectCollection.update(id, data);

		return successResponse(200, "Project updated successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed updating project", err);
	}
});

export const DELETE = ErrorHandler<Params>(async (req: NextRequest, { params }) => {
	try {
		const id = (await params).id[0];

		validate(IdSchema, id);

		const tempData = await ProjectCollection.findByField("id", "==", id);
		if (!tempData) {
			throw new CustomErrorResponse(500, "Project does not exist");
		}

		const image_url = tempData.image_url.split("/").slice(-1)[0];
		await CloudStorageInstance.deleteFile(`projects/${image_url}`);

		const isDeleted = await ProjectCollection.delete(id);

		if (!isDeleted) {
			throw new CustomErrorResponse(500, "Failed deleting project");
		}

		return successResponse(200, "Project deleted successfully");
	} catch (err) {
		throw new CustomErrorResponse(500, "Failed deleting project", err);
	}
});
