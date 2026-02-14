<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="t('order.status')" prop="status">
						<el-select :placeholder="t('order.inputStatusTip')" v-model="state.queryForm.status">
							<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType"> </el-option>
						</el-select>
					</el-form-item>

					<el-form-item :label="$t('order.payOrderId')" prop="payOrderId">
						<el-input :placeholder="t('order.inputPayOrderIdTip')" style="max-width: 180px" v-model="state.queryForm.payOrderId" />
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
						:disabled="multiple"
						plain
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
				<el-table-column :label="t('order.index')" type="index" width="60" />
				<el-table-column :label="t('order.goodsId')" prop="goodsId" show-overflow-tooltip />
				<el-table-column :label="t('order.goodsName')" prop="goodsName" show-overflow-tooltip />
				<el-table-column :label="t('order.amount')" prop="amount" show-overflow-tooltip />
				<el-table-column :label="t('order.status')" prop="status" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="dictType" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="t('order.payOrderId')" prop="payOrderId" show-overflow-tooltip />
				<el-table-column :label="t('order.createTime')" prop="createTime" show-overflow-tooltip />

				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="delete" @click="handleDelete([scope.row.goodsOrderId])" text type="primary" v-auth="'pay_order_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script lang="ts" name="systemPayGoodsOrder" setup>
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObjs, fetchList } from '/@/api/pay/goods';

const { t } = useI18n();
const queryRef = ref();
const showSearch = ref(true);
const selectObjs = ref<string[]>([]);
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
    label: '退款成功',
    value: '5',
  },
]);

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

const resetQuery = () => {
	queryRef.value.resetFields();
	selectObjs.value = [];
	getDataList();
};

const exportExcel = () => {
	downBlobFile('/pay/goods/export', state.queryForm, 'order.xlsx');
};

const handleSelectionChange = (objs: { goodsOrderId: string }[]) => {
	selectObjs.value = objs.map(({ goodsOrderId }) => goodsOrderId);
	multiple.value = !objs.length;
};

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
