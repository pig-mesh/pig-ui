<template>
	<div class="layout-padding-auto layout-padding-view">
		<div class="mb8">
			<el-button icon="folder-add" type="primary" class="ml10" @click="dictformRef.openDialog(null, state.queryForm)">
				{{ $t('common.addBtn') }}
			</el-button>
			<right-toolbar :search="false" class="ml10" style="float: right; margin-right: 20px" @queryTable="getDataList"></right-toolbar>
		</div>
		<el-table
			:data="state.dataList"
			v-loading="state.loading"
			style="width: 100%"
			border
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
		>
			<el-table-column prop="dictType" :label="$t('dictItem.dictType')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="value" :label="$t('dictItem.itemValue')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="label" :label="$t('dictItem.label')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="description" :label="$t('dictItem.description')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="sortOrder" :label="$t('dictItem.sortOrder')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="remarks" :label="$t('dictItem.remarks')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="createTime" :label="$t('dictItem.createTime')" show-overflow-tooltip></el-table-column>

			<el-table-column :label="$t('common.action')" width="150">
				<template #default="scope">
					<el-button icon="edit-pen" text type="primary" @click="dictformRef.openDialog(scope.row)"> {{ $t('common.editBtn') }} </el-button>
					<el-button icon="delete" text type="primary" @click="handleDelete(scope.row)">
						{{ $t('common.delBtn') }}
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"> </pagination>
		<dict-form ref="dictformRef" @refresh="getDataList"></dict-form>
	</div>
</template>

<script setup lang="ts" name="dict-item">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchItemList, delItemObj } from '/@/api/admin/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const visible = ref(false);
const DictForm = defineAsyncComponent(() => import('./form.vue'));
const dictformRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		dictId: '',
		dictType: '',
	},
	createdIsNeed: false,
	pageList: fetchItemList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delItemObj(row.id);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
const open = (row: any) => {
	state.queryForm.dictId = row.id;
	state.queryForm.dictType = row.dictType;
	visible.value = true;
	getDataList();
};
// 暴露变量
defineExpose({
	open,
});
</script>

<style scoped></style>
