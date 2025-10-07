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
 * 允许上传的文件类型
 */
const fileType = ref(['jpeg', 'png', 'jpg', 'gif', 'md', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx', 'zip', 'rar']);

/**
 * 表单数据
 */
const form = reactive({
	/** 邮件标题 */
	title: '',
	/** 配置类型 */
	configType: 'email',
	/** 业务编码 */
	configKey: '',
	/** 业务编码（备份） */
	bizCode: '',
	/** 业务名称 */
	configName: '',
	/** 收件人邮箱列表 */
	mailAddress: [] as string[],
	/** 抄送人邮箱列表 */
	ccList: [] as string[],
	/** 密抄送人邮箱列表 */
	bccList: [] as string[],
	/** 附件URL列表 */
	attachmentList: [] as string[],
	/** 配置ID */
	id: '',
	/** HTML模板值 */
	htmlValues: {} as Record<string, any>,
	/** 模板参数JSON字符串 */
	params: `{
  "code": "1234"
}`,
});

/**
 * 表单验证规则
 */
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

/**
 * 打开测试发送对话框
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
 * 提交发送邮件
 */
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

/**
 * 文件上传变更事件处理
 * @param fileNames - 文件名（未使用）
 * @param fileList - 文件列表
 */
const handleFileChange = (fileNames: string, fileList: any[]): void => {
	form.attachmentList = fileList.map((file) => file.fileUrl);
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
