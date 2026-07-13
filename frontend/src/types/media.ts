export type MediaCategory = 'Movie' | 'TV Series';

export interface MediaThumbnails {
	small: ImageMetadata;
	medium: ImageMetadata;
	large: ImageMetadata;
}

export interface MediaItem {
	id: string;
	title: string;
	year: number;
	category: MediaCategory;
	rating: string;
	thumbnail: MediaThumbnails;
	thumbnailAlt: string;
	isBookmarked: boolean;
	detailHref: string;
}
