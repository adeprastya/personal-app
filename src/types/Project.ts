export type Project = {
	id: string;
	created_at: string;

	title: string;
	tagline: string;
	description: string;
	technologies: Array<string>;

	site_url?: string | null;
	source_code_url?: string | null;
	demo_url?: string | null;

	image_thumbnail_url: string;
	image_preview_urls: Array<string>;
};
