<script setup lang="ts">
import type { PropType } from 'vue';
import { watchDebounced } from '@vueuse/core';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormat.vue';
import { formatStartNodeShow } from '/@/api/flow/task';

const props = defineProps({
	flowId: {
		type: String,
		default: '',
	},
	disableSelect: {
		type: Boolean,
		default: false,
	},
	taskId: {
		type: String,
		default: '',
	},
	processInstanceId: {
		type: String,
		default: '',
	},
	formData: {
		type: Object,
		default: () => ({}),
	},
	selectUserNodeId: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
});
const row = ref([]);

const hasQueryCondition = computed(() => !!props.flowId || !!props.processInstanceId);

const normalizeParamMap = (p: unknown) => {
	if (!p || typeof p !== 'object' || Array.isArray(p)) return {};
	return p as Record<string, any>;
};

const queryData = (p: unknown = {}) => {
	if (!hasQueryCondition.value) {
		row.value = [];
		return;
	}

	const data = {
		flowId: props.flowId,
		processInstanceId: props.processInstanceId,
		paramMap: normalizeParamMap(p),
		taskId: props.taskId,
	};
	formatStartNodeShow(data).then((res) => {
		row.value = res.data;
	});
};

watchDebounced(
	() => [props.flowId, props.processInstanceId, props.taskId, props.formData],
	([, , , formData]) => queryData(formData),
	{ immediate: true, deep: true, debounce: 500 }
);

const validate = () => {
	for (const k of props.selectUserNodeId) {
		const d = nodeUser.value[k];
		if (!d || d.length === 0) {
			return false;
		}
	}
	return true;
};

const nodeUser = ref<Record<string, any>>({});

const formatSelectNodeUser = () => {
	const obj: Record<string, any> = {};
	for (const k of props.selectUserNodeId) {
		const d = nodeUser.value[k];
		obj[k + '_assignee_select'] = d;
	}
	return obj;
};

defineExpose({ validate, formatSelectNodeUser, nodeUser });
</script>

<template>
	<flow-node-format :row="row" :node-user="nodeUser" :disableSelect="disableSelect" ref="flowNodeFormatRef"></flow-node-format>
</template>
