<template>
	<div class="layout-padding-auto layout-padding-view">
		<div class="mb8">
			<el-button icon="folder-add" type="primary" class="ml10" @click="dictformRef.openDialog(null, state.queryForm)">
				{{ $t('common.addBtn') }}
			</el-button>
			<right-toolbar :search="false" class="ml10" style="float: right; margin-right: 20px" @queryTable="getDataList"></right-toolbar>
		</div>
		<el-table
			ref="tableRef"
			:data="state.dataList"
			v-loading="state.loading"
			row-key="id"
			style="width: 100%"
			border
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
		>
			<el-table-column type="index" width="52" align="center">
				<template #header>
					<span class="sort-header-placeholder"></span>
				</template>
				<template #default>
					<el-icon class="sort-handle" :class="{ 'is-disabled': state.loading || sortSaving }">
						<Rank />
					</el-icon>
				</template>
			</el-table-column>
			<el-table-column prop="dictType" :label="$t('dictItem.dictType')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="value" :label="$t('dictItem.itemValue')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="label" :label="$t('dictItem.label')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="description" :label="$t('dictItem.description')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="sortOrder" :label="$t('dictItem.sortOrder')" show-overflow-tooltip></el-table-column>
			<el-table-column prop="listClass" :label="$t('dictItem.listClass')" width="120">
				<template #default="scope">
					<el-tag v-if="scope.row.listClass" :type="scope.row.listClass === 'primary' ? '' : scope.row.listClass" size="small">
						{{ scope.row.label }}
					</el-tag>
					<span v-else>-</span>
				</template>
			</el-table-column>
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
import { fetchItemList, delItemObj, sortDictItem } from '/@/api/admin/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { Rank } from '@element-plus/icons-vue';
import { useI18n } from 'vue-i18n';
import Sortable from 'sortablejs';

const { t } = useI18n();
const DictForm = defineAsyncComponent(() => import('./form.vue'));
const tableRef = ref();
const dictformRef = ref();
const sortableRef = shallowRef<Sortable | null>(null);
const sortSaving = shallowRef(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		dictId: '',
		dictType: '',
	},
	createdIsNeed: false,
	pageList: fetchItemList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

const destroySortable = () => {
	sortableRef.value?.destroy();
	sortableRef.value = null;
};

const getSortableTbody = () => {
	const handle = tableRef.value?.$el?.querySelector('.sort-handle');
	return handle?.closest('tbody') || tableRef.value?.$el?.querySelector('.el-table__body-wrapper tbody');
};

const initDictItemSortable = () => {
	destroySortable();

	const tbody = getSortableTbody();
	if (!tbody || state.loading || sortSaving.value) return;

	sortableRef.value = Sortable.create(tbody, {
		handle: '.sort-handle',
		animation: 300,
		disabled: Boolean(state.loading || sortSaving.value),
		onEnd: handleSortEnd,
	});
};

async function handleSortEnd(event: Sortable.SortableEvent) {
	if (state.loading || sortSaving.value) {
		nextTick(initDictItemSortable);
		return;
	}

	const { oldIndex, newIndex } = event;
	const dataList = state.dataList;
	if (!Array.isArray(dataList) || oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
		nextTick(initDictItemSortable);
		return;
	}

	const previousRows = [...dataList];
	const movedRow = dataList.splice(oldIndex, 1)[0];
	if (!movedRow) {
		dataList.splice(0, dataList.length, ...previousRows);
		nextTick(initDictItemSortable);
		return;
	}

	dataList.splice(newIndex, 0, movedRow);
	sortSaving.value = true;

	try {
		await sortDictItem({
			dictId: state.queryForm.dictId,
			itemIds: dataList.map((item: any) => item.id),
		});
		useMessage().success(t('common.optSuccessText'));
		getDataList(false);
	} catch (err: any) {
		dataList.splice(0, dataList.length, ...previousRows);
		useMessage().error(err?.msg || t('common.optFailText'));
	} finally {
		sortSaving.value = false;
		nextTick(initDictItemSortable);
	}
}

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
	getDataList();
};

watch(
	() => [state.dataList, state.loading, sortSaving.value],
	() => {
		if (state.loading || sortSaving.value) {
			destroySortable();
			return;
		}
		nextTick(initDictItemSortable);
	},
	{ deep: true }
);

onUnmounted(() => {
	destroySortable();
});

// 暴露变量
defineExpose({
	open,
});
</script>

<style scoped>
.sort-handle {
	cursor: move;
	color: var(--el-text-color-secondary);
}

.sort-handle.is-disabled {
	cursor: not-allowed;
	opacity: 0.45;
}

.sort-header-placeholder {
	display: inline-block;
	width: 1px;
}
</style>
