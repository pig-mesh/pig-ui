<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="queryParams" ref="queryRef" :inline="true" @keyup.enter="handleQuery">
					<el-form-item label="流程" prop="processName">
						<el-input placeholder="请输入流程名称" v-model="queryParams.processName" />
					</el-form-item>
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
				<el-table-column label="当前节点" prop="taskName" />
				<el-table-column label="任务时间" prop="taskCreateTime" />
				<el-table-column fixed="right" label="操作" width="200">
					<template #default="scope">
						<el-button type="primary" size="small" link icon="VideoPlay" @click="deal(scope.row)"> 开始处理 </el-button>
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

			<!--			右侧抽屉-->
			<el-drawer v-model="rightDrawerVisible" direction="rtl" size="400px">
				<template #header>
					<h3>{{ currentData?.processName }}</h3>
				</template>
				<template #default>
					<el-card class="box-card">
						<form-render
							@addLayoutOneItem="addLayoutOneItem"
							@deleteLayoutOneItem="deleteLayoutOneItem"
							ref="formRenderRef"
							:form-list="currentOpenFlowForm"
						></form-render>
					</el-card>
					<flow-node-format
						:disableSelect="true"
						:formData="formValue"
						:task-id="currentData.taskId"
						:processInstanceId="currentData.processInstanceId"
						:flow-id="currentData.flowId"
						ref="flowNodeFormatRef"
						class="mt-4"
					/>
				</template>
				<template #footer>
					<div style="flex: auto">
						<el-button size="large" type="danger" @click="refuseTask">拒绝</el-button>
						<el-button size="large" type="primary" @click="submitTask">提交</el-button>
					</div>
				</template>
			</el-drawer>

			<!--同意提交处理-->
			<agree-handle @taskSubmitEvent="taskSubmitEvent" ref="agreeHandler"></agree-handle>

			<!--拒绝审核处理-->
			<refuse-handle @taskSubmitEvent="taskSubmitEvent" ref="refuseHandler"></refuse-handle>
		</div>
	</div>
</template>
<script setup lang="ts">
import FormRender from '/@/views/flow/form/render/FormRender.vue';
import AgreeHandle from './handler/agree.vue';
import RefuseHandle from './handler/refuse.vue';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';

import { queryMineTask, queryTask } from '/@/api/flow/task';

import other from '/@/utils/other';
import { BasicTableProps, useTable } from '/@/hooks/table';

const state: BasicTableProps = reactive<BasicTableProps>({});
const { tableStyle } = useTable(state);
const rightDrawerVisible = ref(false);
const showSearch = ref(true);
const loading = ref(false);
const total = ref(0);
const queryRef = ref();
const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	processName: '',
	taskTime: undefined,
});

const dataList = ref();

const currentData = ref();
/**
 * 点击开始处理
 * @param row
 */
const deal = (row: any) => {
	currentData.value = row;
	queryTask(row.taskId, false).then((res) => {
		currentOpenFlowForm.value = res.data.formItems;
		rightDrawerVisible.value = true;
	});
};
const currentOpenFlowForm = ref();
const addLayoutOneItem = (id: Number) => {
	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		let value = item.props.value;
		let oriForm = item.props.oriForm;
		value.push(other.deepClone(oriForm));
		item.props.value = value;
	}
};
const deleteLayoutOneItem = (id, index) => {
	for (var item of currentOpenFlowForm.value) {
		if (item.id !== id) {
			continue;
		}
		item.props.value.splice(index, 1);
	}
};


const agreeHandler = ref();
const refuseHandler = ref();

/**
 * 查询
 */
function handleQuery() {
	loading.value = true;
	queryMineTask(queryParams)
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

const taskSubmitEvent = () => {
	rightDrawerVisible.value = false;
	handleQuery();
};

/**
 * 提交任务
 */
const submitTask = () => {
	agreeHandler.value.handle(currentData.value, currentOpenFlowForm.value);
};
/**
 * 拒绝任务
 */
const refuseTask = () => {
	refuseHandler.value.handle(currentData.value, currentOpenFlowForm.value);
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
