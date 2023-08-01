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
</script>

<template>
	<div>
		<el-form-item label="单位">
			<el-input v-model="config.props.unit" style="width: 100%" maxlength="10" />
		</el-form-item>
		<el-form-item label="最小值">
			<el-input-number v-model="config.props.min" style="width: 100%" controls-position="right" :min="1" :max="100000000000000" />
		</el-form-item>
		<el-form-item label="最大值">
			<el-input-number v-model="config.props.max" style="width: 100%" controls-position="right" :min="1" :max="100000000000000" />
		</el-form-item>
		<el-form-item label="小数位数">
			<el-input-number
				:step="1"
				step-strictly
				v-model="config.props.radixNum"
				style="width: 100%"
				controls-position="right"
				:min="0"
				value-on-clear="min"
				:max="10"
			/>
		</el-form-item>

		<el-form-item label="默认值">
			<el-input-number :precision="config.props.radixNum" controls-position="right" style="width: 100%" v-model="config.props.value" />
		</el-form-item>
	</div>
</template>
