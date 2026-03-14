import { param } from '/@/stores/param';
import { getValue } from '/@/api/admin/param';
import { ref } from 'vue';
import { useAsyncState } from '@vueuse/core';

export function useParam(paramType: string) {
	const { getParam, setParam } = param();
	const cached = getParam(paramType);

	if (cached) return ref(cached);

	const { state } = useAsyncState(
		() => getValue(paramType).then(({ data }) => {
			if (data) setParam(paramType, data);
			return data || '';
		}),
		''
	);

	return state;
}
