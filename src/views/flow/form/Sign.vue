<template>
	<div v-if="form.perm === 'R'">
		<img :src="form.props.value" />
	</div>
	<div v-else>
		<sign
			ref="esginRef"
			v-model:bg-color="bgColor"
			:width="800"
			:height="300"
			:is-crop="isCrop"
			:line-width="lineWidth"
			:line-color="lineColor"
		></sign>

		<div class="flex justify-center">
			<el-link type="primary" @click.stop="handleReset">清空</el-link>
			<el-link type="primary" @click.stop="handleGenerate" class="ml-4">确认</el-link>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const Sign = defineAsyncComponent(() => import('/@/components/Sign/index.vue'));

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
	let ruleArray = [];
	if (item.required) {
		ruleArray.push({
			required: true,
			trigger: 'blur',
			message: '请先签名并确认',
		});
	}
	return ruleArray;
};

const lineWidth = ref(6);
const lineColor = ref('#000000');
const bgColor = ref('');
const isCrop = ref(false);

const esginRef: any = ref(null);
const handleReset = () => {
	esginRef.value.reset();
};
const handleGenerate = () => {
	esginRef.value
		.generate()
		.then((res: any) => {
			props.form.props.value = res;
			ElMessage.success('签名生成成功，可提交流程发起审批');
		})
		.catch(() => {
			ElMessage.warning('请先签名');
		});
};

defineExpose({ getValidateRule });
</script>
<style scoped lang="less"></style>
