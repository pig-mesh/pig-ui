<template>
	<el-cascader :options="optionsData" :disabled="disabled" v-model="selectedOptions" @change="handleChange" />
</template>
<script setup lang="ts" name="china-area">
import { provinceAndCityData, provinceAndCityDataPlus, regionData, regionDataPlus } from '/@/utils/chinaArea';

const emit = defineEmits(['update:modelValue', 'change']);
const optionsData = ref();
const props = defineProps({
	// 当前的值
	modelValue: String,
	// 类型 (二级联动，三级联动)
	type: {
		type: Number,
		default: 3,
	},
	plus: {
		type: Boolean,
		default: false,
	},
	// 是否禁用
	disabled: {
		type: Boolean,
		default: () => false,
	},
});

const selectedOptions = computed({
	get: () => {
		return props.modelValue?.split(',');
	},
	set: (val) => {
		emit('update:modelValue', val?.join(','));
	},
});

const handleChange = (value: String[]) => {
	emit('change', value.join(','));
};

onMounted(() => {
	const { plus, type } = props;
	if (plus) {
		optionsData.value = type === 2 ? provinceAndCityDataPlus : regionDataPlus;
	} else {
		optionsData.value = type === 2 ? provinceAndCityData : regionData;
	}
});
</script>
