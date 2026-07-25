export type MetricIconName = 'sessions' | 'visitors' | 'pages' | 'scroll' | 'deadClick' | 'rageClick';

export interface MetricCard {
	label: string;
	value: string;
	bars: number[];
	icon: MetricIconName;
}

export interface DistributionItem {
	name: string;
	value: number;
	percentage: string;
}

export interface RankingItem {
	name: string;
	displayName: string;
	value: number;
	progress: string;
}

export type DistributionKind = 'device' | 'browser';
export type RankingKind = 'referrer' | 'title' | 'popular';
