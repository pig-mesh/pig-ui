<template>
	<el-drawer :title="t('webhook.sendTest')" v-model="visible" size="50%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="100px" v-loading="loading">
			<el-form-item :label="t('webhook.configName')" prop="configName">
				<el-input v-model="form.configName" :placeholder="t('webhook.inputConfigNameTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('webhook.configKey')" prop="configKey">
				<template #label
					>{{ t('webhook.configKey') }}
					<tip :content="t('webhook.configKeyTip')" />
				</template>
				<el-input v-model="form.configKey" :placeholder="t('webhook.inputConfigKeyTip')" disabled />
			</el-form-item>
			<el-form-item :label="t('webhook.messageType')" prop="messageType">
				<el-select v-model="form.messageType" :placeholder="t('webhook.inputMessageTypeTip')">
					<el-option v-for="item in filteredMessageTypeList" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item :label="t('webhook.messageTitle')" prop="messageTitle" v-if="form.messageType === 'link' || form.messageType === 'markdown'">
				<el-input v-model="form.messageTitle" :placeholder="t('webhook.inputMessageTitleTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.messageContent')" prop="messageContent">
				<el-input type="textarea" :rows="5" v-model="form.messageContent" :placeholder="t('webhook.inputMessageContentTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.messageUrl')" prop="messageUrl" v-if="form.messageType === 'link'">
				<el-input v-model="form.messageUrl" :placeholder="t('webhook.inputMessageUrlTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.picUrl')" prop="picUrl" v-if="form.messageType === 'link'">
				<el-input v-model="form.picUrl" :placeholder="t('webhook.inputPicUrlTip')" />
			</el-form-item>
			<el-form-item :label="t('webhook.noticeAll')" prop="noticeAll">
				<el-radio-group v-model="form.noticeAll">
					<el-radio label="true" border>{{ $t('common.yes') }}</el-radio>
					<el-radio label="false" border>{{ $t('common.no') }}</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="t('webhook.phones')" prop="phones" v-if="form.noticeAll === 'false'">
				<tag-list v-if="visible" :buttonText="t('webhook.addPhone')" v-model="form.phoneList" />
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

<script setup lang="ts" name="HookSenderDialog">
import { useMessage } from '/@/hooks/message';
import { getObj } from '/@/api/admin/config';
import { sendHook } from '/@/api/admin/message';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const messageTypeList = computed(() => [
	{
		value: 'text',
		label: t('webhook.text'),
	},
	{
		value: 'markdown',
		label: t('webhook.markdown'),
	},
	{
		value: 'link',
		label: t('webhook.link'),
	},
]);

const form = reactive({
	configType: 'webhook',
	configKey: 'webhook',
	configName: '',
	configValue: {
		supplier: '',
	},
	bizCode: '',
	messageType: 'text',
	id: '',
	messageTitle: '',
	messageContent: '',
	noticeAll: 'false',
	messageUrl: '',
	picUrl: '',
	phoneList: [] as string[],
});

const dataRules = computed(() => ({
	messageType: [
		{ required: true, message: t('webhook.messageTypeRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	messageTitle: [
		{ required: true, message: t('webhook.messageTitleRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	messageContent: [{ required: true, message: t('webhook.messageContentRequired'), trigger: 'blur' }],
	messageUrl: [
		{ required: true, message: t('webhook.messageUrlRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
	picUrl: [
		{ required: true, message: t('webhook.picUrlRequired'), trigger: 'blur' },
		{ validator: rule.overLength, trigger: 'blur' },
	],
}));

/** 企微不支持链接消息 */
const filteredMessageTypeList = computed(() => {
	if (form.configValue.supplier === 'we_talk') {
		return messageTypeList.value.filter((type) => type.value !== 'link');
	}
	return messageTypeList.value;
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
		await sendHook(form);
		useMessage().success(t('webhook.sendSuccess'));
		visible.value = false;
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
		form.configValue = JSON.parse(form.configValue);
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

