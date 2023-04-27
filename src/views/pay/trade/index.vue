<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('trade.orderId')" prop="orderId">
						<el-input :placeholder="t('trade.inputOrderIdTip')" style="max-width: 180px" v-model="state.queryForm.orderId" />
					</el-form-item>

					<el-form-item :label="t('trade.status')" prop="status">
						<el-select :placeholder="t('trade.inputStatusTip')" v-model="state.queryForm.status">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType"> </el-option>
						</el-select>
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
						v-auth="'pay_trade_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'pay_trade_export'"
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
				<el-table-column :label="t('trade.index')" fixed type="index" width="60" />
				<el-table-column :label="t('trade.orderId')" prop="orderId" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.channelId')" prop="channelId" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.channelMchId')" prop="channelMchId" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.channelOrderNo')" prop="channelOrderNo" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.body')" prop="body" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.amount')" prop="amount" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.status')" prop="status" show-overflow-tooltip width="120">
					<template #default="scope">
						<dict-tag :options="dictType" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('trade.clientIp')" prop="clientIp" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.paySuccTime')" prop="paySuccTime" show-overflow-tooltip width="120" />
				<el-table-column :label="t('trade.createTime')" prop="createTime" show-overflow-tooltip width="160" />

				<el-table-column :label="$t('common.action')" fixed="right" width="150">
					<template #default="scope">
						<el-button
							icon="RefreshLeft"
							@click="refundDialogRef.openDialog(scope.row.orderId)"
							text
							type="primary"
							v-if="scope.row.status === '1'"
							v-auth="'pay_trade_del'"
							>{{ $t('trade.refundBtn') }}
						</el-button>
						<el-button icon="delete" @click="handleDelete([scope.row.orderId])" text type="primary" v-auth="'pay_trade_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<refund-dialog @refresh="getDataList(false)" ref="refundDialogRef" />
	</div>
</template>

<script lang="ts" name="systemPayTradeOrder" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/pay/trade';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const RefundDialog = defineAsyncComponent(() => import('./refund.vue'));
const { t } = useI18n();
// 定义查询字典

// 定义变量内容
const refundDialogRef = ref();
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

const dictType = ref([
	{
		label: '处理失败',
		value: '-1',
	},
	{
		label: '订单生成',
		value: '0',
	},
	{
		label: '支付成功',
		value: '1',
	},
	{
		label: '处理完成',
		value: '2',
	},
	{
		label: '退款完成',
		value: '5',
	},
]);

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
	downBlobFile('/pay/trade/export', state.queryForm, 'trade.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { orderId: string }[]) => {
	selectObjs.value = objs.map(({ orderId }) => orderId);
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
