import { Bucket, Storage } from "@google-cloud/storage";
import { GCP_projectId, GCP_bucketName, GCP_serviceAccountCredentials } from "@/config/GCP";
import { CustomErrorResponse } from "@/lib/CustomErrorResponse";

const storage = new Storage({
	projectId: GCP_projectId,
	credentials: GCP_serviceAccountCredentials
});
const bucket = storage.bucket(GCP_bucketName as string);

export class CloudStorage {
	readonly #bucket: Bucket;

	constructor(bucket: Bucket) {
		this.#bucket = bucket;
	}

	storeFile = async (path: string, { mimetype, buffer }: { mimetype: string; buffer: Buffer }): Promise<string> => {
		try {
			if (!Buffer.isBuffer(buffer)) {
				throw new CustomErrorResponse(400, "Invalid file buffer");
			}

			const fileExtension = mimetype.split("/")[1];
			if (!fileExtension) {
				throw new CustomErrorResponse(400, "Unable to determine file extension");
			}

			const fileName = `${path}.${fileExtension}`;
			const fileRef = this.#bucket.file(fileName);

			await fileRef.save(buffer, {
				metadata: {
					contentType: mimetype
				},
				resumable: false
			});

			return `https://storage.googleapis.com/${GCP_bucketName}/${fileName}`;
		} catch (err) {
			throw new CustomErrorResponse(500, "Failed to upload file", err);
		}
	};

	deleteFile = async (path: string) => {
		try {
			const file = this.#bucket.file(path);
			await file.delete();
		} catch (err) {
			throw new CustomErrorResponse(500, "Failed deleting image", err);
		}
	};
}

export const CloudStorageInstance = new CloudStorage(bucket);
