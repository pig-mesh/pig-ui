<template>
	<div><china-area v-model="form.props.value" :disabled="form.perm === 'R'" /></div>
</template>
<script lang="ts" setup>
const ChinaArea = defineAsyncComponent(() => import('/@/components/ChinaArea/index.vue'));
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
			if (!value) {
				return callback(new Error('请填写' + item.name));
			}
		}
		if (!value) {
			return callback();
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
