<!--
  DictSelect 字典下拉选择组件（全局注册）

  功能：基于 el-select 封装的字典选择器，支持两种数据源：
  1. 通过 dictType 指定字典类型，自动从后端 API 加载选项
  2. 通过 options 手动传入选项数组

  用法示例：
  <dict-select v-model="form.status" dict-type="status_type" />
  <dict-select v-model="form.type" :options="customOptions" :multiple="true" />

  Props：
  - modelValue : string | number | array - 选中值（v-model）
  - dictType   : string - 字典类型编码，自动从 API 加载选项
  - options    : DictOption[] - 手动传入的选项（与 dictType 二选一）
  - placeholder / multiple / disabled / clearable - el-select 透传属性

  Events：
  - update:modelValue - 值变化（v-model）
  - change            - 值变化回调
-->
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
		<el-option v-for="{ label, value } in dictData" :key="value" :label="label" :value="value" />
	</el-select>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { getDicts } from '/@/api/admin/dict';

interface DictOption {
	label: string;
	value: string | number;
	elTagType?: string;
	elTagClass?: string;
}

const props = withDefaults(
	defineProps<{
		modelValue?: string | number | (string | number)[];
		options?: DictOption[] | string[];
		placeholder?: string;
		multiple?: boolean;
		disabled?: boolean;
		clearable?: boolean;
		/** 字典类型编码，指定后自动从 API 加载选项 */
		dictType?: string;
	}>(),
	{
		modelValue: undefined,
		options: () => [],
		placeholder: '',
		multiple: false,
		disabled: false,
		clearable: true,
		dictType: '',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: string | number | (string | number)[]): void;
	(e: 'change', value: string | number | (string | number)[]): void;
}>();

/** 通过 API 加载的字典数据 */
const dictList = ref<DictOption[]>([]);

/** 从后端加载字典数据 */
const loadDictData = async () => {
	if (!props.dictType) return;
	const { data } = await getDicts(props.dictType);
	dictList.value = data.map(({ label, value }: any) => ({ label, value }));
};

onMounted(loadDictData);

// dictType 变化时重新加载数据
watch(() => props.dictType, loadDictData);

/**
 * 最终的选项数据：
 * - 有 dictType 时使用 API 加载的数据
 * - 否则使用 props.options（兼容纯字符串数组）
 */
const dictData = computed<DictOption[]>(() => {
	if (props.dictType) return dictList.value;

	return props.options.map((item) => {
		if (typeof item === 'string') {
			return { label: item, value: item };
		}
		return item as DictOption;
	});
});

const handleChange = (value: string | number | (string | number)[]) => {
	emit('update:modelValue', value);
	emit('change', value);
};
</script>
