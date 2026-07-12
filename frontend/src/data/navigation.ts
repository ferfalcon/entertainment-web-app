export type NavIconName = 'home' | 'movies' | 'tv-series' | 'bookmarked';

export interface NavItem {
	id: NavIconName;
	label: string;
	href: string;
	icon: NavIconName;
}

export const primaryNavItems = [
	{ id: 'home', label: 'Home', href: '/', icon: 'home' },
	{ id: 'movies', label: 'Movies', href: '/movies', icon: 'movies' },
	{ id: 'tv-series', label: 'TV Series', href: '/tv-series', icon: 'tv-series' },
	{ id: 'bookmarked', label: 'Bookmarked', href: '/bookmarked', icon: 'bookmarked' },
] as const satisfies readonly NavItem[];
