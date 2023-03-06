<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('template.templateName')" prop="templateName">
						<el-input :placeholder="t('template.inputTemplateNameTip')" v-model="form.templateName" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('template.desc')" prop="templateDesc">
						<el-input :placeholder="t('template.inputDescTip')" v-model="form.templateDesc" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('template.generatorPath')" prop="generatorPath">
						<el-input :placeholder="t('template.inputGeneratorPathTip')" v-model="form.generatorPath" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('template.templateCode')" prop="templateCode">
						<el-input :placeholder="t('template.inputTemplateCode')" :rows="4" type="textarea" v-model="form.templateCode" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="GenTemplateDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/gen/template';
import { useI18n } from 'vue-i18n';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
// 定义字典

// 提交表单数据
const form = reactive({
	id: '',
	templateName: '',
	generatorPath: '',
	templateDesc: '',
	templateCode: '',
});

// 定义校验规则
const dataRules = ref({
	templateName: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }],
	generatorPath: [{ required: true, message: '模板路径不能为空', trigger: 'blur' }],
	templateDesc: [{ required: true, message: '模板描述不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取genTemplate信息
	if (id) {
		form.id = id;
		getgenTemplateData(id);
	}
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}

		// 更新
		if (form.id) {
			putObj(form)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		} else {
			addObj(form)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		}
	});
};

// 初始化表单数据
const getgenTemplateData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
