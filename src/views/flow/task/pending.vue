<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="流程" prop="processName">
						<el-input placeholder="请输入流程名称" v-model="state.queryForm.processName" />
					</el-form-item>
					<el-form-item label="发起时间" prop="taskTime">
						<el-date-picker
							type="datetimerange"
							value-format="YYYY-MM-DD HH:mm:ss"
							v-model="state.queryForm.taskTime"
							is-range
							range-separator="To"
						/>
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
				<el-table-column label="发起人" prop="rootUserName" />
				<el-table-column label="发起时间" prop="startTime" />
				<el-table-column label="当前节点" prop="taskName" />
				<el-table-column label="任务时间" prop="taskCreateTime" />
				<el-table-column fixed="right" label="操作" width="200">
					<template #default="scope">
						<el-button
					type="primary"
					size="small"
					link
					icon="VideoPlay"
					:disabled="scope.row.taskName?.includes('发起人')"
					@click="deal(scope.row)"
				>
					开始处理
				</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"></pagination>

			<!--			右侧抽屉-->
			<el-drawer v-model="rightDrawerVisible" v-if="rightDrawerVisible" direction="rtl" :size="isFullscreen ? '100%' : '70%'" destroy-on-close>
				<template #header>
					<div class="flex items-center justify-between w-full">
						<h3>{{ currentData?.processName }}</h3>
						<el-button :icon="isFullscreen ? 'ScaleToOriginal' : 'FullScreen'" text @click="isFullscreen = !isFullscreen" />
					</div>
				</template>
				<template #default>
					<el-row>
						<el-col :span="16">
							<el-form label-position="top">
								<!-- 情况一：动态表单 -->
								<div v-if="!dynamicFormComponent">
									<FormCreate :rule="rule" v-model="formData" v-model:api="fApi" :option="option" />
								</div>
								<!-- 情况二：自定义业务表单 -->
								<div v-else>
									<component 
										:is="dynamicFormComponent.component" 
										v-bind="dynamicFormComponent.props"
									/>
								</div>
							</el-form>
						</el-col>
						<el-col :span="8">
							<flow-node-format
								:disableSelect="true"
								:task-id="currentData.taskId"
								:processInstanceId="currentData.processInstanceId"
								:flow-id="currentData.flowId"
								ref="flowNodeFormatRef"
							/>
						</el-col>
					</el-row>
				</template>
				<template #footer>
					<div style="flex: auto">
						<!-- 发起人节点（驳回后重新提交场景）：显示重新提交按钮 -->
						<template v-if="currentData?.nodeId === 'root'">
							<el-button size="large" type="primary" icon="Check" @click="handleResubmit">重新提交</el-button>
						</template>
						<!-- 普通审批节点：显示审批按钮 -->
						<template v-else>
							<el-button size="large" type="danger" icon="Close" @click="refuseTask">拒绝</el-button>
							<el-button size="large" type="primary" icon="Check" @click="submitTask">提交</el-button>
							<el-button size="large" type="info" icon="Share" @click="transferTask">转办</el-button>
						</template>
					</div>
				</template>
			</el-drawer>

			<!--同意提交处理-->
			<agree-handle @taskSubmitEvent="taskSubmitEvent" ref="agreeHandler"></agree-handle>

			<!--拒绝审核处理-->
			<refuse-handle @taskSubmitEvent="taskSubmitEvent" ref="refuseHandler"></refuse-handle>

			<!--转办处理-->
			<transfer-handle @taskSubmitEvent="taskSubmitEvent" ref="transferHandler"></transfer-handle>
		</div>
	</div>
</template>
<script setup lang="ts">
import AgreeHandle from './handler/agree.vue';
import RefuseHandle from './handler/refuse.vue';
import TransferHandle from './handler/transfer.vue';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';
import { queryMineTask, queryTask, resubmitTask } from '/@/api/flow/task';
import { BasicTableProps, useTable } from '/@/hooks/table';
import FormCreate from '/@/views/flow/workflow/components/FormCreate.vue';
import { type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';
import { useTaskFormLoader } from './composables/useTaskForm';

const rightDrawerVisible = ref(false);
const isFullscreen = ref(false);
const showSearch = ref(true);
const loading = ref(false);
const queryRef = ref();

const fApi = ref();
const formData = ref({});
const option = ref<any>({});

// Define the FormItem interface if not already defined
interface FormItem {
	// Define the properties of FormItem based on your data structure
}

const rule = ref<FormItem[]>([]);
const dynamicFormComponent = shallowRef<DynamicFormComponent | null>(null); // 动态表单组件

const currentData = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: queryMineTask,
	queryForm: {
		processName: '',
		taskTime: undefined,
	},
});

const { tableStyle, getDataList, currentChangeHandle, sizeChangeHandle } = useTable(state);

// 使用通用表单加载器
const currentOpenFlowForm = ref();
const { loadForm } = useTaskFormLoader({
	rule,
	formData,
	option,
	dynamicFormComponent,
	currentOpenFlowForm,
});

/**
 * 点击开始处理
 * @param row
 */
const deal = (row: any) => {
	currentData.value = row;
	loadForm(() => queryTask(row.taskId, false), {
		parseFormData: false,
		onSuccess: () => {
			rightDrawerVisible.value = true;
		},
	});
};

const agreeHandler = ref();
const refuseHandler = ref();
const transferHandler = ref();

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

const taskSubmitEvent = () => {
	rightDrawerVisible.value = false;
	getDataList();
};

/**
 * 提交任务
 */
const submitTask = () => {
	agreeHandler.value.handle(currentData.value,formData.value);
};
/**
 * 拒绝任务
 */
const refuseTask = () => {
	refuseHandler.value.handle(currentData.value,formData.value);
};

/**
 * 转办任务
 */
const transferTask = () => {
	transferHandler.value.handle(currentData.value,formData.value);
};

/**
 * 重新提交任务（驳回到发起人后）
 * 当流程被驳回到发起人时，发起人使用此方法重新编辑表单并提交
 */
const handleResubmit = async () => {
	try {
		await resubmitTask({
			taskId: currentData.value.taskId,
			formData: formData.value,
		});
		taskSubmitEvent();
	} catch (error) {
		console.error('重新提交失败', error);
	}
};

onMounted(() => {
	getDataList();
});
</script>
