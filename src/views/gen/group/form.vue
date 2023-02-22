<template>
    <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible">
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
<!--            多选数据-->
      <el-col :span="12" class="mb20">
         <el-form-item :label="$t('group.templateType')" prop="template">
            <el-select v-model="form.template" :placeholder="$t('group.selectType')" clearable class="w100" multiple>
               <el-option v-for="item in templateData" :key="item.id" :label="item.templateName" :value="item.id" />
            </el-select>
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

<script setup lang="ts" name="GenGroupDialog">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/gen/group';
import { useI18n } from "vue-i18n";
import { list as templateList } from '/@/api/gen/template'


const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const templateData = ref<any[]>([])
// 定义字典

// 提交表单数据
const form = reactive({
    id: '',
    groupName: '',
    groupDesc: '',
    template:[] as String []
});

// 定义校验规则
const dataRules = ref({
        groupName: [{required: true, message: '分组名称不能为空', trigger: 'blur'}],
        template: [{ required: true, message: "角色不能为空", trigger: "blur" }]
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
    getTemplateData()
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

// 角色数据
const getTemplateData = () => {
    templateList().then(res => {
        templateData.value = res.data
    })
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
