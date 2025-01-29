export type Project = {
	id: string;
	created_at: string;
	image_url: string;
	title: string;
	description: string;
	technologies: Array<string>;
	site_url?: string | null;
	source_code_url?: string | null;
	demo_url?: string | null;
};
