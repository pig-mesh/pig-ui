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
		<el-form-item label="最小数量">
			<el-input-number v-model="config.props.min" style="width: 100%" controls-position="right" :min="1" value-on-clear="min" :max="10" />
		</el-form-item>
		<el-form-item label="最大数量">
			<el-input-number v-model="config.props.max" style="width: 100%" controls-position="right" :min="1" value-on-clear="max" :max="10" />
		</el-form-item>

		<el-form-item label="文件大小(MB)">
			<el-input-number v-model="config.props.maxSize" style="width: 100%" controls-position="right" :min="0.01" value-on-clear="max" :max="10" />
		</el-form-item>

		<el-form-item label="文件后缀(jpg,jpeg,png)">
			<el-select
				v-model="config.props.suffixArray"
				style="width: 100%"
				multiple
				filterable
				allow-create
				default-first-option
				:reserve-keyword="false"
				placeholder="请输入支持的后缀，回车确定"
			>
			</el-select>
		</el-form-item>
	</div>
</template>
