<template>
	<el-dialog
		:title="form.id ? $t('common.editBtn') : $t('common.addBtn')"
		v-model="visible"
		:close-on-click-modal="false"
		draggable
	>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
			<el-form-item :label="t('email.configName')" prop="configName">
				<el-input v-model="form.configName" :placeholder="t('email.inputConfigNameTip')" />
			</el-form-item>
			<el-form-item :label="t('email.configKey')" prop="configKey">
				<template #label
					>{{ t('email.configKey') }}
					<tip :content="t('email.configKeyTip')" />
				</template>
				<el-input v-model="form.configKey" :placeholder="t('email.inputConfigKeyTip')" />
			</el-form-item>

			<el-form-item :label="t('email.smtpServer')" prop="configValue.smtpServer">
				<el-input v-model="form.configValue.smtpServer" :placeholder="t('email.inputSmtpServerTip')" />
			</el-form-item>

			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('email.port')" prop="configValue.port">
						<el-input-number v-model="form.configValue.port" :placeholder="t('email.inputPortTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('email.isSSL')" prop="configValue.isSSL">
						<el-radio-group v-model="form.configValue.isSSL">
							<el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
								item.label
							}}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('email.username')" prop="configValue.username">
						<el-input v-model="form.configValue.username" :placeholder="t('email.inputUsernameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('email.password')" prop="configValue.password">
						<el-input v-model="form.configValue.password" :placeholder="t('email.inputPasswordTip')" />
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('email.isAuth')" prop="configValue.isAuth">
						<el-radio-group v-model="form.configValue.isAuth">
							<el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
								item.label
							}}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('email.configStatus')" prop="configStatus">
						<el-radio-group v-model="form.configStatus">
							<el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
								item.label
							}}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24" class="mb20">
					<el-form-item prop="content">
						<template #label
							>{{ t('email.html') }}
							<tip :content="t('email.htmlTip')" />
						</template>
						<editor v-model:get-html="form.configValue.html" :placeholder="t('email.inputHtmlTip')" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="SysMessageEmailDialog">
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

const form = reactive({
	configType: 'email',
	id: '',
	configKey: '',
	configName: '',
	configValue: {
		port: 456,
		smtpServer: '',
		username: '',
		password: ('' as string) || undefined,
		isSSL: '1',
		isAuth: '1',
		html: '',
	},
	configStatus: '1',
});

const dataRules = ref({
	configName: [
		{ required: true, message: t('email.configNameRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	configKey: [
		{ required: true, message: t('email.configKeyRequired'), trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateExist(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	'configValue.smtpServer': [{ required: true, message: t('email.smtpServerRequired'), trigger: 'blur' }],
	'configValue.port': [{ required: true, message: t('email.portRequired'), trigger: 'blur' }],
	'configValue.username': [{ required: true, message: t('email.usernameRequired'), trigger: 'blur' }],
});

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
		const configValue = { ...form.configValue };
		configValue.password = clearMaskedField(configValue.password);

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
		form.configValue.password = '******' as any;
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
