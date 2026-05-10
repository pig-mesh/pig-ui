<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      width="40%"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
        <el-form-item label="联系人" prop="contactName" class="mb20">
          <el-input v-model="form.contactName" placeholder="请输入联系人" clearable maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="手机号" prop="contactPhone" class="mb20">
          <el-input v-model="form.contactPhone" placeholder="请输入手机号" clearable maxlength="11" />
        </el-form-item>

        <el-form-item label="备注" prop="remark" class="mb20">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注" clearable maxlength="100" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="AppContactsDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/app/appContacts';

const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const CONTACT_NAME_MAX_LENGTH = 50;
const CONTACT_REMARK_MAX_LENGTH = 100;
const MOBILE_REGEXP = /^1[3-9]\d{9}$/;

const form = reactive({
  id: '',
  contactName: '',
  contactPhone: '',
  remark: '',
});

const getTrimmedValue = (value: unknown) => String(value ?? '').trim();

const hasControlChars = (value: string) =>
  Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127;
  });

const validateControlChars = (value: string, callback: (error?: Error) => void, message: string) => {
  if (hasControlChars(value)) {
    callback(new Error(message));
    return false;
  }
  return true;
};

const validateContactName = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const nextValue = getTrimmedValue(value);
  if (!nextValue) {
    callback(new Error('联系人不能为空'));
    return;
  }
  if (nextValue.length > CONTACT_NAME_MAX_LENGTH) {
    callback(new Error(`联系人不能超过${CONTACT_NAME_MAX_LENGTH}个字符`));
    return;
  }
  if (!validateControlChars(nextValue, callback, '联系人包含非法字符')) return;
  callback();
};

const validateContactPhone = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const nextValue = getTrimmedValue(value);
  if (!nextValue) {
    callback(new Error('手机号不能为空'));
    return;
  }
  if (!MOBILE_REGEXP.test(nextValue)) {
    callback(new Error('手机号码格式有误'));
    return;
  }
  callback();
};

const validateRemark = (_rule: any, value: string, callback: (error?: Error) => void) => {
  const nextValue = getTrimmedValue(value);
  if (nextValue.length > CONTACT_REMARK_MAX_LENGTH) {
    callback(new Error(`备注不能超过${CONTACT_REMARK_MAX_LENGTH}个字符`));
    return;
  }
  if (!validateControlChars(nextValue, callback, '备注包含非法字符')) return;
  callback();
};

const dataRules = ref({
  contactName: [{ validator: validateContactName, trigger: 'blur' }],
  contactPhone: [{ validator: validateContactPhone, trigger: 'blur' }],
  remark: [{ validator: validateRemark, trigger: 'blur' }],
});

const normalizeForm = () => {
  form.contactName = getTrimmedValue(form.contactName);
  form.contactPhone = getTrimmedValue(form.contactPhone);
  form.remark = getTrimmedValue(form.remark);
};

const openDialog = (id: string) => {
  visible.value = true;
  form.id = '';

  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  if (id) {
    form.id = id;
    getappContactsData(id);
  }
};

const onSubmit = async () => {
  normalizeForm();
  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) return false;

  try {
    loading.value = true;
    form.id ? await putObj(form) : await addObj(form);
    useMessage().success(form.id ? '修改成功' : '添加成功');
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

const getappContactsData = (id: string) => {
  loading.value = true;
  getObj(id)
    .then((res: any) => {
      Object.assign(form, res.data);
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  openDialog,
});
</script>
