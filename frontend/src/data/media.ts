import autosportLarge from '../assets/media/autosport-the-series/large.jpg';
import autosportMedium from '../assets/media/autosport-the-series/medium.jpg';
import autosportSmall from '../assets/media/autosport-the-series/small.jpg';
import duringTheHuntLarge from '../assets/media/during-the-hunt/large.jpg';
import duringTheHuntMedium from '../assets/media/during-the-hunt/medium.jpg';
import duringTheHuntSmall from '../assets/media/during-the-hunt/small.jpg';
import earthsUntouchedLarge from '../assets/media/earths-untouched/large.jpg';
import earthsUntouchedMedium from '../assets/media/earths-untouched/medium.jpg';
import earthsUntouchedSmall from '../assets/media/earths-untouched/small.jpg';
import noLandBeyondLarge from '../assets/media/no-land-beyond/large.jpg';
import noLandBeyondMedium from '../assets/media/no-land-beyond/medium.jpg';
import noLandBeyondSmall from '../assets/media/no-land-beyond/small.jpg';
import theDiaryLarge from '../assets/media/the-diary/large.jpg';
import theDiaryMedium from '../assets/media/the-diary/medium.jpg';
import theDiarySmall from '../assets/media/the-diary/small.jpg';
import theGreatLandsLarge from '../assets/media/the-great-lands/large.jpg';
import theGreatLandsMedium from '../assets/media/the-great-lands/medium.jpg';
import theGreatLandsSmall from '../assets/media/the-great-lands/small.jpg';
import type { MediaItem } from '../types/media';

export const previewMediaItems = [
	{
		id: 'the-great-lands',
		title: 'The Great Lands',
		year: 2019,
		category: 'Movie',
		rating: 'E',
		thumbnail: {
			small: theGreatLandsSmall,
			medium: theGreatLandsMedium,
			large: theGreatLandsLarge,
		},
		thumbnailAlt: '',
		isBookmarked: false,
		detailHref: '/media/the-great-lands',
	},
	{
		id: 'the-diary',
		title: 'The Diary',
		year: 2019,
		category: 'TV Series',
		rating: 'PG',
		thumbnail: { small: theDiarySmall, medium: theDiaryMedium, large: theDiaryLarge },
		thumbnailAlt: '',
		isBookmarked: false,
		detailHref: '/media/the-diary',
	},
	{
		id: 'no-land-beyond',
		title: 'No Land Beyond',
		year: 2019,
		category: 'Movie',
		rating: 'E',
		thumbnail: {
			small: noLandBeyondSmall,
			medium: noLandBeyondMedium,
			large: noLandBeyondLarge,
		},
		thumbnailAlt: '',
		isBookmarked: false,
		detailHref: '/media/no-land-beyond',
	},
	{
		id: 'earths-untouched',
		title: 'Earth’s Untouched',
		year: 2017,
		category: 'Movie',
		rating: '18+',
		thumbnail: {
			small: earthsUntouchedSmall,
			medium: earthsUntouchedMedium,
			large: earthsUntouchedLarge,
		},
		thumbnailAlt: '',
		isBookmarked: true,
		detailHref: '/media/earths-untouched',
	},
	{
		id: 'autosport-the-series',
		title: 'Autosport the Series',
		year: 2016,
		category: 'TV Series',
		rating: '18+',
		thumbnail: { small: autosportSmall, medium: autosportMedium, large: autosportLarge },
		thumbnailAlt: '',
		isBookmarked: false,
		detailHref: '/media/autosport-the-series',
	},
	{
		id: 'during-the-hunt',
		title: 'During the Hunt',
		year: 2016,
		category: 'TV Series',
		rating: 'PG',
		thumbnail: {
			small: duringTheHuntSmall,
			medium: duringTheHuntMedium,
			large: duringTheHuntLarge,
		},
		thumbnailAlt: '',
		isBookmarked: false,
		detailHref: '/media/during-the-hunt',
	},
] as const satisfies readonly MediaItem[];
