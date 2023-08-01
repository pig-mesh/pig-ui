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
	var idObjList = step2.filter((res) => res.id === props.id);
	if (idObjList.length > 0) {
		return idObjList[0];
	}

	let list = step2.filter((res) => res.type === 'Layout');
	for (var item of list) {
		let value = item.props.value;
		var valueList = value.filter((res) => res.id === props.id);
		if (valueList.length > 0) {
			return valueList[0];
		}
	}

	return undefined;
});
const { proxy } = getCurrentInstance();
</script>

<template>
	<div>
		<el-form-item label="最小数量">
			<el-input-number v-model="config.props.min" style="width: 100%" controls-position="right" :min="1" :max="100" />
		</el-form-item>
		<el-form-item label="最大数量">
			<el-input-number v-model="config.props.max" style="width: 100%" controls-position="right" :min="1" :max="100" />
		</el-form-item>
	</div>
</template>
