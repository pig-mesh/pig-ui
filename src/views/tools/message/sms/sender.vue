<template>
	<el-drawer :title="t('sms.sendTest')" v-model="visible" size="50%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="100px" v-loading="loading">
			<el-form-item :label="t('sms.configName')" prop="configName">
				<el-input v-model="form.configName" :placeholder="t('sms.inputConfigNameTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('sms.configKey')" prop="configKey">
				<template #label
					>{{ t('sms.configKey') }}
					<tip :content="t('sms.configKeyTip')" />
				</template>
				<el-input v-model="form.configKey" :placeholder="t('sms.inputConfigKeyTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('sms.mobile')" prop="mobiles">
				<tag-list v-if="visible" v-model="form.mobiles" :buttonText="t('sms.addMobile')" />
			</el-form-item>
			<el-form-item prop="data">
				<template #label
					>{{ t('sms.params') }}
					<tip :content="t('sms.paramsTip')" />
				</template>
				<json-editor ref="jsonEditorRef" v-model="form.data" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="SmsSenderDialog">
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue';
import { useMessage } from '/@/hooks/message';
import { getObj } from '/@/api/admin/config';
import { sendSms } from '/@/api/admin/message';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 表单引用
 */
const dataFormRef = ref();

/**
 * 抽屉显示状态
 */
const visible = ref(false);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 表单数据
 */
const form = reactive({
	/** 配置类型 */
	configType: 'sms',
	/** 业务编码 */
	configKey: 'sms',
	/** 业务名称 */
	configName: '',
	/** 接收手机号列表 */
	mobiles: [] as string[],
	/** 业务编码（备份） */
	bizCode: '',
	/** 配置ID */
	id: '',
	/** 短信模板参数 */
	params: {} as Record<string, any>,
	/** 模板参数JSON字符串 */
	data: `{
  "code": "1234"
}`,
});

/**
 * 表单验证规则
 */
const dataRules = computed(() => ({
	data: [
		{ required: true, message: t('sms.paramsRequired'), trigger: 'blur' },
		{ validator: rule.json, trigger: 'blur' },
	],
	mobiles: [
		{ required: true, message: t('sms.mobileRequired'), trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
	],
}));

/**
 * 打开测试发送抽屉
 * @param id - 配置ID
 */
const openDialog = async (id: string): Promise<void> => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		await getConfigData(id);
	}
};

/**
 * 提交发送短信
 */
const onSubmit = async (): Promise<void> => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		form.params = JSON.parse(form.data);
		await sendSms(form);
		useMessage().success(t('sms.sendSuccess'));
		visible.value = false;
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		form.data = JSON.stringify(form.params);
		loading.value = false;
	}
};

/**
 * 获取配置详情数据
 * @param id - 配置ID
 */
const getConfigData = async (id: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj({ id });
		Object.assign(form, data[0]);
		form.bizCode = form.configKey;
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

/**
 * 暴露方法供父组件调用
 */
defineExpose({
	openDialog,
});
</script>

