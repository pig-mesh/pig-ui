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
		<el-form-item :label="$t('flow.minLength')">
			<el-input-number :step="1" step-strictly v-model="config.props.minLength" style="width: 100%" controls-position="right" :min="1" :max="100" />
		</el-form-item>
		<el-form-item :label="$t('flow.maxLength')">
			<el-input-number :step="1" step-strictly v-model="config.props.maxLength" style="width: 100%" controls-position="right" :min="1" :max="100" />
		</el-form-item>
		<el-form-item :label="$t('flow.regularExpression')">
			<el-input placeholder="^\d+$" v-model="config.props.regex" />
		</el-form-item>
		<el-form-item :label="$t('flow.regularExpressionTip')">
			<el-input :placeholder="$t('flow.inputErrorRegularExpressionTip')" v-model="config.props.regexDesc" />
		</el-form-item>
		<el-form-item :label="$t('flow.defaultTip')">
			<el-input v-model="config.props.value" />
		</el-form-item>
	</div>
</template>
