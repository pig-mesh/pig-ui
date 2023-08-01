<script setup lang="ts">
let props = defineProps({
	id: {
		type: String,
		default: '',
	},
});

import { useFlowStore } from '../../workflow/stores/flow';

let flowStore = useFlowStore();
const config = computed(() => {
	let step2 = flowStore.step2;

	const idObjList = step2.filter((res) => res.id === props.id);
	if (idObjList.length > 0) {
		return idObjList[0];
	}

	let list = step2.filter((res) => res.type === 'Layout');
	for (const item of list) {
		let value = item.props.value;
		const valueList = value.filter((res: any) => res.id === props.id);
		if (valueList.length > 0) {
			return valueList[0];
		}
	}

	return undefined;
});
</script>

<template>
	<div>
		<el-form-item label="最小长度">
			<el-input-number :step="1" step-strictly v-model="config.props.minLength" style="width: 100%" controls-position="right" :min="1" :max="100" />
		</el-form-item>
		<el-form-item label="最大长度">
			<el-input-number :step="1" step-strictly v-model="config.props.maxLength" style="width: 100%" controls-position="right" :min="1" :max="100" />
		</el-form-item>
		<el-form-item label="正则表达式">
			<el-input placeholder="^\d+$" v-model="config.props.regex" />
		</el-form-item>
		<el-form-item label="正则表达式提示语">
			<el-input placeholder="表单值不符合正则表达式" v-model="config.props.regexDesc" />
		</el-form-item>
		<el-form-item label="默认值">
			<el-input v-model="config.props.value" />
		</el-form-item>
	</div>
</template>
