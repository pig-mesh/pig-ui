<template>
	<formCreate
		:rule="rule"
		:option="options"
		:modelValue="modelValue"
		@update:modelValue="emit('update:modelValue', $event)"
		:api="api"
		@update:api="emit('update:api', $event)"
	/>
</template>

<script setup lang="ts">
import { Api, Rule } from '@form-create/element-ui';

interface Props {
	rule: Rule;
	modelValue: any;
	api?: Api;
	submitBtn?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	rule: () => [],
	modelValue: () => ({}),
	api: undefined,
	submitBtn: false,
});

const emit = defineEmits(['update:modelValue', 'update:api']);

// Default options
const options = computed(() => ({
	submitBtn: props.submitBtn,
}));
</script>

<style scoped lang="scss">
:deep(.fc-form-row) {
	margin-top: 20px !important;
}

:deep(.el-col.el-col-24.fc-form-col) {
	margin-top: 10px !important;
}
</style>
