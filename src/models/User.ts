import { FirestoreCollection } from "@/services/CloudFirestore";
import type { User } from "@/types/User";

const UserCollection = new FirestoreCollection<User>("users");

export default UserCollection;
