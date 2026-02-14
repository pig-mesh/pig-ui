import { dict } from '/@/stores/dict';
import { getDicts } from '/@/api/admin/dict';
import { ref, toRefs } from 'vue';

interface DictItem {
	label: string;
	value: string;
	elTagType: string;
	elTagClass: string;
}

export function useDict(...args: string[]) {
	const res = ref<Record<string, DictItem[]>>({});
	const { getDict, setDict } = dict();

	args.forEach((dictType) => {
		res.value[dictType] = [];
		const cached = getDict(dictType);
		if (cached) {
			res.value[dictType] = cached;
		} else {
			getDicts(dictType).then(({ data }) => {
				res.value[dictType] = data.map(
					({ label, value, listClass: elTagType, cssClass: elTagClass }: any) => ({
						label, value, elTagType, elTagClass,
					})
				);
				setDict(dictType, res.value[dictType]);
			});
		}
	});

	return toRefs(res.value);
}
