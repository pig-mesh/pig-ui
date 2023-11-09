<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('refund.refundOrderId')" prop="refundOrderId">
						<el-input :placeholder="t('refund.inputRefundOrderIdTip')" style="max-width: 180px" v-model="state.queryForm.refundOrderId" />
					</el-form-item>
					<el-form-item :label="$t('refund.payOrderId')" prop="payOrderId">
						<el-input :placeholder="t('refund.inputPayOrderIdTip')" style="max-width: 180px" v-model="state.queryForm.payOrderId" />
					</el-form-item>
					<el-form-item :label="$t('refund.mchId')" prop="mchId">
						<el-input :placeholder="t('refund.inputMchIdTip')" style="max-width: 180px" v-model="state.queryForm.mchId" />
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
						v-auth="'pay_order_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'pay_order_export'"
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
				<el-table-column :label="t('refund.index')" fixed type="index" width="60" />
				<el-table-column :label="t('refund.refundOrderId')" prop="refundOrderId" show-overflow-tooltip />
				<el-table-column :label="t('refund.payOrderId')" prop="payOrderId" show-overflow-tooltip />
				<el-table-column :label="t('refund.channelId')" prop="channelId" show-overflow-tooltip />
				<el-table-column :label="t('refund.payAmount')" prop="payAmount" show-overflow-tooltip />
				<el-table-column :label="t('refund.refundAmount')" prop="refundAmount" show-overflow-tooltip />
				<el-table-column :label="t('refund.remark')" prop="remark" show-overflow-tooltip />
				<el-table-column :label="t('refund.refundSuccTime')" prop="refundSuccTime" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="scope">
						<el-button icon="delete" @click="handleDelete([scope.row.refundOrderId])" text type="primary" v-auth="'pay_order_export'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayRefundOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/pay/refund';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
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
	downBlobFile('/pay/refund/export', state.queryForm, 'refund.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { refundOrderId: string }[]) => {
	selectObjs.value = objs.map(({ refundOrderId }) => refundOrderId);
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
