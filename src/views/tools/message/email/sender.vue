<template>
	<el-drawer :title="t('email.sendTest')" v-model="visible" size="50%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="100px" v-loading="loading">
			<el-form-item :label="t('email.configName')" prop="configName">
				<el-input v-model="form.configName" :placeholder="t('email.inputConfigNameTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('email.configKey')" prop="configKey">
				<template #label
					>{{ t('email.configKey') }}
					<tip :content="t('email.configKeyTip')" />
				</template>
				<el-input v-model="form.configKey" :placeholder="t('email.inputConfigKeyTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('email.recipient')" prop="mailAddress">
				<tag-list v-if="visible" :buttonText="t('email.addEmail')" v-model="form.mailAddress" />
			</el-form-item>
			<el-form-item :label="t('email.cc')" prop="ccList">
				<tag-list v-if="visible" :buttonText="t('email.addEmail')" v-model="form.ccList" />
			</el-form-item>
			<el-form-item :label="t('email.bcc')" prop="bccList">
				<tag-list v-if="visible" :buttonText="t('email.addEmail')" v-model="form.bccList" />
			</el-form-item>
			<el-form-item :label="t('email.subject')" prop="title">
				<el-input v-model="form.title" />
			</el-form-item>
			<el-form-item prop="params">
				<template #label
					>{{ t('email.params') }}
					<tip :content="t('email.paramsTip')" />
				</template>
				<json-editor ref="jsonEditorRef" v-model="form.params" />
			</el-form-item>
			<el-form-item :label="t('email.attachment')" prop="attachmentList">
				<upload-file v-if="visible" :limit="5" @change="handleFileChange" :fileType="fileType" />
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

<script setup lang="ts" name="EmailSenderDialog">
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue';
import { useMessage } from '/@/hooks/message';
import { getObj } from '/@/api/admin/config';
import { sendEmail } from '/@/api/admin/message';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const fileType = ref(['jpeg', 'png', 'jpg', 'gif', 'md', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx', 'zip', 'rar']);

const form = reactive({
	title: '',
	configType: 'email',
	configKey: '',
	bizCode: '',
	configName: '',
	mailAddress: [] as string[],
	ccList: [] as string[],
	bccList: [] as string[],
	attachmentList: [] as string[],
	id: '',
	htmlValues: {} as Record<string, any>,
	params: `{
  "code": "1234"
}`,
});

const dataRules = ref({
	params: [
		{ required: true, message: t('email.paramsRequired'), trigger: 'blur' },
		{ validator: rule.json, trigger: 'blur' },
	],
	title: [
		{ required: true, message: t('email.subjectRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	mailAddress: [{ required: true, message: t('email.recipientRequired'), trigger: 'blur' }],
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
	const valid = await dataFormRef?.value.validate().catch(() => {});
	if (!valid) return;

	try {
		loading.value = true;
		form.htmlValues = JSON.parse(form.params);
		await sendEmail(form);
		useMessage().success(t('email.sendSuccess'));
		visible.value = false;
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		form.params = JSON.stringify(form.htmlValues);
		loading.value = false;
	}
};

const handleFileChange = (fileNames: string, fileList: any[]): void => {
	form.attachmentList = fileList.map((file) => file.fileUrl);
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
