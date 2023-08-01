<template>
	<div>
		<upload-file
			v-model="form.props.value"
			:disabled="form.perm === 'E'"
			:fileSize="form.props.maxSize"
			:limit="form.props.max"
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

		if (item.props.min && value.length < item.props.min) {
			return callback(new Error('上传数量不能小于' + item.props.min));
		}
		if (item.props.suffixArray && item.props.suffixArray.length > 0) {
			for (var it of value) {
				let name = it.name;
				var suffix = name.substring(name.lastIndexOf('.') + 1);
				if (item.props.suffixArray.indexOf(suffix) < 0) {
					return callback(new Error('文件只支持' + item.props.suffixArray + '格式'));
				}
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
		ruleArray.push({ required: true, message: '请上传' + item.name, trigger: 'blur' });
	}
	return ruleArray;
};
defineExpose({ getValidateRule });
</script>
<style scoped lang="less"></style>
