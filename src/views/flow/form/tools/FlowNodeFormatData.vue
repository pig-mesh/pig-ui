<script setup lang="ts">
import type { PropType } from 'vue';
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

const queryData = (p: Record<string, any>) => {
	const data = {
		flowId: props.flowId,
		processInstanceId: props.processInstanceId,
		paramMap: p,
		taskId: props.taskId,
	};
	formatStartNodeShow(data).then((res) => {
		row.value = res.data;
	});
};

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
	() => props.formData,
	(val) => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => queryData(val), 500);
	}
);

onMounted(() => {
	queryData({});
});

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
