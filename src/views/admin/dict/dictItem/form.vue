<template>
  <el-dialog v-model="visible" :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')" width="600">
    <el-form ref="dicDialogFormRef" :model="dataForm" label-width="90px" :rules="dataRules" v-loading="loading">
      <el-form-item :label="$t('dictItem.dictType')" prop="dictType">
        <el-input v-model="dataForm.dictType" clearable disabled
                  :placeholder="$t('dictItem.inputDictTypeTip')"></el-input>
      </el-form-item>
      <el-form-item :label="$t('dictItem.label')" prop="label">
        <el-input v-model="dataForm.label" :placeholder="$t('dictItem.inputLabelTip')" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('dictItem.itemValue')" prop="value">
        <el-input v-model="dataForm.value" :placeholder="$t('dictItem.inputItemValueTip')" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('dictItem.description')" prop="description">
        <el-input v-model="dataForm.description" :placeholder="$t('dictItem.inputDescriptionTip')" clearable></el-input>
      </el-form-item>
      <el-form-item :label="$t('dictItem.sortOrder')" prop="sortOrder">
        <el-input-number v-model="dataForm.sortOrder" :placeholder="$t('dictItem.inputSortOrderTip')"
                         clearable></el-input-number>
      </el-form-item>
      <el-form-item :label="$t('dictItem.listClass')" prop="listClass">
        <el-select v-model="dataForm.listClass" :placeholder="$t('dictItem.inputListClassTip')" clearable class="w-full">
          <el-option v-for="item in listClassOptions" :key="item.value" :label="item.label" :value="item.value">
            <el-tag v-if="item.value" :type="item.value" size="small" class="ml-2">
              {{ item.label }}
            </el-tag>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('dictItem.remarks')" prop="remarks">
        <el-input type="textarea" maxlength="100" :rows="3" v-model="dataForm.remarks"
                  :placeholder="$t('dictItem.inputRemarksTip')"></el-input>
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

<script setup lang="ts" name="dict-item-form">
import {useI18n} from 'vue-i18n';
import {getItemObj, addItemObj, putItemObj, validateDictItemLabel} from '/@/api/admin/dict';
import {useMessage} from '/@/hooks/message';
import {rule} from "/@/utils/validate";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const {t} = useI18n();

// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false);
const loading = ref(false);

const dataForm = reactive({
  id: '',
  dictId: '',
  dictType: '',
  value: '',
  label: '',
  description: '',
  sortOrder: 0,
  listClass: '',
  remarks: '',
});

// 标签类型选项
const listClassOptions = computed(() => [
  { label: t('dictItem.listClassDefault'), value: '' },
  { label: t('dictItem.listClassPrimary'), value: 'primary' },
  { label: t('dictItem.listClassSuccess'), value: 'success' },
  { label: t('dictItem.listClassInfo'), value: 'info' },
  { label: t('dictItem.listClassWarning'), value: 'warning' },
  { label: t('dictItem.listClassDanger'), value: 'danger' },
]);

const dataRules = reactive({
  dictType: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: t('dictItem.inputDictTypeTip'), trigger: 'blur' },
  ],
  value: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: t('dictItem.valueRequired'), trigger: 'blur' },
  ],
  label: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: t('dictItem.labelRequired'), trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        validateDictItemLabel(rule, value, callback, dataForm.dictType, dataForm.id !== '', t);
      },
      trigger: 'blur',
    },
  ],
  description: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: t('dictItem.descriptionRequired'), trigger: 'blur' },
  ],
  sortOrder: [
    { validator: rule.overLength, trigger: 'blur' },
    { required: true, message: t('dictItem.sortOrderRequired'), trigger: 'blur' },
  ],
});

// 打开弹窗
const openDialog = async (row: any, dictForm: any) => {
  visible.value = true;
  dataForm.id = '';

  nextTick(() => {
    dicDialogFormRef.value?.resetFields();
    if (dictForm) {
      dataForm.dictId = dictForm.dictId;
      dataForm.dictType = dictForm.dictType;
    }
  });
  if (row?.id) {
    try {
      const { data } = await getItemObj(row.id);
      Object.assign(dataForm, data);
    } catch (err: any) {
      useMessage().error(err.msg);
    }
  }
};

// 提交
const onSubmit = async () => {
  if (loading.value) return;
  loading.value = true;

  try {
    const valid = await dicDialogFormRef.value.validate().catch(() => {});
    if (!valid) {
      loading.value = false;
      return false;
    }

    dataForm.id ? await putItemObj(dataForm) : await addItemObj(dataForm);
    useMessage().success(t(dataForm.id ? 'common.editSuccessText' : 'common.addSuccessText'));
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
