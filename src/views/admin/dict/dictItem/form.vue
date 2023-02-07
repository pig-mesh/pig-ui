<template>
  <div class="system-dic-dialog-container">
    <el-dialog v-model="visible" :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')"  width="60%">
      <el-form ref="dicDialogFormRef" :model="dataForm" label-width="90px" size="default">
        <el-row :gutter="35">
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20" v-if="dataForm.id">
            <el-form-item label="类型" prop="dictType">
              <el-input v-model="dataForm.dictType" clearable disabled placeholder="请输入字典名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item label="数据值" prop="value">
              <el-input v-model="dataForm.value" placeholder="请输入数据值" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item label="标签名" prop="label">
              <el-input v-model="dataForm.label" placeholder="请输入标签名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item label="描述" prop="description">
              <el-input v-model="dataForm.description" placeholder="请输入描述" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item label="排序" prop="sortOrder">
              <el-input-number v-model="dataForm.sortOrder" placeholder="请输入排序" clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item label="备注信息" prop="remarks">
              <el-input v-model="dataForm.remarks" type="textarea" placeholder="请输入字典描述" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="dict-item-form">
import { getItemObj, addItemObj, putItemObj } from '/@/api/admin/dict'
import {useMessage} from "/@/hooks/message";


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false)

const dataForm = reactive({
  id: '',
  dictType: '',
  value: '',
  label: '',
  description: '',
  sortOrder: '',
  remarks: '',
})


const dataRules = reactive({})


// 打开弹窗
const openDialog = (row: any) => {
  dataForm.id = ''
  if (row?.id) {
    getItemObj(row.id).then(res => {
      Object.assign(dataForm,res.data)
    })
  } else {
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      dicDialogFormRef?.value?.resetFields();
    });
  }
  visible.value = true
};


// 关闭弹窗
const closeDialog = () => {
  visible.value = false
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 提交
const onSubmit = () => {
  if (dataForm.id) {
    putItemObj(dataForm).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  }else{
    addItemObj(dataForm).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  }
};
// 暴露变量
defineExpose({
  openDialog,
});
</script>
