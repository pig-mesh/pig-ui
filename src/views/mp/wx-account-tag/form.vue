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
import { addObj, putObj } from '/@/api/mp/wx-account-tag';
import { useI18n } from 'vue-i18n';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	wxAccountAppid: '',
	tag: '',
	id: '',
});

// 定义校验规则
const dataRules = ref({});

// 打开弹窗
const openDialog = (row: any, appid: string) => {
	visible.value = true;
	form.wxAccountAppid = '';
	form.tag = '';
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}
	if (row) {
		Object.assign(form, row);
	}
	form.wxAccountAppid = appid;
};

// 提交
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
// 暴露变量
defineExpose({
	openDialog,
});
</script>
