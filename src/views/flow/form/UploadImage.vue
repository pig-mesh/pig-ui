<template>
	<div>
		<upload-img
			:disabled="form.perm === 'R'"
			v-model:image-url="form.props.value"
			:fileSize="form.props.maxSize"
			:fileType="form.props.suffixArray"
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

const getValidateRule = () => {
	var item = props.form;

	var checkConfig = (rule: any, value: any, callback: any) => {
		if (item.required) {
			if (value.length == 0) {
				return callback(new Error('请上传' + item.name));
			}
		}
		if (value.length == 0) {
			return callback();
		}

		if (value.length < item.props.min) {
			return callback(new Error('上传数量不能小于' + item.props.min));
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
		ruleArray.push({ required: true, message: '请上传' + item.name, trigger: 'blur' });
	}
	return ruleArray;
};
defineExpose({ getValidateRule });
</script>
<style scoped lang="less"></style>
