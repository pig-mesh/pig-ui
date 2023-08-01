<template>
	<div>
		<el-input v-if="mode === 'D'" :disabled="true" resize="none" type="textarea" :placeholder="!form ? '' : form.placeholder" />
		<el-input
			v-else
			type="textarea"
			:resize="form.perm === 'R' ? 'none' : 'vertical'"
			v-model="form.props.value"
			:disabled="form.perm === 'R'"
			:placeholder="form.placeholder"
		/>
	</div>
</template>
<script lang="ts" setup>
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
import { defineExpose } from 'vue';

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
