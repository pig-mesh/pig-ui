<template>
	<div>
		<text>{{ form?.props.value || form?.placeholder }}</text>
	</div>
</template>
<script lang="ts" setup>
defineProps({
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
	var checkConfig = (rule: any, value: any, callback: any) => {
		return callback();
	};
	let ruleArray = [
		{
			validator: checkConfig,
			trigger: 'blur',
		},
	];

	return ruleArray;
};
defineExpose({ getValidateRule });
</script>
