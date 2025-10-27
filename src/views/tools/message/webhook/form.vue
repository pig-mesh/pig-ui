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

/**
 * 事件发射器
 */
const emit = defineEmits(['refresh']);

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 表单引用
 */
const dataFormRef = ref();

/**
 * 对话框显示状态
 */
const visible = ref(false);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 是否/否 字典
 */
const { yes_no_type } = useDict('yes_no_type');

/**
 * Webhook平台供应商列表
 */
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

/**
 * 表单数据
 */
const form = reactive({
	/** 配置类型 */
	configType: 'webhook',
	/** 配置ID */
	id: '',
	/** 业务编码 */
	configKey: '',
	/** 业务名称 */
	configName: '',
	/** 配置值 */
	configValue: {
		/** Token ID */
		tokenId: '' || undefined,
		/** 签名 */
		sign: '' || undefined,
		/** 平台供应商 */
		supplier: '',
	},
	/** 启用状态 */
	configStatus: '1',
});

/**
 * 表单验证规则
 */
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

/**
 * 打开对话框
 * @param id - 配置ID，为空时为新增模式
 */
const openDialog = async (id: string): Promise<void> => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取配置详情
	if (id) {
		form.id = id;
		await getConfigData(id);
	}
};

/**
 * 提交表单
 */
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

/**
 * 获取配置详情数据
 * @param id - 配置ID
 */
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

/**
 * 暴露方法供父组件调用
 */
defineExpose({
	openDialog,
	supplierList,
});
</script>

