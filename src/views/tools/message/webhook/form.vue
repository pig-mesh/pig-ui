<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
			<el-form-item :label="t('webhook.configName')" prop="configName">
				<el-input v-model="form.configName" :placeholder="t('webhook.inputConfigNameTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.configKey')" prop="configKey">
				<template #label
					>{{ t('webhook.configKey') }}
					<tip :content="t('webhook.configKeyTip')" />
				</template>
				<el-input v-model="form.configKey" :placeholder="t('webhook.inputConfigKeyTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.supplier')" prop="configValue.supplier">
				<el-select v-model="form.configValue.supplier" :placeholder="t('webhook.inputSupplierTip')">
					<el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item :label="t('webhook.tokenId')" prop="configValue.tokenId">
				<el-input v-model="form.configValue.tokenId" :placeholder="t('webhook.inputTokenIdTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.sign')" prop="configValue.sign">
				<el-input v-model="form.configValue.sign" :placeholder="t('webhook.inputSignTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.configStatus')" prop="configStatus">
				<el-radio-group v-model="form.configStatus">
					<el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{ item.label }} </el-radio>
				</el-radio-group>
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

<script setup lang="ts" name="SysMessageHookDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateExist } from '/@/api/admin/config';
import { rule, clearMaskedFields } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const { yes_no_type } = useDict('yes_no_type');

const supplierList = computed(() => [
	{
		value: 'ding_talk',
		label: t('webhook.dingTalk'),
	},
	{
		value: 'byte_talk',
		label: t('webhook.byteTalk'),
	},
	{
		value: 'we_talk',
		label: t('webhook.weTalk'),
	},
]);

const form = reactive({
	configType: 'webhook',
	id: '',
	configKey: '',
	configName: '',
	configValue: {
		tokenId: '' || undefined,
		sign: '' || undefined,
		supplier: '',
	},
	configStatus: '1',
});

const dataRules = computed(() => ({
	configName: [
		{ required: true, message: t('webhook.configNameRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	configKey: [
		{ required: true, message: t('webhook.configKeyRequired'), trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateExist(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	'configValue.supplier': [{ required: true, message: t('webhook.supplierRequired'), trigger: 'blur' }],
	'configValue.tokenId': [{ required: true, message: t('webhook.tokenIdRequired'), trigger: 'blur' }],
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
		clearMaskedFields(configValue, ['tokenId', 'sign']);

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
		form.configValue.tokenId = '******' as any;
		form.configValue.sign = '******' as any;
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

