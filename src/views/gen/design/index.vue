<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<v-form-designer ref="vfDesignerRef" :banned-widgets="bannedWidgets" :designer-config="designerConfig">
				<template #customToolButtons>
					<el-button link type="primary" @click="saveJsonConfig">保存</el-button>
					<el-button link type="primary" @click="exportJsonConfig">导出</el-button>
					<el-button link type="primary" @click="formDialogRef.openDialog(dsName, tableName)">历史</el-button>
				</template>
			</v-form-designer>
		</div>
		<form-dialog ref="formDialogRef" @refresh="handleRefresh" />
	</div>
</template>

<script lang="ts" setup>
import { fetchFormById, useFormConfSaveApi, useGeneratorVFormApi, useGeneratorVFormSfcApi } from '/@/api/gen/table';
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

const tableName = ref();
const dsName = ref();
// 根据当前表，获取json配置信息
const importJsonConfig = () => {
	tableName.value = route.query.tableName;
	dsName.value = route.query.dsName;

	if (tableName.value && tableName.value) {
		useGeneratorVFormApi(dsName.value, tableName.value).then((res) => {
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
	const tableName = route.query.tableName;
	const dsName = route.query.dsName;

	if (tableName && dsName) {
		// 先保存表单
		const formJson = vfDesignerRef.value.getFormJson();
		useFormConfSaveApi({
			dsName: dsName,
			tableName: tableName,
			formInfo: JSON.stringify(formJson),
		});
	}
};

const exportJsonConfig = async () => {
	const tableName = route.query.tableName;
	const dsName = route.query.dsName;

	if (tableName && dsName) {
		// 先保存表单
		const formJson = vfDesignerRef.value.getFormJson();
		const result = await useFormConfSaveApi({
			dsName: dsName,
			tableName: tableName,
			formInfo: JSON.stringify(formJson),
		});

		//执行 sfc代码生成
		const res = await useGeneratorVFormSfcApi(result.data.id);
		handleBlobFile(res, 'form.vue');
	}
};
</script>
<style lang="scss">
body {
	margin: 0;
}
</style>
