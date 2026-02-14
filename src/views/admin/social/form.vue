<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.type')" prop="type">
						<el-select :placeholder="t('social.inputTypeTip')" v-model="form.type">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in social_type">
								{{ item.label }}
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.remark')" prop="remark">
						<el-input :placeholder="t('social.inputRemarkTip')" v-model="form.remark" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.appId')" prop="appId">
						<el-input :placeholder="t('social.inputAppIdTip')" v-model="form.appId" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.appSecret')" prop="appSecret">
						<el-input :placeholder="t('social.inputAppSecretTip')" v-model="form.appSecret" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('social.redirectUrl')" prop="redirectUrl">
						<el-input :placeholder="t('social.inputRedirectUrlTip')" type="textarea" v-model="form.redirectUrl" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('social.ext')" prop="ext">
						<el-input :placeholder="t('social.inputExtTip')" type="textarea" v-model="form.ext" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="AppSocialDetailsDialog" setup>
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/admin/social';
import { useI18n } from 'vue-i18n';
import { rule, clearMaskedFields } from '/@/utils/validate';

const emit = defineEmits(['refresh']);
const { t } = useI18n();
const { social_type } = useDict('social_type');

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
	id: '',
	type: '',
	remark: '',
	appId: '' as string | undefined,
	appSecret: '' as string | undefined,
	redirectUrl: '',
	ext: '',
});

const dataRules = ref({
	type: [{ required: true, message: t('social.typeRequired'), trigger: 'blur' }],
	appId: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('social.appIdRequired'), trigger: 'blur' },
	],
	remark: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('social.remarkRequired'), trigger: 'blur' },
	],
	redirectUrl: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('social.redirectUrlRequired'), trigger: 'blur' },
		{ validator: rule.url, trigger: 'blur' },
	],
	appSecret: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('social.appSecretRequired'), trigger: 'blur' },
	],
});

const openDialog = (id: string): void => {
	visible.value = true;
	form.id = '';

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		getSocialDetailsData(id);
	}
};

const onSubmit = async (): Promise<void> => {
	if (loading.value) return;
	loading.value = true;

	try {
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) return;

		// 编辑时清除脱敏占位符，避免提交星号值
		const payload = { ...form };
		clearMaskedFields(payload, ['appSecret', 'appId']);

		if (form.id) {
			await putObj(payload);
			useMessage().success(t('common.editSuccessText'));
		} else {
			await addObj(payload);
			useMessage().success(t('common.addSuccessText'));
		}
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getSocialDetailsData = async (id: string): Promise<void> => {
	try {
		const { data } = await getObj(id);
		Object.assign(form, data);
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

defineExpose({
	openDialog,
});
</script>
