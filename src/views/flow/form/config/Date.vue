<script setup lang="ts">
import { computed, defineExpose } from 'vue';

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
const { proxy } = getCurrentInstance();
</script>

<template>
	<div>
		<el-form-item label="最小值">
			<el-date-picker size="default" class="formDate" v-model="config.props.min" value-format="YYYY-MM-DD" type="date" />
		</el-form-item>
		<el-form-item label="最大值">
			<el-date-picker size="default" class="formDate" v-model="config.props.max" value-format="YYYY-MM-DD" type="date" />
		</el-form-item>

		<el-form-item label="默认值">
			<el-date-picker size="default" class="formDate" value-format="YYYY-MM-DD" v-model="config.props.value" type="date" />
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
