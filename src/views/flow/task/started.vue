<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml-2.5">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item label="状态" prop="status">
						<el-select v-model="state.queryForm.status" placeholder="请选择状态">
							<el-option
								v-for="option in PROCESS_INSTANCE_STATUS_OPTIONS"
								:key="option.value"
								:label="option.label"
								:value="option.value"
							/>
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
				<div class="w-full mb-2">
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
						<el-tag :type="getProcessStatusTagType(scope.row)">
							{{ getProcessStatusLabel(scope.row) }}
						</el-tag>
					</template>
				</el-table-column>

				<el-table-column fixed="right" label="操作">
					<template #default="scope">
						<el-button type="primary" size="small" link icon="View" @click="deal(scope.row)"> 查看 </el-button>
						<el-button
							v-if="scope.row.hasPrintTemplate"
							type="primary"
							size="small"
							link
							icon="Printer"
							:loading="printLoading"
							@click="handlePrint(scope.row)"
						>
							打印
						</el-button>
						<el-button
							v-if="scope.row.canWithdraw"
							:loading="withdrawLoading === scope.row.processInstanceId"
							type="warning"
							size="small"
							link
							icon="RefreshLeft"
							@click="withdraw(scope.row)"
						>
							撤回
						</el-button>
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
					</template>
				</el-table-column>
			</el-table>

			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"></pagination>
			<!--			右侧抽屉-->
			<el-drawer v-model="rightDrawerVisible" v-if="rightDrawerVisible" direction="rtl" :size="isFullscreen ? '100%' : '70%'" destroy-on-close>
				<template #header>
					<div class="flex items-center justify-between w-full">
						<div class="flex items-center gap-3">
							<h3>{{ currentData?.name }}</h3>
							<el-button
								v-if="currentData?.canWithdraw"
								type="warning"
								link
								icon="RefreshLeft"
								:loading="withdrawLoading === currentData?.processInstanceId"
								@click="withdraw(currentData)"
							>
								撤回
							</el-button>
						</div>
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
import { queryMineStarted, withdrawProcessInstance, resubmitTask } from '/@/api/flow/task';
import { detail } from '/@/api/flow/processInstance';
import { BasicTableProps, useTable } from '/@/hooks/table';
import FormCreate from '/@/views/flow/workflow/components/FormCreate.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';
import { useTaskFormLoader } from './composables/useTaskForm';
import { getProcessStatusLabel, getProcessStatusTagType, PROCESS_INSTANCE_STATUS_OPTIONS } from './composables/flowStatus';
import { usePrintTemplate } from '/@/views/flow/group/print/usePrintTemplate';
import type { ProcessInstanceRow } from '/@/api/flow/processInstance';

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
		status: PROCESS_INSTANCE_STATUS_OPTIONS[0].value,
	},
});

const { tableStyle, getDataList, currentChangeHandle, sizeChangeHandle } = useTable(state);
const withdrawLoading = ref('');
async function withdraw(row: ProcessInstanceRow) {
	try {
		await useMessageBox().confirm('仅首个审批节点尚未处理时可撤回。撤回后流程将结束，且不可恢复。');
	} catch {
		return;
	}

	withdrawLoading.value = row.processInstanceId;
	try {
		await withdrawProcessInstance({
			processInstanceId: row.processInstanceId,
		});
		useMessage().success('流程撤回成功');
		rightDrawerVisible.value = false;
		getDataList();
	} catch (error) {
		useMessage().error(error?.msg || '流程撤回失败，请重试');
	} finally {
		withdrawLoading.value = '';
	}
}

const currentData = ref();

// 打印功能
const { executePrint, loading: printLoading } = usePrintTemplate();
const handlePrint = async (row: ProcessInstanceRow) => {
	try {
		await executePrint(row);
	} catch (e: any) {
		useMessage().warning(e.message || '打印失败');
	}
};

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
		} catch {
			useMessage().error('重新提交失败');
		} finally {
		resubmitLoading.value = false;
	}
};

onMounted(() => {
	getDataList();
});
</script>
