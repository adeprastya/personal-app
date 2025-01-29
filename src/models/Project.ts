import { FirestoreCollection } from "@/services/CloudFirestore";
import type { Project } from "@/types/Project";

const ProjectCollection = new FirestoreCollection<Project>("projects");

export default ProjectCollection;
