import { Firestore } from "@google-cloud/firestore";
import { GCP_projectId, GCP_serviceAccountCredentials } from "@/config/GCP";
import { CustomErrorResponse } from "@/lib/CustomErrorResponse";

const firestore = new Firestore({
	projectId: GCP_projectId,
	credentials: GCP_serviceAccountCredentials
});

export class FirestoreCollection<T extends { id: string }> {
	readonly #collection: FirebaseFirestore.CollectionReference<T>;

	constructor(collectionRef: string | FirestoreCollection<T>) {
		if (typeof collectionRef === "string") {
			this.#collection = firestore.collection(collectionRef) as FirebaseFirestore.CollectionReference<T>;
		} else if (collectionRef instanceof FirestoreCollection) {
			this.#collection = collectionRef.ref();
		} else {
			throw new Error("Invalid collection reference");
		}
	}

	ref(): FirebaseFirestore.CollectionReference<T> {
		return this.#collection;
	}

	async findAll<K extends keyof T>(fields?: K[]): Promise<Pick<T, K>[] | T[]> {
		try {
			const snapshot = await this.#collection.get();

			return snapshot.docs.map((doc) => {
				const data = doc.data();
				if (fields && fields.length > 0) {
					return Object.fromEntries(Object.entries(data).filter(([key]) => fields.includes(key as K))) as Pick<T, K>;
				}

				return data;
			});
		} catch (err) {
			throw new CustomErrorResponse(500, "Failed getting documents", err);
		}
	}

	async findByField(field: keyof T, operator: FirebaseFirestore.WhereFilterOp, value: unknown): Promise<T | null> {
		try {
			const snapshot = await this.#collection.where(field as string, operator, value).get();

			if (snapshot.empty || !snapshot.docs.length) {
				return null;
			}
			const firstDoc = snapshot.docs[0];
			return firstDoc?.data() ?? null;
		} catch (err) {
			throw new CustomErrorResponse(500, `Failed finding document`, err);
		}
	}

	async create(data: T): Promise<string> {
		try {
			await this.#collection.doc(data.id).set(data);

			return data.id;
		} catch (err) {
			throw new CustomErrorResponse(500, "Failed creating document", err);
		}
	}

	async update(id: string, data: Partial<T>): Promise<string> {
		try {
			const docRef = this.#collection.doc(id);

			const doc = await docRef.get();
			if (!doc.exists) {
				throw new CustomErrorResponse(404, `Document does not exist`);
			}

			await docRef.update(data);

			return id;
		} catch (err) {
			throw new CustomErrorResponse(500, `Failed updating document`, err);
		}
	}

	async delete(id: string): Promise<string> {
		try {
			const docRef = this.#collection.doc(id);

			const doc = await docRef.get();
			if (!doc.exists) {
				throw new CustomErrorResponse(404, `Document does not exist`);
			}

			await docRef.delete();

			return id;
		} catch (err) {
			throw new CustomErrorResponse(500, `Failed deleting document`, err);
		}
	}

	static deleteCollectionRecursive = async (collectionPath: string): Promise<void> => {
		const deleteRecursive = async (docRef: FirebaseFirestore.DocumentReference): Promise<void> => {
			try {
				const subcollections = await docRef.listCollections();

				await Promise.all(subcollections.map((subcollection) => this.deleteCollectionRecursive(subcollection.path)));

				await docRef.delete();
			} catch (err) {
				throw new CustomErrorResponse(500, `Error deleting document ${docRef.path}`, err);
			}
		};

		try {
			const collectionRef = firestore.collection(collectionPath);
			const docs = await collectionRef.listDocuments();

			await Promise.all(docs.map((doc) => deleteRecursive(doc)));
		} catch (err) {
			throw new CustomErrorResponse(500, `Error deleting collection ${collectionPath}`, err);
		}
	};
}
