<template>
    <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
      width="40%"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
        <el-form-item label="联系人" prop="contactName" class="mb20">
          <el-input v-model="form.contactName" placeholder="请输入联系人"/>
        </el-form-item>

        <el-form-item label="手机号" prop="contactPhone" class="mb20">
          <el-input v-model="form.contactPhone" placeholder="请输入手机号"/>
        </el-form-item>

        <el-form-item label="备注" prop="remark" class="mb20">
          <el-input v-model="form.remark" type="textarea" rows="3" placeholder="请输入备注"/>
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
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

const form = reactive({
  id: '',
  contactName: '',
  contactPhone: '',
  remark: '',
});

const dataRules = ref({
  contactName: [{ required: true, message: '联系人不能为空', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '手机号不能为空', trigger: 'blur' },
    { validator: rule.mobilePhone, trigger: 'blur' },
  ],
});

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