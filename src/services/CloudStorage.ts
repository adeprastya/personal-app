import { Storage } from "@google-cloud/storage";
import { GCP_projectId, GCP_bucketName, GCP_serviceAccountCredentials } from "@/config/GCP";
import { CustomErrorResponse } from "@/utils/CustomErrorResponse";

const storage = new Storage({
	projectId: GCP_projectId,
	credentials: GCP_serviceAccountCredentials
});
const bucket = storage.bucket(GCP_bucketName as string);

class CloudStorage {
	#bucket = bucket;

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
			console.error(err);
			throw new CustomErrorResponse(500, "Failed to upload file", err);
		}
	};

	deleteFile = async (path: string) => {
		try {
			const file = bucket.file(path);
			await file.delete();
		} catch (err) {
			console.error(err);
			throw new CustomErrorResponse(500, "Failed deleting image", err);
		}
	};
}

export const CloudStorageInstance = new CloudStorage();
