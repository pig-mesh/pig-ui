export type AreaTranslator = (key: string) => string;

export const createAreaTypeOptions = (t: AreaTranslator) => [
	{ value: '0', label: t('area.country') },
	{ value: '1', label: t('area.province') },
	{ value: '2', label: t('area.city') },
	{ value: '3', label: t('area.county') },
	{ value: '4', label: t('area.street') },
];

export const getAreaTypeLabel = (t: AreaTranslator, value: string): string =>
	createAreaTypeOptions(t).find((item) => item.value === value)?.label || '-';
