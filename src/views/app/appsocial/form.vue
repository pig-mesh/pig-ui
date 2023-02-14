<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('appsocial.type')" prop="type">
            <el-select v-model="form.type" :placeholder="t('appsocial.inputTypeTip')">
              <el-option v-for="(item, index) in app_social_type" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('appsocial.remark')" prop="remark">
            <el-input v-model="form.remark" :placeholder="t('appsocial.inputRemarkTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('appsocial.appId')" prop="appId">
            <el-input v-model="form.appId" :placeholder="t('appsocial.inputAppIdTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item :label="t('appsocial.appSecret')" prop="appSecret">
            <el-input v-model="form.appSecret" :placeholder="t('appsocial.inputAppSecretTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('appsocial.redirectUrl')" prop="redirectUrl">
            <el-input v-model="form.redirectUrl" :placeholder="t('appsocial.inputRedirectUrlTip')" type="textarea"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('appsocial.ext')" prop="ext">
            <el-input v-model="form.ext" :placeholder="t('appsocial.inputExtTip')" type="textarea"/>
          </el-form-item>
        </el-col>

      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button formDialogRef @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button formDialogRef type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="AppSocialDetailsDialog" setup>
// 定义子组件向父组件传值/事件
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj} from '/@/api/app/appsocial'
import {useI18n} from "vue-i18n"

const emit = defineEmits(['refresh']);

const {t} = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
// 定义字典
const {app_social_type} = useDict('app_social_type')

// 提交表单数据
const form = reactive({
  id: '',
  type: '',
  remark: '',
  appId: '',
  appSecret: '',
  redirectUrl: '',
  ext: '',
});

// 定义校验规则
const dataRules = ref({
  type: [{required: true, message: '类型不能为空', trigger: 'blur'}],
  appId: [{required: true, message: 'appId不能为空', trigger: 'blur'}],
  appSecret: [{required: true, message: 'appSecret不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取appSocialDetails信息
  if (id) {
    form.id = id
    getappSocialDetailsData(id)
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    if (form.appSecret && form.appSecret.indexOf("******") >= 0) {
      form.appSecret = ''
    }

    if (form.appId && form.appId.indexOf("******") >= 0) {
      form.appId = ''
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
const getappSocialDetailsData = (id: string) => {
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
