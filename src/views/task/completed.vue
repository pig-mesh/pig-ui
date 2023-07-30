<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="queryParams" ref="queryRef" :inline="true" @keyup.enter="handleQuery">
					<el-form-item label="发起时间" prop="taskTime">
						<el-date-picker type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" v-model="queryParams.taskTime" is-range range-separator="To" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="handleQuery">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>

			<el-row>
				<div class="mb8" style="width: 100%">
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="handleQuery"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				ref="dataTableRef"
				v-loading="loading"
				:data="dataList"
				highlight-current-row
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="分组" prop="groupName" width="100" />
				<el-table-column label="流程" prop="processName" />
				<el-table-column label="发起人" prop="rootUserName" />
				<el-table-column label="发起时间" prop="startTime" />
				<el-table-column label="任务名称" prop="taskName" />
				<el-table-column label="任务开始时间" prop="taskCreateTime" />
				<el-table-column label="任务结束时间" prop="taskEndTime" />
				<el-table-column fixed="right" label="操作" width="200">
					<template #default="scope">
						<el-button type="primary" size="small" link icon="View" @click="deal(scope.row)"> 查看 </el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination
				v-if="total > 0"
				v-model:total="total"
				v-model:page="queryParams.pageNum"
				v-model:limit="queryParams.pageSize"
				@pagination="handleQuery"
			/>
		</div>
		<!--			右侧抽屉-->
		<el-drawer v-model="rightDrawerVisible" direction="rtl" size="400px">
			<template #header>
				<h3>{{ currentData?.processName }}</h3>
			</template>
			<template #default>
				<el-card class="box-card">
					<form-render ref="formRenderRef" :form-list="currentOpenFlowForm"></form-render>
				</el-card>
				<flow-node-format
					:disableSelect="true"
					:formData="formValue"
					:processInstanceId="currentData.processInstanceId"
					:flow-id="currentData.flowId"
					ref="flowNodeFormatRef"
				></flow-node-format>
			</template>
		</el-drawer>
	</div>
</template>
<script setup lang="ts">
import FormRender from '/@/views/flow/form/render/FormRender.vue';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';

import { queryMineEndTask, queryTask, stopProcessInstance } from '/@/api/flow/task';

import { BasicTableProps, useTable } from '/@/hooks/table';

function stop(row) {
	stopProcessInstance({
		processInstanceId: row.processInstanceId,
	}).then((res) => {
		handleQuery();
	});
}

const state: BasicTableProps = reactive<BasicTableProps>({});
const { tableStyle } = useTable(state);

const rightDrawerVisible = ref(false);

const loading = ref(false);
const showSearch = ref(true);
const queryRef = ref();
const total = ref(0);

const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	taskTime: undefined,
});

const dataList = ref();

const currentData = ref();
/**
 * 点击开始处理
 * @param row
 */
const deal = (row) => {
	currentData.value = row;
	queryTask(row.taskId, true).then((res) => {
		currentOpenFlowForm.value = res.data.formItems;
		rightDrawerVisible.value = true;
	});
};
const currentOpenFlowForm = ref();


/**
 * 查询
 */
function handleQuery() {
	loading.value = true;
	queryMineEndTask(queryParams)
		.then(({ data }) => {
			dataList.value = data.records;
			total.value = data.total;
		})
		.finally(() => {
			loading.value = false;
		});
}

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	handleQuery();
};

onMounted(() => {
	handleQuery();
});

const formValue = computed(() => {
	var obj = {};

	for (var item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value;
	}
	return obj;
});
</script>
