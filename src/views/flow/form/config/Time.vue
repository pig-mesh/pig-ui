<script setup lang="ts">
let props = defineProps({
	id: {
		type: String,
		default: '',
	},
});

import { useFlowStore } from '../../workflow/stores/flow';

let flowStore = useFlowStore();

var config = computed(() => {
	let step2 = flowStore.step2;
	let filterElement = step2.filter((res) => res.id === props.id)[0];
	return filterElement;
});
</script>

<template>
	<div>
		<el-form-item label="最小值">
			<el-time-picker arrow-control size="default" class="formDate" v-model="config.props.min" value-format="HH:mm:ss" />
		</el-form-item>
		<el-form-item label="最大值">
			<el-time-picker arrow-control size="default" class="formDate" v-model="config.props.max" value-format="HH:mm:ss" />
		</el-form-item>

		<el-form-item label="默认值">
			<el-time-picker arrow-control size="default" class="formDate" value-format="HH:mm:ss" v-model="config.props.value" />
		</el-form-item>
	</div>
</template>

<style scoped>
:deep(.formDate div.el-input__wrapper) {
	width: 100% !important;
}
:deep(.formDate) {
	width: 100% !important;
}
</style>
