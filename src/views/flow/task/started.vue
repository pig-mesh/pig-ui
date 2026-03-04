<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml-2.5">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态">
							<el-option :key="1" label="进行中" :value="1" />
							<el-option :key="2" label="已结束" :value="2" />
						</el-select>
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
				<div class="mb-2 w-full">
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml-2.5 float-right mr-5"
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
				<el-table-column label="流程" prop="name" width="150" />
				<el-table-column label="发起时间" prop="createTime" width="200" />
				<el-table-column label="结束时间" prop="endTime" width="200" />
				<el-table-column label="状态" prop="taskCreateTime" width="200">
					<template #default="scope">
						<el-tag v-if="scope.row.rejectToStarter" type="warning">驳回待提交</el-tag>
						<el-tag v-else-if="scope.row.status == 1">进行中</el-tag>
						<el-tag v-else-if="scope.row?.finishReason == '9'" type="danger">终止</el-tag>
						<el-tag v-else-if="scope.row?.finishReason == '1'" type="success">通过</el-tag>
						<el-tag v-else-if="scope.row?.finishReason == '0'" type="danger">拒绝</el-tag>
						<el-tag v-else>已结束</el-tag>
					</template>
				</el-table-column>

				<el-table-column fixed="right" label="操作">
					<template #default="scope">
						<el-button type="primary" size="small" link icon="View" @click="deal(scope.row)"> 查看 </el-button>
						<el-button
							v-if="scope.row.rejectToStarter"
							type="warning"
							size="small"
							link
							icon="RefreshRight"
							@click="handleResubmit(scope.row)"
						>
							重新提交
						</el-button>
						<el-button
							:disabled="scope.row.status != 1"
							:loading="stopLoading === scope.row.processInstanceId"
							type="primary"
							size="small"
							link
							icon="VideoPause"
							@click="stop(scope.row)"
						>
							终止流程
						</el-button>
					</template>
				</el-table-column>
			</el-table>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"></pagination>
			<!--			右侧抽屉-->
			<el-drawer v-model="rightDrawerVisible" v-if="rightDrawerVisible" direction="rtl" :size="isFullscreen ? '100%' : '70%'" destroy-on-close>
				<template #header>
					<div class="flex items-center justify-between w-full">
						<h3>{{ currentData?.name }}</h3>
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
								:processInstanceId="currentData.processInstanceId"
								:flow-id="currentData.flowId"
								ref="flowNodeFormatRef"
							/>
						</el-col>
					</el-row>
				</template>
			</el-drawer>

			<!-- 重新提交抽屉 -->
			<el-drawer v-model="resubmitDrawerVisible" v-if="resubmitDrawerVisible" direction="rtl" :size="isResubmitFullscreen ? '100%' : '70%'" destroy-on-close>
				<template #header>
					<div class="flex items-center justify-between w-full">
						<h3>{{ resubmitData?.name }} - 重新提交</h3>
						<el-button :icon="isResubmitFullscreen ? 'ScaleToOriginal' : 'FullScreen'" text @click="isResubmitFullscreen = !isResubmitFullscreen" />
					</div>
				</template>
				<template #default>
					<el-row>
						<el-col :span="16">
							<el-form label-position="top">
								<div v-if="!resubmitDynamicFormComponent">
									<FormCreate :rule="resubmitRule" v-model="resubmitFormData" v-model:api="resubmitFApi" :option="resubmitOption" />
								</div>
								<div v-else>
									<component
										:is="resubmitDynamicFormComponent.component"
										v-bind="resubmitDynamicFormComponent.props"
									/>
								</div>
							</el-form>
						</el-col>
						<el-col :span="8">
							<flow-node-format
								:disableSelect="true"
								:processInstanceId="resubmitData.processInstanceId"
								:flow-id="resubmitData.flowId"
							/>
						</el-col>
					</el-row>
				</template>
				<template #footer>
					<div style="flex: auto">
						<el-button size="large" @click="resubmitDrawerVisible = false">取消</el-button>
						<el-button size="large" type="primary" icon="Check" :loading="resubmitLoading" @click="doResubmit">提交</el-button>
					</div>
				</template>
			</el-drawer>
		</div>
	</div>
</template>
<script setup lang="ts">
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';
import { queryMineStarted, stopProcessInstance, resubmitTask } from '/@/api/flow/task';
import { detail } from '/@/api/flow/processInstance';
import { BasicTableProps, useTable } from '/@/hooks/table';
import FormCreate from '/@/views/flow/workflow/components/FormCreate.vue';
import { useMessage } from '/@/hooks/message';
import { type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';
import { useTaskFormLoader } from './composables/useTaskForm';

const rule = ref([]);
const fApi = ref();
const formData = ref({});
const option = ref<any>({});
const dynamicFormComponent = shallowRef<DynamicFormComponent | null>(null); // 动态表单组件

const rightDrawerVisible = ref(false);
const isFullscreen = ref(false);

const loading = ref(false);
const showSearch = ref(true);
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: queryMineStarted,
	queryForm: {
		taskTime: undefined,
		status: 1,
	},
});

const { tableStyle, getDataList, currentChangeHandle, sortChangeHandle, sizeChangeHandle } = useTable(state);
const stopLoading = ref('');
async function stop(row) {
	stopLoading.value = row.processInstanceId;
	try {
		await stopProcessInstance({
			processInstanceId: row.processInstanceId,
		});
		useMessage().success('流程终止成功');
		getDataList();
	} catch (error) {
		useMessage().error('终止流程失败，请重试');
	} finally {
		stopLoading.value = '';
	}
}

const currentData = ref();

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
 * 点击查看
 * @param row
 */
const deal = (row) => {
	currentData.value = row;
	loadForm(() => detail({ processInstanceId: row.processInstanceId }), {
		parseFormData: true,
		onSuccess: () => {
			rightDrawerVisible.value = true;
		},
	});
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// ========== 重新提交功能 ==========
const resubmitDrawerVisible = ref(false);
const isResubmitFullscreen = ref(false);
const resubmitData = ref();
const resubmitRule = ref([]);
const resubmitFApi = ref();
const resubmitFormData = ref({});
const resubmitOption = ref<any>({});
const resubmitDynamicFormComponent = shallowRef<DynamicFormComponent | null>(null);
const resubmitCurrentOpenFlowForm = ref();
const resubmitLoading = ref(false);

// 重新提交的表单加载器
const { loadForm: loadResubmitForm } = useTaskFormLoader({
	rule: resubmitRule,
	formData: resubmitFormData,
	option: resubmitOption,
	dynamicFormComponent: resubmitDynamicFormComponent,
	currentOpenFlowForm: resubmitCurrentOpenFlowForm,
});

/**
 * 点击重新提交按钮
 */
const handleResubmit = (row: any) => {
	resubmitData.value = row;
	loadResubmitForm(() => detail({ processInstanceId: row.processInstanceId }), {
		parseFormData: true,
		readonly: false, // 重新提交需要可编辑表单，使用 formCustomCreatePath
		onSuccess: () => {
			resubmitDrawerVisible.value = true;
		},
	});
};

/**
 * 执行重新提交
 */
const doResubmit = async () => {
	resubmitLoading.value = true;
	try {
		await resubmitTask({
			taskId: resubmitData.value.resubmitTaskId,
			formData: resubmitFormData.value,
		});
		useMessage().success('重新提交成功');
		resubmitDrawerVisible.value = false;
		getDataList();
	} catch (error) {
		console.error('重新提交失败:', error);
	} finally {
		resubmitLoading.value = false;
	}
};

onMounted(() => {
	getDataList();
});
</script>
