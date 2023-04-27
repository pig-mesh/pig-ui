<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item label="数据源" prop="name">
						<el-select @change="getDataList" placeholder="请选择数据源" style="width: 100%" v-model="state.queryForm.dsName">
							<el-option label="默认数据源" value="master"></el-option>
							<el-option :key="ds.id" :label="ds.name" :value="ds.name" v-for="ds in datasourceList"> </el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('table.tableName')" prop="tableName">
						<el-input :placeholder="$t('table.inputtableNameTip')" style="max-width: 180px" v-model="state.queryForm.tableName" />
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
				:data="state.dataList"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column :label="t('table.index')" type="index" width="60" />
				<el-table-column :label="t('table.tableName')" prop="tableName" show-overflow-tooltip />
				<el-table-column :label="t('table.tableDesc')" prop="tableComment" show-overflow-tooltip />
				<el-table-column :label="t('table.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button icon="Refresh" @click="syncTable(scope.row)" text type="primary">
							{{ $t('gen.syncBtn') }}
						</el-button>
						<el-button icon="FolderOpened" @click="openGen(scope.row)" text type="primary">{{ $t('gen.genBtn') }} </el-button>
						<el-button icon="MagicStick" @click="openDesign(scope.row)" text type="primary">{{ $t('gen.designBtn') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemTable" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, useSyncTableApi, useTableApi } from '/@/api/gen/table';
import { list } from '/@/api/gen/datasource';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { validateNull } from '/@/utils/validate';

// 定义变量内容
const router = useRouter();
// 引入组件
const { t } = useI18n();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const datasourceList = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		dsName: 'master',
	},
	pageList: fetchList,
	createdIsNeed: false,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 初始化数据
onMounted(() => {
	list().then((res) => {
		datasourceList.value = res.data;
		// 默认去第一个数据源
		state.queryForm.dsName = datasourceList.value[0].name;
		getDataList();
	});
});

const openGen = (row) => {
	useTableApi(state.queryForm.dsName, row.tableName)
		.then((res) => {
			if (validateNull(res.data.fieldList)) {
				syncTable(row);
			}
		})
		.finally(() => {
			router.push({
				path: '/gen/gener/index',
				query: {
					tableName: row.tableName,
					dsName: state.queryForm.dsName,
				},
			});
		});
};

const openDesign = (row) => {
	router.push({
		path: '/gen/design/index',
		query: {
			tableName: row.tableName,
			dsName: state.queryForm.dsName,
		},
	});
};

// 同步表数据
const syncTable = (row) => {
	useSyncTableApi(state.queryForm.dsName, row.tableName).then(() => {
		useMessage().success(t('common.optSuccessText'));
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/gen/table/export', state.queryForm, 'table.xlsx');
};
</script>
