<template>
	<div class="layout-padding">
		<el-card class="layout-padding-auto" shadow="hover">
			<el-steps :active="active" finish-status="success" simple>
				<el-step title="基础信息" @click="go(0)" />
				<el-step title="数据修改" @click="go(1)" />
			</el-steps>
		</el-card>

		<el-card class="layout-padding-auto mt5" shadow="hover">
			<!-- 生成基本信息设置 -->
			<generator ref="generatorRef" :tableName="tableName" :dsName="dsName" v-if="active === 0" />
			<!-- 字段编辑设置 -->
			<edit-table ref="editTableRef" :tableName="tableName" :dsName="dsName" v-if="active === 1" />

			<div style="text-align: center">
				<el-button style="margin-top: 12px" @click="go(1)" v-if="active === 0">下一步</el-button>
				<el-button style="margin-top: 12px" @click="go(0)" v-if="active === 1">上一步</el-button>
				<el-button style="margin-top: 12px" @click="preview" v-if="active === 1">保存并预览</el-button>
				<el-button style="margin-top: 12px" @click="generatorHandle" v-if="active === 1">保存并生成</el-button>
			</div>
		</el-card>

		<!-- 预览基本信息 -->
		<preview-dialog ref="previewDialogRef" />
	</div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useGeneratorCodeApi } from '/@/api/gen/table';
import { useMessage } from '/@/hooks/message';
import { downBlobFile } from '/@/utils/other';

const { t } = useI18n();
const Generator = defineAsyncComponent(() => import('../table/generator.vue'));
const EditTable = defineAsyncComponent(() => import('../table/edit.vue'));
const PreviewDialog = defineAsyncComponent(() => import('../table/preview.vue'));
const previewDialogRef = ref();
const generatorRef = ref();

const route = useRoute();
const active = ref(0);
const tableId = ref();
const tableName = ref();
const dsName = ref();
const editTableRef = ref();
const generatorType = ref();

const go = async (activeNum: number) => {
	if (active.value === activeNum) return;
	active.value = activeNum;

	if (activeNum === 0) {
		await editTableRef.value.submitHandle();
	} else if (activeNum === 1) {
		const dataform = await generatorRef.value.submitHandle();
		tableId.value = dataform.id;
		generatorType.value = dataform.generatorType;
	}
};

const preview = async () => {
	await editTableRef.value.submitHandle();
	previewDialogRef.value.openDialog(tableId.value);
};

// 生成
const generatorHandle = async () => {
	await editTableRef.value.submitHandle();
	// 生成代码，zip压缩包
	if (generatorType.value === '0') {
		downBlobFile(`/gen/generator/download?tableIds=${[tableId.value].join(',')}`, {}, `${tableName.value}.zip`);
	}

	// 写入到指定目录
	if (generatorType.value === '1') {
		useGeneratorCodeApi([tableId.value].join(',')).then(() => {
			useMessage().success(t('common.optSuccessText'));
		});
	}
};

onMounted(() => {
	tableName.value = route.query.tableName;
	dsName.value = route.query.dsName;
});
</script>

<style scoped>
.layout-padding {
	height: auto !important;
}
</style>
