<template>
	<el-dialog fullscreen :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef ref="dataFormRef" v-loading="loading">
			<el-container>
				<el-aside width="80%">
					<code-editor v-model="form.templateCode" theme="darcula" mode="velocity" height="700"></code-editor>
				</el-aside>
				<el-main>
					<el-row>
						<el-form-item :label="t('template.templateName')" prop="templateName">
							<el-input :placeholder="t('template.inputTemplateNameTip')" v-model="form.templateName" />
						</el-form-item>
						<el-form-item :label="t('template.desc')" prop="templateDesc">
							<el-input :placeholder="t('template.inputDescTip')" v-model="form.templateDesc" />
						</el-form-item>
						<el-form-item :label="t('template.generatorPath')" prop="generatorPath">
							<el-input :placeholder="t('template.inputGeneratorPathTip')" v-model="form.generatorPath" />
						</el-form-item>
					</el-row>
				</el-main>
			</el-container>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="GenTemplateDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/gen/template';
import { useI18n } from 'vue-i18n';

const CodeEditor = defineAsyncComponent(() => import('/@/components/CodeEditor/index.vue'));
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

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
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
	// 获取genTemplate信息
	if (id) {
		form.id = id;
		getgenTemplateData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	// 校验模板是否为空

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
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

<style scoped>
.splitpanes__pane {
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: Helvetica, Arial, sans-serif;
	color: rgba(255, 255, 255, 0.6);
	font-size: 5em;
}
</style>
