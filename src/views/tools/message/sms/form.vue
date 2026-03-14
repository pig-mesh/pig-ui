<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
			<el-form-item :label="t('sms.configName')" prop="configName">
				<el-input v-model="form.configName" :placeholder="t('sms.inputConfigNameTip')" />
			</el-form-item>
			<el-form-item :label="t('sms.configKey')" prop="configKey">
				<template #label
					>{{ t('sms.configKey') }}
					<tip :content="t('sms.configKeyTip')" />
				</template>
				<el-input v-model="form.configKey" :placeholder="t('sms.inputConfigKeyTip')" />
			</el-form-item>
			<el-form-item :label="t('sms.supplier')" prop="configValue.supplier">
				<el-select v-model="form.configValue.supplier" :placeholder="t('sms.inputSupplierTip')">
					<el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item :label="t('sms.accessKeyId')" prop="configValue.accessKeyId">
				<el-input v-model="form.configValue.accessKeyId" :placeholder="t('sms.inputAccessKeyIdTip')" />
			</el-form-item>
			<el-form-item :label="t('sms.accessKeySecret')" prop="configValue.accessKeySecret">
				<el-input v-model="form.configValue.accessKeySecret" :placeholder="t('sms.inputAccessKeySecretTip')" />
			</el-form-item>
			<el-form-item :label="t('sms.signature')" prop="configValue.signature">
				<el-input v-model="form.configValue.signature" :placeholder="t('sms.inputSignatureTip')" />
			</el-form-item>
			<el-form-item :label="t('sms.templateId')" prop="configValue.templateId">
				<el-input v-model="form.configValue.templateId" :placeholder="t('sms.inputTemplateIdTip')" />
			</el-form-item>
			<el-form-item :label="t('sms.configStatus')" prop="configStatus">
				<el-radio-group v-model="form.configStatus">
					<el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{ item.label }} </el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item prop="configValue.extParams">
				<template #label
					>{{ t('sms.extParams') }}
					<tip :content="t('sms.extParamsTip')" />
				</template>
				<json-editor ref="jsonEditorRef" v-model="form.configValue.extParams" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysMessageSmsDialog">
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue';
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateExist } from '/@/api/admin/config';
import { rule, clearMaskedField } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const { yes_no_type } = useDict('yes_no_type');

const supplierList = computed(() => [
	{
		value: 'alibaba',
		label: t('sms.alibaba'),
	},
	{
		value: 'tencent',
		label: t('sms.tencent'),
	},
	{
		value: 'huawei',
		label: t('sms.huawei'),
	},
	{
		value: 'jdcloud',
		label: t('sms.jdcloud'),
	},
	{
		value: 'cloopen',
		label: t('sms.cloopen'),
	},
	{
		value: 'emay',
		label: t('sms.emay'),
	},
	{
		value: 'ctyun',
		label: t('sms.ctyun'),
	},
	{
		value: 'netease',
		label: t('sms.netease'),
	},
	{
		value: 'yunpian',
		label: t('sms.yunpian'),
	},
	{
		value: 'unisms',
		label: t('sms.unisms'),
	},
	{
		value: 'zhutong',
		label: t('sms.zhutong'),
	},
	{
		value: 'dingxin',
		label: t('sms.dingxin'),
	},
	{
		value: 'chuanglan',
		label: t('sms.chuanglan'),
	},
]);

const form = reactive({
	configType: 'sms',
	id: '',
	configKey: '',
	configName: '',
	configValue: {
		supplier: '',
		accessKeyId: '',
		accessKeySecret: '' || undefined,
		signature: '',
		templateId: '',
		extParams: '',
	},
	configStatus: '1',
});

const dataRules = computed(() => ({
	configName: [
		{ required: true, message: t('sms.configNameRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	configKey: [
		{ required: true, message: t('sms.configKeyRequired'), trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateExist(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	'configValue.supplier': [{ required: true, message: t('sms.supplierRequired'), trigger: 'blur' }],
	'configValue.accessKeyId': [{ required: true, message: t('sms.accessKeyIdRequired'), trigger: 'blur' }],
	'configValue.accessKeySecret': [{ required: true, message: t('sms.accessKeySecretRequired'), trigger: 'blur' }],
	'configValue.signature': [{ required: true, message: t('sms.signatureRequired'), trigger: 'blur' }],
	'configValue.templateId': [{ required: true, message: t('sms.templateIdRequired'), trigger: 'blur' }],
	'configValue.extParams': [{ validator: rule.json, trigger: 'blur' }],
}));

const openDialog = async (id: string): Promise<void> => {
	visible.value = true;
	form.id = '';

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		await getConfigData(id);
	}
};

const onSubmit = async (): Promise<void> => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		// 清除脱敏字段（编辑时不提交星号占位符）
		const configValue = { ...form.configValue };
		configValue.accessKeySecret = clearMaskedField(configValue.accessKeySecret);

		const payload = { ...form, configValue: JSON.stringify(configValue) as any };
		form.id ? await putObj(payload) : await addObj(payload);
		useMessage().success(form.id ? t('common.editSuccessText') : t('common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getConfigData = async (id: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj({ id });
		Object.assign(form, data[0]);
		form.configValue = JSON.parse(data[0].configValue);
		form.configValue.accessKeySecret = '******' as any;
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

defineExpose({
	openDialog,
	supplierList,
});
</script>

