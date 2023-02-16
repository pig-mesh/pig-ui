<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px">
      <el-row :gutter="20">
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('i18n.name')" prop="name">
            <el-input v-model="form.name" :placeholder="t('i18n.inputKeyTip')"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('i18n.zhCn')" prop="zhCn">
            <el-input v-model="form.zhCn" :placeholder="t('i18n.inputZhCnTip')"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('i18n.en')" prop="en">
            <el-input v-model="form.en" :placeholder="t('i18n.inputEnTip')"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysI18nDialog" setup>
// 定义子组件向父组件传值/事件
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj} from '/@/api/admin/i18n'
import {useI18n} from "vue-i18n"

const emit = defineEmits(['refresh']);

const {t} = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
  id: '',
  name: '',
  zhCn: '',
  en: '',
});

// 定义校验规则
const dataRules = ref({
  name: [{required: true, message: 'name不能为空', trigger: 'blur'}],
  zhCn: [{required: true, message: '中文不能为空', trigger: 'blur'}],
  en: [{required: true, message: '英文不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取sysI18n信息
  if (id) {
    form.id = id
    getsysI18nData(id)
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    // 更新
    if (form.id) {
      putObj(form).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    } else {
      addObj(form).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    }
  })
}

// 初始化表单数据
const getsysI18nData = (id: string) => {
  // 获取数据
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
