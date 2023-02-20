<template>
		<el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" label-width="120px">
			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item label="表名" prop="tableName">
						<el-input v-model="dataForm.tableName" disabled placeholder="表名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="说明" prop="tableComment">
						<el-input v-model="dataForm.tableComment" placeholder="说明"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item label="类名" prop="className">
						<el-input v-model="dataForm.className" placeholder="类名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="作者" prop="author">
						<el-input v-model="dataForm.author" placeholder="默认作者"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item label="项目包名" prop="packageName">
						<el-input v-model="dataForm.packageName" placeholder="项目包名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="模块名" prop="moduleName">
						<el-input v-model="dataForm.moduleName" placeholder="模块名"></el-input>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item label="功能名" prop="functionName">
						<el-input v-model="dataForm.functionName" placeholder="功能名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="代码风格" prop="style">
						<el-radio-group v-model="dataForm.style">
							<el-radio-button :label="1">移动端</el-radio-button>
							<el-radio-button :label="0">PC端</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="12" class="mb20">
					<el-form-item label="表单布局" prop="formLayout">
						<el-radio-group v-model="dataForm.formLayout">
							<el-radio-button :label="1">一列</el-radio-button>
							<el-radio-button :label="2">两列</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
        <el-col :span="12" class="mb20" v-if="dataForm.style === 0">
          <el-form-item label="i18n文件" prop="i18n" >
            <el-radio-group v-model="dataForm.i18n">
              <el-radio-button :label="0">不生成</el-radio-button>
              <el-radio-button :label="1">生成</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
				<el-col :span="12" class="mb20">
					<el-form-item label="生成方式" prop="generatorType">
						<el-radio-group v-model="dataForm.generatorType">
							<el-radio-button :label="1">自定义路径</el-radio-button>
							<el-radio-button :label="0">ZIP 压缩包</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
        <el-col :span="24" class="mb20">
          <el-form-item v-if="dataForm.generatorType === 1" label="后端生成路径" prop="backendPath">
            <el-input v-model="dataForm.backendPath" placeholder="后端生成路径"></el-input>
          </el-form-item>
          <el-form-item v-if="dataForm.generatorType === 1" label="前端生成路径" prop="frontendPath">
            <el-input v-model="dataForm.frontendPath" placeholder="前端生成路径"></el-input>
          </el-form-item>
        </el-col>
			</el-row>

		</el-form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { putObj, useTableApi, useGeneratorCodeApi } from '/@/api/gen/table'
import { useMessage } from '/@/hooks/message';
import { downBlobFile } from '/@/utils/other';

// const previewDialog = defineAsyncComponent(() => import('./preview.vue'));

const props = defineProps({
  tableName: {
    type: String
  },
  dsName: {
    type: String
  }
})


const emit = defineEmits(['refreshDataList'])
const { t } = useI18n()
const previewRef = ref()

const visible = ref(false)
const dataFormRef = ref()
const dataForm = reactive({
	id: '',
	generatorType: 0,
	formLayout: 1,
	backendPath: '',
	frontendPath: '',
	packageName: '',
	email: '',
	author: '',
	version: '',
	moduleName: '',
	functionName: '',
	className: '',
	tableComment: '',
	tableName: '' as string,
	dsName: '' as string,
	i18n: 1,  // 默认生成 I18N 国际化文件
	style: 0, //  默认风格 element-plus
})

const openDialog = (dName: string, tName: string) => {
	visible.value = true
	dataForm.id = ''
	dataForm.tableName = tName
	dataForm.dsName = dName

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields()
	}

	getTable(dName, tName)
}

const getTable = (dsName: string, tableName: string) => {
	useTableApi(dsName, tableName).then(res => {
		Object.assign(dataForm, res.data)
	})
}

const dataRules = ref({
	tableName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	tableComment: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	className: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	packageName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	author: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	moduleName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	functionName: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	generatorType: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	formLayout: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	backendPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
	frontendPath: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
})

// 预览
// const previewHandle = () => {
// 	dataFormRef.value.validate(async (valid: boolean) => {
// 		if (!valid) {
// 			return false
// 		}
// 		// 先保存
// 		await putObj(dataForm)
// 		// 打开预览窗口
// 		previewRef.value.openDialog(dataForm.id)
// 	})
// }

// 保存
const submitHandle = () => {
  return new Promise((resolve, reject) => {
    dataFormRef.value.validate((valid: boolean) => {

      if (!valid) {
        reject()
        return false
      }

      putObj(dataForm).then(() => {
        visible.value = false
        emit('refreshDataList')
        useMessage().success(t('common.optSuccessText'))
        resolve(dataForm)
      })
    })
  })

}

// 生成
// const generatorHandle = () => {
// 	dataFormRef.value.validate(async (valid: boolean) => {
// 		if (!valid) {
// 			return false
// 		}
//
// 		// 先保存
// 		await putObj(dataForm)
//
// 		// 生成代码，zip压缩包
// 		if (dataForm.generatorType === 0) {
// 			downBlobFile('/gen/generator/download?tableIds=' + [dataForm.id].join(','), {}, `${dataForm.tableName}.zip`)
// 			visible.value = false
// 		}
//
// 		// 写入到指定目录
// 		if (dataForm.generatorType === 1) {
// 			useGeneratorCodeApi([dataForm.id].join(',')).then(() => {
// 				useMessage().success(t('common.optSuccessText'))
// 				visible.value = false
// 			})
// 		}
// 	})
// }

onMounted(() => {
  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  dataForm.id = ''
  dataForm.tableName = String(props.tableName)
  dataForm.dsName = String(props.dsName)

  getTable(dataForm.dsName, dataForm.tableName)
})

defineExpose({
	openDialog,
  submitHandle
})
</script>

<style lang="scss" scoped>
.generator-code .el-dialog__body {
	padding: 15px 30px 0 20px;
}
</style>
