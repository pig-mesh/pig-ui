<script setup lang="ts">
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormat.vue';
import { formatStartNodeShow } from '/@/api/flow/task';
import { defineExpose, onMounted, ref, watch } from 'vue';

let props = defineProps({
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
		dafault: () => {},
	},
	selectUserNodeId: {
		type: Array,
		dafault: () => [],
	},
});
const row = ref([]);

const queryData = (p) => {
	var data = {
		flowId: props.flowId,
		processInstanceId: props.processInstanceId,
		paramMap: p,
		taskId: props.taskId,
	};
	formatStartNodeShow(data).then((res) => {
		row.value = res.data;
	});
};
watch(
	() => props.formData,
	(val) => {
		setTimeout(function () {
			if (new Date().getTime() - formDataChangeTime.value > 500) {
				formDataChangeTime.value = new Date().getTime();
				queryData(val);
			}
		}, 600);
	}
);
const formDataChangeTime = ref();
onMounted(() => {
	formDataChangeTime.value = new Date().getTime();
	queryData({});
});

const validate = () => {
	for (var k of props.selectUserNodeId) {
		var d = nodeUser.value[k];
		if (d && d.length > 0) {
		} else {
			return false;
		}
	}

	return true;
};

const nodeUser = ref({});

const formatSelectNodeUser = () => {
	var obj = {};

	for (var k of props.selectUserNodeId) {
		var d = nodeUser.value[k];
		obj[k + '_assignee_select'] = d;
	}

	return obj;
};

defineExpose({ validate, formatSelectNodeUser });
</script>

<template>
	<flow-node-format :row="row" :node-user="nodeUser" :disableSelect="disableSelect" ref="flowNodeFormatRef"></flow-node-format>
</template>
