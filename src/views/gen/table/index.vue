<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="数据源" prop="name">
						<el-select @change="getDataList" placeholder="请选择数据源" v-model="state.queryForm.dsName">
							<el-option label="默认数据源" value="master"></el-option>
							<el-option :key="ds.id" :label="ds.name" :value="ds.name" v-for="ds in datasourceList"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('table.tableName')" prop="tableName">
						<el-input :placeholder="$t('table.inputtableNameTip')" v-model="state.queryForm.tableName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						icon="Plus"
						type="primary"
						class="ml10"
						@click="openBatchGenDialog"
						:disabled="state.selectObjs.length === 0 || state.selectObjs.length > 5"
					>
						{{ $t('gen.batchGenBtn') }}
					</el-button>
					<right-toolbar
						:export="true"
						@exportExcel="exportExcel"
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				ref="tableRef"
				:data="state.dataList"
				row-key="id"
				style="width: 100%"
				v-loading="state.loading"
				border
				@selection-change="handleSelectionChange"
				@row-click="handleRowClick"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="55" />
				<el-table-column :label="t('table.index')" type="index" width="60" />
				<el-table-column :label="t('table.tableName')" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('table.tableDesc')" prop="comment" show-overflow-tooltip />
				<el-table-column :label="t('table.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button icon="Refresh" @click="syncTable(scope.row)" text type="primary">
							{{ $t('gen.syncBtn') }}
						</el-button>
						<el-button icon="FolderOpened" @click="openGen(scope.row)" text type="primary">{{ $t('gen.genBtn') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<BatchGenDialog ref="batchGenDialogRef" />
	</div>
</template>

<script lang="ts" name="systemTable" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, useSyncTableApi, useTableApi } from '/@/api/gen/table';
import { list } from '/@/api/gen/datasource';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { validateNull } from '/@/utils/validate';
import BatchGenDialog from './batchGenDialog.vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const { t } = useI18n();
const queryRef = ref();
const showSearch = ref(true);
const tableRef = ref();
const datasourceList = ref();
const batchGenDialogRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		dsName: 'master',
	},
	pageList: fetchList,
	createdIsNeed: false,
	selectObjs: [],
});

const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

onMounted(() => {
	list().then((res) => {
		datasourceList.value = res.data;
		if (datasourceList.value.length > 0) {
			state.queryForm.dsName = datasourceList.value[0].name;
		}
		getDataList();
	});
});

const openGen = (row: any) => {
	useTableApi(state.queryForm.dsName, row.name)
		.then((res) => {
			if (validateNull(res.data.fieldList)) {
				syncTable(row);
			}
		})
		.finally(() => {
			router.push({
				path: '/gen/gener/index',
				query: {
					tableName: row.name,
					dsName: state.queryForm.dsName,
				},
			});
		});
};

const syncTable = (row: any) => {
	useSyncTableApi(state.queryForm.dsName, row.name).then(() => {
		useMessage().success(t('common.optSuccessText'));
	});
};

const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const exportExcel = () => {
	downBlobFile('/gen/table/export', state.queryForm, 'table.xlsx');
};

const handleRowClick = (row: any) => {
	tableRef.value.toggleRowSelection(row);
};

const handleSelectionChange = (selection: any[]) => {
	state.selectObjs = selection;
	if (selection.length > 5) {
		ElMessage.warning(t('gen.selectionLimitFive'));
	}
};

const openBatchGenDialog = () => {
	batchGenDialogRef.value.openDialog(state.selectObjs, state.queryForm.dsName);
};
</script>
