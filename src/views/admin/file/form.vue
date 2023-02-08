<template>
    <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px">
        <el-row :gutter="24">
	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('file.id')" prop="id">
	      <el-input v-model="form.id" :placeholder="t('file.inputidTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('file.fileName')" prop="fileName">
	      <el-input v-model="form.fileName" :placeholder="t('file.inputfileNameTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('file.bucketName')" prop="bucketName">
	      <el-input v-model="form.bucketName" :placeholder="t('file.inputbucketNameTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('file.original')" prop="original">
	      <el-input v-model="form.original" :placeholder="t('file.inputoriginalTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('file.type')" prop="type">
	      <el-input v-model="form.type" :placeholder="t('file.inputtypeTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('file.fileSize')" prop="fileSize">
	      <el-input v-model="form.fileSize" :placeholder="t('file.inputfileSizeTip')"/>
	    </el-form-item>
      </el-col>

		</el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" formDialogRef>{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit" formDialogRef>{{ $t('common.confirmButtonText') }}</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="SysFileDialog">
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
const emit = defineEmits(['refresh']);
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/admin/file'
import { useI18n } from "vue-i18n"

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
    id: '',
    fileName: '',
    bucketName: '',
    original: '',
    type: '',
    fileSize: '',
});

// 定义校验规则
const dataRules = ref({
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取sysFile信息
  if (id) {
    form.id = id
    getsysFileData(id)
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
const getsysFileData = (id: string) => {
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
