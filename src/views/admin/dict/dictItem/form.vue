<template>
  <div class="system-dic-dialog-container">
    <el-dialog v-model="visible" :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')" width="60%">
      <el-form ref="dicDialogFormRef" :model="dataForm" label-width="90px"  :rules="dataRules">
        <el-row :gutter="35">
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20" v-if="dataForm.id">
            <el-form-item :label="$t('dictItem.dictType')" prop="dictType">
              <el-input v-model="dataForm.dictType" clearable disabled :placeholder="$t('dictItem.inputDictTypeTip')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item :label="$t('dictItem.itemValue')" prop="value">
              <el-input v-model="dataForm.value" :placeholder="$t('dictItem.inputItemValueTip')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item :label="$t('dictItem.label')" prop="label">
              <el-input v-model="dataForm.label" :placeholder="$t('dictItem.inputLabelTip')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item :label="$t('dictItem.description')" prop="description">
              <el-input v-model="dataForm.description" :placeholder="$t('dictItem.inputDescriptionTip')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item :label="$t('dictItem.sortOrder')" prop="sortOrder">
              <el-input-number v-model="dataForm.sortOrder" :placeholder="$t('dictItem.inputSortOrderTip')" clearable></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item :label="$t('dictItem.remarks')" prop="remarks">
              <el-input v-model="dataForm.remarks" type="textarea" :placeholder="$t('dictItem.inputRemarksTip')" maxlength="150"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" >{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit" >{{ $t('common.confirmButtonText') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="dict-item-form">
import { getItemObj, addItemObj, putItemObj } from '/@/api/admin/dict'
import { useMessage } from "/@/hooks/message";


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false)

const dataForm = reactive({
  id: '',
  dictId:'',
  dictType: '',
  value: '',
  label: '',
  description: '',
  sortOrder: 0,
  remarks: '',
})


const dataRules = reactive({
  value: [{ required: true, message: '数据值不能为空', trigger: 'blur' }],
  label: [{ required: true, message: '标签不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
})


// 打开弹窗
const openDialog = (row: any,dictForm:any) => {
  dataForm.id = ''
  if (dictForm){
    dataForm.dictId = dictForm.dictId
    dataForm.dictType = dictForm.dictType
  }
  if (row?.id) {
    getItemObj(row.id).then(res => {
      Object.assign(dataForm, res.data)
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
  dicDialogFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    if (dataForm.id) {
      putItemObj(dataForm).then(() => {
        closeDialog(); // 关闭弹窗
        emit('refresh');
      }).catch(err => {
        useMessage().error(err.msg)
      })
    } else {
      addItemObj(dataForm).then(() => {
        closeDialog(); // 关闭弹窗
        emit('refresh');
      }).catch(err => {
        useMessage().error(err.msg)
      })
    }
  })




};
// 暴露变量
defineExpose({
  openDialog,
});
</script>
