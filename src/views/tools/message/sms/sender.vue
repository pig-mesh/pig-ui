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

const { t } = useI18n();
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
	configType: 'sms',
	configKey: 'sms',
	configName: '',
	mobiles: [] as string[],
	bizCode: '',
	id: '',
	params: {} as Record<string, any>,
	data: `{
  "code": "1234"
}`,
});

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

defineExpose({
	openDialog,
});
</script>

