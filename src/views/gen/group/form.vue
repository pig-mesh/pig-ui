<template>
    <el-drawer :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible">
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px">
        <el-row :gutter="24">
	  <el-col :span="12" class="mb20">
	    <el-form-item :label="t('group.groupName')" prop="groupName">
	      <el-input v-model="form.groupName" :placeholder="t('group.inputGroupNameTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="12" class="mb20">
	    <el-form-item :label="t('group.groupDesc')" prop="groupDesc">
	      <el-input v-model="form.groupDesc" :placeholder="t('group.inputGroupDescTip')"/>
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
    </el-drawer>
</template>

<script setup lang="ts" name="GenGroupDialog">
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
const emit = defineEmits(['refresh']);
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/gen/group'
import { useI18n } from "vue-i18n"
import { rule } from '/@/utils/validate';

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
// 定义字典

// 提交表单数据
const form = reactive({
    id: '',
    groupName: '',
    groupDesc: '',
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

  // 获取genGroup信息
  if (id) {
    form.id = id
    getgenGroupData(id)
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
const getgenGroupData = (id: string) => {
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
