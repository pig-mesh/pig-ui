<template>
	<el-select
		:model-value="modelValue"
		:placeholder="placeholder"
		:multiple="multiple"
		:disabled="disabled"
		:clearable="clearable"
		class="w-full"
		@update:model-value="handleChange"
	>
		<el-option v-for="item in dictData" :key="item.value" :label="item.label" :value="item.value" />
	</el-select>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { getDicts } from '/@/api/admin/dict';

interface DictOption {
	label: string;
	value: string | number;
	elTagType?: string;
	elTagClass?: string;
}

interface Props {
	modelValue?: string | number | (string | number)[];
	options?: DictOption[] | string[];
	placeholder?: string;
	multiple?: boolean;
	disabled?: boolean;
	clearable?: boolean;
	dictType?: string;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: undefined,
	options: () => [],
	placeholder: '请选择',
	multiple: false,
	disabled: false,
	clearable: true,
	dictType: '',
});

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number | (string | number)[]): void;
	(e: 'change', value: string | number | (string | number)[]): void;
}>();

const dictList = ref<DictOption[]>([]);

async function loadDictData() {
	if (props.dictType) {
    const res = await getDicts(props.dictType);
    dictList.value = res.data.map((p: any) => ({
      label: p.label,
      value: p.value
    }));
	}
}

onMounted(() => {
	loadDictData();
});

const dictData = computed<DictOption[]>(() => {
	if (props.dictType) {
		return dictList.value;
	}

	return props.options.map((item) => {
		if (typeof item === 'string') {
			return {
				label: item,
				value: item,
			};
		}
		return item as DictOption;
	});
});

function handleChange(value: string | number | (string | number)[]) {
	emit('update:modelValue', value);
	emit('change', value);
}
</script>
