<template>
	<div class="system-dic-dialog-container">
		<el-dialog v-model="visible" :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')"  width="60%">
      <el-form ref="dicDialogFormRef" :model="dataForm" label-width="100px"  :rules="dataRules">
        <el-row :gutter="35">
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item :label="$t('sysdict.dictType')" prop="dictType">
              <el-input v-model="dataForm.dictType" clearable :placeholder="$t('sysdict.inputDictTypeTip')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
            <el-form-item :label="$t('sysdict.description')" prop="description">
							<el-input v-model="dataForm.description" :placeholder="$t('sysdict.inputDescriptionTip')" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
						<el-form-item :label="$t('sysdict.systemFlag')" prop="systemFlag">
              <el-radio-group v-model="dataForm.systemFlag">
                <el-radio-button :label="item.value" v-for="(item,index) in dict_type" :key="index">{{item.label}}</el-radio-button>
              </el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="24" class="mb20">
						<el-form-item :label="$t('sysdict.remarks')" prop="remarks">
							<el-input v-model="dataForm.remarks" type="textarea" :placeholder="$t('sysdict.inputRemarksTip')" maxlength="150"></el-input>
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

<script setup lang="ts" name="systemDicDialog">
import { getObj, addObj, putObj } from '/@/api/admin/dict'
import {useDict} from "/@/hooks/dict";
import {useMessage} from "/@/hooks/message";


// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { dict_type } = useDict('dict_type')

// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false)

const dataForm = reactive({
  id: '',
  dictType: '',
  description: '',
  systemFlag: '0',
  remarks: '',
})


const dataRules = reactive({
  dictType: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  systemFlag: [{ required: true, message: '字典类型不能为空', trigger: 'blur' }],
  description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
})


// 打开弹窗
const openDialog = (type: string, row: any) => {
  if (row?.id) {
    getObj(row.id).then(res => {
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
  dicDialogFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    if (dataForm.id) {
      putObj(dataForm).then(() => {
        closeDialog(); // 关闭弹窗
        emit('refresh');
      }).catch(err => {
        useMessage().error(err.msg)
      })
    }else{
      addObj(dataForm).then(() => {
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
