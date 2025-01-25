<template>
	<div>
		<fc-designer ref="designer" height="100vh" @save="handleSave" :config="designerConfig" />
	</div>
</template>

<script lang="ts" setup>
import FcDesigner from 'form-create-designer';
import type { Config, DragRule } from 'form-create-designer';
import { useFlowStore } from '../workflow/stores/flow';
import { Session } from '/@/utils/storage';
import { CommonHeaderEnum } from '/@/utils/request';
import { rules } from './rules/form-rules';

// 组件引用
const designer = ref<InstanceType<typeof FcDesigner> | null>(null);
const flowStore = useFlowStore();

// 设计器配置
const designerConfig: Config = {
	fieldReadonly: false, // 字段是否只读
	showSaveBtn: true, // 显示保存按钮
	showDevice: false, // 不显示设备选择
	// showJsonPreview: false,
	hiddenItem: ['upload'],
};

// 配置表单请求拦截器
FcDesigner.designerForm.fetch = FcDesigner.formCreate.fetch = (options: any) => {
	const headers: Record<string, string> = {};

	// 添加认证token
	const token = Session.getToken();
	if (token) {
		headers[CommonHeaderEnum.AUTHORIZATION] = `Bearer ${token}`;
	}

	// 添加租户ID
	const tenantId = Session.getTenant();
	if (tenantId) {
		headers[CommonHeaderEnum.TENANT_ID] = tenantId;
	}

	// 发起请求
	fetch(options.action, {
		headers,
		method: options.method,
	})
		.then(async (res) => {
			const data = await res.json();
			options.onSuccess(data);
		})
		.catch(options.onError);
};

// 表单验证方法
const validate = (callback: (valid: boolean) => void): void => {
	if (designer.value) {
		// 保存当前设计的表单规则到store
		flowStore.setStep2(designer.value.getRule());
		callback(true);
	} else {
		callback(false);
	}
};

// 监听store中的表单规则变化
watch(
	() => flowStore.step2,
	(newRule) => {
		// 当规则变化且设计器存在时，更新设计器的规则
		if (designer.value && newRule) {
			designer.value.setRule(newRule);
		}
	}
);

// 保存处理函数
const handleSave = () => {
	if (designer.value) {
		flowStore.setStep2(designer.value.getRule());
	}
};

// 组件挂载后，如果store中有规则则加载
onMounted(() => {
	if (designer.value && flowStore.step2) {
		designer.value.addMenu({ name: 'biz', title: '业务组件', list: []});

		// Add all rules at once
		rules.forEach((rule) => {
			designer.value?.addComponent(rule as DragRule);
		});

		designer.value.setRule(flowStore.step2);
	}
});

// 暴露验证方法给父组件
defineExpose({ validate });
</script>
