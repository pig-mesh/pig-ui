<template>
  <el-dialog v-model="visible" :close-on-click-modal="false"
             :title="form.publicId ? $t('common.editBtn') : $t('common.addBtn')" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px">
      <el-row :gutter="20">
        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.publicName')" prop="publicName">
            <el-input v-model="form.publicName" :placeholder="t('param.inputpublicNameTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.publicKey')" prop="publicKey">
            <el-input v-model="form.publicKey" :placeholder="t('param.inputpublicKeyTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.publicValue')" prop="publicValue">
            <el-input v-model="form.publicValue" :placeholder="t('param.inputpublicValueTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.status')" prop="status">
            <el-select v-model="form.status" :placeholder="t('param.inputstatusTip')">
              <el-option v-for="(item, index) in status_type" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.validateCode')" prop="validateCode">
            <el-input v-model="form.validateCode" :placeholder="t('param.inputvalidateCodeTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.publicType')" prop="publicType">
            <el-select v-model="form.publicType" :placeholder="t('param.inputpublicTypeTip')">
              <el-option v-for="(item, index) in param_type" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('param.systemFlag')" prop="systemFlag">
            <el-select v-model="form.systemFlag" :placeholder="t('param.inputsystemFlagTip')">
              <el-option v-for="(item, index) in dict_type" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
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

<script lang="ts" name="SysPublicParamDialog" setup>
// 定义子组件向父组件传值/事件
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj} from '/@/api/admin/param'
import {useI18n} from "vue-i18n"

const emit = defineEmits(['refresh']);

const {t} = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
// 定义字典
const {dict_type, status_type, param_type} = useDict('dict_type', 'status_type', 'param_type')

// 提交表单数据
const form = reactive({
  publicId: '',
  publicName: '',
  publicKey: '',
  publicValue: '',
  status: '0',
  validateCode: '',
  publicType: '',
  systemFlag: '0',
});

// 定义校验规则
const dataRules = reactive({
  publicName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  publicKey: [{ required: true, message: '参数键不能为空', trigger: 'blur' }],
  publicValue: [{ required: true, message: '参数值不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  validateCode: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
  publicType: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.publicId = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取sysPublicParam信息
  if (id) {
    form.publicId = id
    getsysPublicParamData(id)
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 更新
    if (form.publicId) {
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
const getsysPublicParamData = (id: string) => {
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
