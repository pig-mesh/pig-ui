<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8" v-show="showSearch">
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
					<el-form-item class="ml2">
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="exportExcel" class="ml10" icon="Download" type="primary">
						{{ $t('common.exportBtn') }}
					</el-button>
					<right-toolbar
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>
			<el-table :data="state.dataList" style="width: 100%" v-loading="state.loading">
				<el-table-column :label="t('table.index')" type="index" width="80" />
				<el-table-column :label="t('table.tableName')" prop="tableName" show-overflow-tooltip />
				<el-table-column :label="t('table.tableDesc')" prop="tableComment" show-overflow-tooltip />
				<el-table-column :label="t('table.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="200">
					<template #default="scope">
						<el-button @click="syncTable(state.queryForm.dsName, scope.row.tableName)" text type="primary">
							{{ $t('gen.syncBtn') }}
						</el-button>
						<el-button @click="openGen(scope.row)" text type="primary">{{ $t('gen.genBtn') }} </el-button>
						<el-button @click="openDesign(scope.row)" text type="primary">{{ $t('gen.designBtn') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemTable" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, useSyncTableApi } from '/@/api/gen/table';
import { list } from '/@/api/gen/datasource';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

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
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile } = useTable(state);

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
	router.push({
		path: '/gen/gener/index',
		query: {
			tableName: row.tableName,
			dsName: state.queryForm.dsName,
		},
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
const syncTable = (dsName: string, tableName: string) => {
	useSyncTableApi(dsName, tableName).then(() => {
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
