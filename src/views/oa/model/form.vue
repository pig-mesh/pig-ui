<template>
  <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false"
    draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="90px">
      <el-row :gutter="35">
        <el-col :span="24" class="mb20">
          <el-form-item :label="$t('model.name')" prop="name">
            <el-input v-model="form.name" :placeholder="$t('model.inputNameTip')" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item :label="$t('model.key')" prop="key">
            <el-input v-model="form.key" :placeholder="$t('model.inputKeyTip')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item :label="$t('model.category')" prop="category">
            <el-input v-model="form.category" :placeholder="$t('model.inputCategoryTip')" clearable />
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

<script setup lang="ts" name="systemRoleDialog">
import { useMessage } from "/@/hooks/message"
import { addObj } from "/@/api/oa/model";
import { useI18n } from "vue-i18n"

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)

// 提交表单数据
const form = reactive({
  id: '',
  key: '',
  name: '',
  category: ''
});

// 定义校验规则
const dataRules = ref(
  {
    key: [
      { required: true, message: '模型表示不能为空', trigger: 'blur' },
    ],
    name: [
      { required: true, message: '模型名称不能为空', trigger: 'blur' }
    ],
    category: [
      { required: true, message: '模型分类不能为空', trigger: 'blur' }
    ]
  }
)

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  if (id) {
    form.id = id
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    addObj(form).then(() => {
      useMessage().success(t('common.addSuccessText'))
      visible.value = false // 关闭弹窗
      emit('refresh')
    }).catch((err: any) => {
      useMessage().error(err.msg)
    })
  })
};


// 暴露变量
defineExpose({
  openDialog,
});
</script>
