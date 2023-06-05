<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<v-form-designer ref="vfDesignerRef" :banned-widgets="bannedWidgets" :designer-config="designerConfig">
				<template #customToolButtons>
					<el-button link type="primary" @click="saveJsonConfig">保存</el-button>
					<el-button link type="primary" @click="exportSfcConfig">导出</el-button>
					<el-button link type="primary" @click="formDialogRef.openDialog(dsName, tableName)">历史</el-button>
				</template>
			</v-form-designer>
		</div>
		<form-dialog ref="formDialogRef" @refresh="handleRefresh" />
	</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { fetchFormById, useFormConfSaveApi, useGeneratorVFormApi, useGeneratorVFormSfcApi } from '/@/api/gen/table';
import { useMessage } from '/@/hooks/message';
import { handleBlobFile } from '/@/utils/other';
const FormDialog = defineAsyncComponent(() => import('./form.vue'));

const route = useRoute();

const vfDesignerRef = ref();

const formDialogRef = ref();

const bannedWidgets = reactive(['tab', 'card', 'table', 'cascader']);

const designerConfig = reactive({
	//是否显示语言切换菜单
	languageMenu: false,

	//是否显示GitHub、文档等外部链接
	externalLink: false,

	//是否显示表单模板
	formTemplates: false,

	//是否禁止修改唯一名称
	widgetNameReadonly: false,

	//是否显示组件事件属性折叠面板
	eventCollapse: false,

	//是否显示清空设计器按钮
	clearDesignerButton: true,

	//是否显示预览表单按钮
	previewFormButton: false,

	//是否显示导入JSON按钮
	importJsonButton: false,

	//是否显示导出JSON器按钮
	exportJsonButton: false,

	//是否显示导出代码按钮
	exportCodeButton: true,

	//是否显示生成SFC按钮
	generateSFCButton: false,
});

onMounted(() => {
	importJsonConfig();
});

const { t } = useI18n();
const tableName = ref();
const dsName = ref();
// 根据当前表，获取json配置信息
const importJsonConfig = () => {
	const { tableName, dsName } = route.query;

	if (tableName && tableName) {
		useGeneratorVFormApi(dsName, tableName).then((res) => {
			vfDesignerRef.value.loadJson(res);
		});
	}
};

const handleRefresh = (id: string) => {
	fetchFormById(id).then((res) => {
		vfDesignerRef.value.loadJson(JSON.parse(res.data.formInfo));
	});
};

const saveJsonConfig = () => {
	const { tableName, dsName } = route.query;

	if (tableName && dsName) {
		// 先保存表单
		const formJson = vfDesignerRef.value.getFormJson();
		useFormConfSaveApi({
			dsName,
			tableName,
			formInfo: JSON.stringify(formJson),
		}).then(() => {
			useMessage().success(t('common.optSuccessText'));
		});
	}
};

const exportSfcConfig = async () => {
	try {
		const { tableName, dsName } = route.query;
		if (!tableName || !dsName) throw new Error('表名或数据源名称不能为空');
		const formJson = vfDesignerRef.value.getFormJson();
		const { data } = await useFormConfSaveApi({
			dsName,
			tableName,
			formInfo: JSON.stringify(formJson),
		});
		const sfcRes = await useGeneratorVFormSfcApi(data.id);
		handleBlobFile(sfcRes, 'form.vue');
	} catch (error: any) {
		useMessage().error(error.message);
	}
};
</script>
<style lang="scss">
body {
	margin: 0;
}
</style>
