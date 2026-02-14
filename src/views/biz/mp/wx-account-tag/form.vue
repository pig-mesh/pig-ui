<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable>
		<el-form ref="dataFormRef" v-loading="loading" :model="form" :rules="dataRules" label-width="90px">
			<el-row :gutter="24">
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('wxAccountTag.tag')" prop="tag">
						<el-input v-model="form.tag" :placeholder="t('wxAccountTag.inputTagTip')" />
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

<script lang="ts" name="WxAccountTagDialog" setup>
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { addObj, putObj } from '/@/api/mp/wx-account-tag';

const emit = defineEmits(['refresh']);
const { t } = useI18n();

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
	wxAccountAppid: '',
	tag: '',
	id: '',
});

const dataRules = ref({});

const openDialog = (row: any, appid: string) => {
	visible.value = true;
	form.wxAccountAppid = '';
	form.tag = '';
	form.id = '';

	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}
	if (row) {
		Object.assign(form, row);
	}
	form.wxAccountAppid = appid;
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	loading.value = true;

	try {
		if (form.id) {
			await putObj(form);
			useMessage().success(t('common.editSuccessText'));
		} else {
			await addObj(form);
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

defineExpose({
	openDialog,
});
</script>
