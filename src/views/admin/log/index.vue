<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('syslog.logType')" prop="logType">
						<el-select :placeholder="$t('syslog.inputLogTypeTip')" class="w100" clearable v-model="state.queryForm.logType">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in log_type" />
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('syslog.createTime')" prop="createTime">
						<el-date-picker
							:end-placeholder="$t('syslog.inputEndPlaceholderTip')"
							:start-placeholder="$t('syslog.inputStartPlaceholderTip')"
							range-separator="To"
							type="datetimerange"
							v-model="state.queryForm.createTime"
							value-format="YYYY-MM-DD HH:mm:ss"
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }} </el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button :disabled="multiple" v-auth="'sys_log_del'" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'sys_log_export'"
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
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="$t('syslog.index')" type="index" width="60" />
				<el-table-column :label="$t('syslog.logType')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="log_type" :value="scope.row.logType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('syslog.title')" prop="title" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('syslog.remoteAddr')" prop="remoteAddr" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('syslog.method')" prop="method" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('syslog.time')" prop="time" show-overflow-tooltip>
					<template #default="scope">
						<span v-if="scope.row.time">{{scope.row.time}}/ms</span>
					</template>
				</el-table-column>
				<el-table-column :label="$t('syslog.createTime')" prop="createTime" show-overflow-tooltip sortable="custom" width="200"></el-table-column>
				<el-table-column :label="$t('syslog.createBy')" prop="createBy" show-overflow-tooltip sortable="custom" width="200"></el-table-column>
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="view" @click="LogDetailRef.openDialog(scope.row)" size="small" text type="primary">
							{{ $t('common.detailBtn') }}
						</el-button>
						<el-button v-auth="'sys_log_del'" icon="delete" @click="handleDelete([scope.row.id])" size="small" text type="primary">
							{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"> </pagination>
			<log-detail ref="LogDetailRef"></log-detail>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, pageList } from '/@/api/admin/log';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
const LogDetail = defineAsyncComponent(() => import('./detail.vue'));

const LogDetailRef = ref();

const { log_type } = useDict('log_type');

const { t } = useI18n();

// 定义变量内容
const queryRef = ref();
const showSearch = ref(true);

// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		logType: '',
		createTime: '',
	},
	selectObjs: [],
	pageList: pageList,
	descs: ['create_time'],
});

//  table hook
const { downBlobFile, getDataList, currentChangeHandle, sortChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/log/export', state.queryForm, 'log.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>

<style lang="scss" scoped>
pre code.hljs {
	width: 65%;
}
</style>
