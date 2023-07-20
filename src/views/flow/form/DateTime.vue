<template>
	<div>
		<el-date-picker
			class="formDate"
			v-if="mode === 'D'"
			:disabled="true"
			type="datetime"
			value-format="YYYY-MM-DD HH:mm:ss"
			:placeholder="!form ? '' : form.placeholder"
		/>
		<el-date-picker
			v-else
			class="formDate"
			value-format="YYYY-MM-DD HH:mm:ss"
			type="datetime"
			v-model="form.props.value"
			:disabled="form.perm === 'R'"
			:placeholder="form.placeholder"
		/>
	</div>
</template>
<script lang="ts" setup>
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
const { proxy } = getCurrentInstance();

const getValidateRule = () => {
	var item = props.form;
	var itemProps = item.props;

	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (!value) {
				return callback(new Error('请填写' + item.name));
			}
		}
		if (!value) {
			return callback();
		}

		if (itemProps.minLength) {
			if (value.length < itemProps.minLength) {
				return callback(new Error('长度不能小于' + itemProps.minLength));
			}
		}

		if (itemProps.maxLength) {
			if (value.length > itemProps.maxLength) {
				return callback(new Error('长度不能大于' + itemProps.maxLength));
			}
		}
		if (itemProps.regex) {
			let regExp = new RegExp(itemProps.regex);
			if (!regExp.test(value)) {
				return callback(new Error(itemProps.regexDesc));
			}
		}
		return callback();
	};
	let ruleArray = [
		{
			validator: checkConfig,
			trigger: 'blur',
		},
	];
	if (item.required) {
		ruleArray.push({ required: true, message: '请填写' + item.name, trigger: 'blur' });
	}
	return ruleArray;
};
defineExpose({ getValidateRule });
</script>
<style scoped>
:deep(.formDate div.el-input__wrapper) {
	width: 100% !important;
}
:deep(.formDate) {
	width: 100% !important;
}
</style>
