<template>
  <el-dialog :title="form.sensitiveId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('sensitive.sensitiveWord')" prop="sensitiveWord">
            <el-input v-model="form.sensitiveWord" :placeholder="t('sensitive.inputSensitiveWordTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('sensitive.sensitiveType')" prop="sensitiveType">
            <el-radio-group v-model="form.sensitiveType">
              <el-radio :label="item.value" v-for="(item, index) in sensitive_type" border :key="index">{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('sensitive.remark')" prop="remark">
            <el-input v-model="form.remark" :placeholder="t('sensitive.inputRemarkTip')"/>
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

<script setup lang="ts" name="SysSensitiveWordDialog">
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, validateWord } from '/@/api/admin/sensitive';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);
const { t } = useI18n();
const { sensitive_type } = useDict('sensitive_type');

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
	sensitiveId: '',
	sensitiveWord: '',
	sensitiveType: '0',
	remark: '',
});

const dataRules = ref({
	sensitiveWord: [
		{ validator: rule.overLength, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateWord(rule, value, callback, form.sensitiveId !== '');
			},
			trigger: 'blur',
		},
		{
			required: true,
			message: t('sensitive.sensitiveWordRequired'),
			trigger: 'blur',
		},
	],
	sensitiveType: [{ required: true, message: t('sensitive.sensitiveTypeRequired'), trigger: 'blur' }],
	remark: [{ validator: rule.overLength, trigger: 'blur' }],
});

const openDialog = (sensitiveId: string): void => {
	visible.value = true;
	form.sensitiveId = '';

	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (sensitiveId) {
		form.sensitiveId = sensitiveId;
		getSensitiveWordData(sensitiveId);
	}
};

const onSubmit = async (): Promise<void> => {
	if (loading.value) return;
	loading.value = true;

	try {
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) return;

		form.sensitiveId ? await putObj(form) : await addObj(form);
		useMessage().success(form.sensitiveId ? t('common.editSuccessText') : t('common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

const getSensitiveWordData = async (sensitiveId: string): Promise<void> => {
	loading.value = true;
	try {
		const { data } = await getObj({ sensitiveId });
		Object.assign(form, data);
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
