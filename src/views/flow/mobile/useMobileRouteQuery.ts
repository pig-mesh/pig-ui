import { useUrlSearchParams } from '@vueuse/core';
import { useRoute } from 'vue-router';

function toQueryString(value: unknown) {
	if (Array.isArray(value)) return String(value[0] || '');
	return typeof value === 'string' ? value : '';
}

export function useMobileRouteQuery() {
	const route = useRoute();
	const hashParams = useUrlSearchParams('hash', { write: false });
	const historyParams = useUrlSearchParams('history', { write: false });

	function getQueryValue(...keys: string[]) {
		for (const key of keys) {
			const routeValue = toQueryString(route.query[key]);
			if (routeValue) return routeValue;

			const hashValue = toQueryString(hashParams[key]);
			if (hashValue) return hashValue;

			const historyValue = toQueryString(historyParams[key]);
			if (historyValue) return historyValue;
		}
		return '';
	}

	return {
		getQueryValue,
	};
}
