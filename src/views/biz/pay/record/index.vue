<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('record.notifyId')" prop="notifyId">
						<el-input :placeholder="t('record.inputNotifyIdTip')" style="max-width: 180px" v-model="state.queryForm.notifyId" />
					</el-form-item>
					<el-form-item :label="$t('record.orderNo')" prop="orderNo">
						<el-input :placeholder="t('record.inputOrderNoTip')" style="max-width: 180px" v-model="state.queryForm.orderNo" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" formDialogRef icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" formDialogRef icon="Refresh">{{ $t('common.resetBtn') }} </el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						plain
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
						class="ml10"
						formDialogRef
						icon="Delete"
						type="primary"
						v-auth="'pay_record_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'pay_record_export'"
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
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="t('record.index')" type="index" width="60" />
				<el-table-column :label="t('record.notifyId')" prop="notifyId" show-overflow-tooltip />
				<el-table-column :label="t('record.request')" prop="request" show-overflow-tooltip />
				<el-table-column :label="t('record.response')" prop="response" show-overflow-tooltip />
				<el-table-column :label="t('record.orderNo')" prop="orderNo" show-overflow-tooltip />
				<el-table-column :label="t('record.createTime')" prop="createTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="delete" @click="handleDelete([scope.row.id])" text type="primary" v-auth="'pay_record_del'">
							{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayNotifyRecord" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/pay/record';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/pay/notify/export', state.queryForm, 'record.xlsx');
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
		await delObjs(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
