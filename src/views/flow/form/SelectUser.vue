<template>
	<div>
		<el-button v-if="mode === 'D'" :disabled="true" circle icon="Plus"></el-button>

		<select-show
			v-else
			:disabled="form.perm === 'R'"
			v-model:orgList="form.props.value"
			type="user"
			:multiple="form.props.multi"
			:selectSelf="form.props.self"
		></select-show>
	</div>
</template>
<script lang="ts" setup>
import selectShow from '/@/views/flow/workflow/components/dialog/selectAndShow.vue';
import { defineExpose } from 'vue';

let props = defineProps({
	mode: {
		type: String,
		default: 'D',
	},

	form: {
		type: Object,
		default: () => {},
	},
});

onMounted(() => {});

const { proxy } = getCurrentInstance();

const getValidateRule = () => {
	var item = props.form;

	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (value.length == 0) {
				return callback(new Error('请选择' + item.name));
			}
		}
		if (value.length == 0) {
			return callback();
		}
		return callback();
	};
	let ruleArray = [
		{
			validator: checkConfig,
			trigger: 'change',
		},
	];
	if (item.required) {
		ruleArray.push({ required: true, message: '请选择' + item.name, trigger: 'change' });
	}
	return ruleArray;
};
defineExpose({ getValidateRule });
</script>
