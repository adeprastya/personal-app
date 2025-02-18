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

	image: {
		thumbnail_url: string;
		preview_urls: Array<string>;
	};
};
