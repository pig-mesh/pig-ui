<template>
  <el-dialog :title="form.leaveId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
    :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('leave.username')" prop="username">
            <el-input v-model="form.username" :placeholder="t('leave.inputUsernameTip')" disabled />
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('leave.days')" prop="days">
            <el-input-number :min="1" :max="1000" v-model="form.days"
              :placeholder="t('leave.inputDaysTip')"></el-input-number>
          </el-form-item>
        </el-col>


        <el-col :span="12" class="mb20">
          <el-form-item :label="t('leave.leaveTime')" prop="leaveTime">
            <el-date-picker type="datetime" :placeholder="t('leave.inputLeaveTimeTip')" v-model="form.leaveTime"
              :value-format="dateTimeStr"></el-date-picker>
          </el-form-item>
        </el-col>


        <el-col :span="24" class="mb20">
          <el-form-item :label="t('leave.content')" prop="content">
            <editor v-model:get-html="form.content" :placeholder="t('leave.inputContentTip')" />
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

<script setup lang="ts" name="OaLeaveBillDialog">
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/oa/leave-bill'
import { useI18n } from "vue-i18n"
import { useUserInfo } from "/@/stores/userInfo";
const emit = defineEmits(['refresh']);


const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)

// 提交表单数据
const form = reactive({
  leaveId: '',
  username: '',
  days: 0,
  content: '',
  leaveTime: '',
});

// 定义校验规则
const dataRules = ref({
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  days: [{ required: true, message: '请假天数不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '备注不能为空', trigger: 'blur' }],
  leaveTime: [{ required: true, message: '时间不能为空', trigger: 'blur' }],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.leaveId = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取oaLeaveBill信息
  if (id) {
    form.leaveId = id
    getoaLeaveBillData(id)
  } else {
    form.username = useUserInfo().userInfos.user.username
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    // 更新
    if (form.leaveId) {
      loading.value = true
      putObj(form).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      }).finally(() => {
        loading.value = false
      })
    } else {
      loading.value = true
      addObj(form).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      }).finally(() => {
        loading.value = false
      })
    }
  })
}

// 初始化表单数据
const getoaLeaveBillData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>