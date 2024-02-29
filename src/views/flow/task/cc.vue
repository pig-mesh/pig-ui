<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="发起时间" prop="taskTime">
						<el-date-picker type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" v-model="state.queryForm.taskTime" is-range range-separator="To" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
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
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>

			<el-table
				ref="dataTableRef"
				v-loading="loading"
				:data="state.dataList"
				highlight-current-row
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column label="分组" prop="groupName" width="100" />
				<el-table-column label="流程" prop="processName" />
				<el-table-column label="发起人" prop="startUserName" />
				<el-table-column label="发起时间" prop="startTime" />
				<el-table-column label="节点" prop="nodeName" />
				<el-table-column label="抄送时间" prop="nodeTime" />

				<el-table-column fixed="right" label="操作" width="200">
					<template #default="scope">
						<el-button type="primary" size="small" icon="View" link @click="deal(scope.row)"> 查看 </el-button>
					</template>
				</el-table-column>
			</el-table>

      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle"
                  v-bind="state.pagination"></pagination>
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

import {queryMineCC, queryMineCCDetail} from '/@/api/flow/task';
import { BasicTableProps, useTable } from '/@/hooks/table';


const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: queryMineCC,
  queryForm: {
    taskTime: undefined,
  },
});

const { tableStyle ,getDataList, currentChangeHandle,
  sortChangeHandle,
  sizeChangeHandle, } = useTable(state);

const rightDrawerVisible = ref(false);

const loading = ref(false);
const showSearch = ref(true);
const queryRef = ref();
const currentData = ref();
/**
 * 点击开始处理
 * @param row
 */
const deal = (row) => {
	currentData.value = row;

	queryMineCCDetail({ id: row.id }).then((res) => {
		currentOpenFlowForm.value = res.data.formItems;
		rightDrawerVisible.value = true;
	});
};
const currentOpenFlowForm = ref();

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

onMounted(() => {
	getDataList();
});

const formValue = computed(() => {
  const obj = {};
  for (const item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value;
	}
	return obj;
});
</script>
