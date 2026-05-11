<script setup lang="ts" name="flowMobileTask">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NextLoading } from '/@/utils/loading';
import FormCreate from '/@/views/flow/workflow/components/FormCreate.vue';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';
import RefuseHandle from '/@/views/flow/task/handler/refuse.vue';
import TransferHandle from '/@/views/flow/task/handler/transfer.vue';
import { showMobileSuccessConfirm } from './mobileSuccessConfirm';
import { type MobileTaskType, useMobileTaskDetail } from './useMobileTaskDetail';
import { useMobileRouteQuery } from './useMobileRouteQuery';

const router = useRouter();
const { getQueryValue } = useMobileRouteQuery();

const taskType = computed<MobileTaskType>(() => {
	const type = getQueryValue('type');
	if (type === 'completed' || type === 'cc' || type === 'started') return type;
	if (getQueryValue('copyId', 'copy_id')) return 'cc';
	if (getQueryValue('processInstanceId', 'process_instance_id') && !getQueryValue('taskId', 'task_id')) return 'started';
	return 'pending';
});

const taskId = computed(() => {
	const explicitTaskId = getQueryValue('taskId', 'task_id', 'resubmitTaskId');
	if (explicitTaskId) return explicitTaskId;
	return taskType.value === 'pending' || taskType.value === 'completed' ? getQueryValue('id') : '';
});
const copyId = computed(() => {
	const explicitCopyId = getQueryValue('copyId', 'copy_id');
	if (explicitCopyId) return explicitCopyId;
	return taskType.value === 'cc' ? getQueryValue('id') : '';
});
const processInstanceId = computed(() => {
	const explicitProcessInstanceId = getQueryValue('processInstanceId', 'process_instance_id');
	if (explicitProcessInstanceId) return explicitProcessInstanceId;
	return taskType.value === 'started' ? getQueryValue('id') : '';
});

function goBack() {
	if (window.history.length > 1) {
		router.back();
		return;
	}
	router.replace('/home');
}

async function handleOperationSubmitted(message: string) {
	await showMobileSuccessConfirm(message);
	goBack();
}

const {
	loading,
	submitLoading,
	pageError,
	currentData,
	rule,
	fApi,
	formData,
	option,
	dynamicFormComponent,
	approveDesc,
	canSubmit,
	canResubmit,
	loadDetail,
	submitAgree,
	submitResubmit,
} = useMobileTaskDetail({
	type: () => taskType.value,
	taskId: () => taskId.value,
	copyId: () => copyId.value,
	processInstanceId: () => processInstanceId.value,
	onSubmitted: handleOperationSubmitted,
});

const readonlyMode = computed(() => taskType.value !== 'pending');
const flowProgressReady = computed(() => !!currentData.value?.flowId || !!currentData.value?.processInstanceId);
const flowProgressTaskId = computed(() => (taskType.value === 'pending' ? currentData.value?.taskId || '' : ''));
const refuseHandler = ref();
const transferHandler = ref();

function handleTaskSubmitted(message = '操作成功') {
	handleOperationSubmitted(message);
}

function refuseTask() {
	refuseHandler.value?.handle(currentData.value, formData.value);
}

function transferTask() {
	transferHandler.value?.handle(currentData.value, formData.value);
}

onMounted(() => {
	loadDetail();
	NextLoading.done();
});
</script>

<template>
	<div class="h-screen h-[100dvh] overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
		<div class="mx-auto flex h-full w-full max-w-[430px] flex-col">
			<main class="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-3">
				<el-alert v-if="pageError" :title="pageError" type="error" show-icon :closable="false">
					<template #default>
						<el-button class="mt-3" size="small" type="primary" @click="loadDetail">重试</el-button>
					</template>
				</el-alert>

				<div v-else-if="loading" class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
					<el-skeleton :rows="6" animated />
				</div>

				<template v-else>
					<section class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
						<div class="mb-4">
							<h2 class="text-base font-bold text-slate-950 dark:text-white">表单信息</h2>
							<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{ readonlyMode ? '当前为只读查看' : '请处理任务后提交' }}</p>
						</div>
						<el-form
							label-position="top"
							class="[&_.el-form-item]:mb-[18px] [&_.el-form-item\_\_label]:pb-1.5 [&_.el-form-item\_\_label]:font-semibold [&_.el-form-item\_\_label]:text-slate-700 dark:[&_.el-form-item\_\_label]:text-slate-200 [&_.el-input\_\_wrapper]:rounded-[14px] [&_.el-input\_\_wrapper]:shadow-[0_0_0_1px_rgb(226_232_240)_inset] dark:[&_.el-input\_\_wrapper]:shadow-[0_0_0_1px_rgb(51_65_85)_inset] [&_.el-textarea\_\_inner]:rounded-[14px] [&_.el-textarea\_\_inner]:shadow-[0_0_0_1px_rgb(226_232_240)_inset] dark:[&_.el-textarea\_\_inner]:shadow-[0_0_0_1px_rgb(51_65_85)_inset] [&_.el-select\_\_wrapper]:rounded-[14px] [&_.el-select\_\_wrapper]:shadow-[0_0_0_1px_rgb(226_232_240)_inset] dark:[&_.el-select\_\_wrapper]:shadow-[0_0_0_1px_rgb(51_65_85)_inset]"
						>
							<div v-if="!dynamicFormComponent">
								<FormCreate :rule="rule" v-model="formData" v-model:api="fApi" :option="option" />
							</div>
							<component v-else :is="dynamicFormComponent.component" v-bind="dynamicFormComponent.props" />
						</el-form>
					</section>

					<section class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
						<h2 class="mb-4 text-base font-bold text-slate-950 dark:text-white">流程进度</h2>
						<FlowNodeFormat
							v-if="flowProgressReady"
							:disableSelect="true"
							:task-id="flowProgressTaskId"
							:processInstanceId="currentData?.processInstanceId"
							:flow-id="currentData?.flowId"
						/>
						<el-empty v-else description="暂无流程进度" :image-size="80" />
					</section>

					<section v-if="canSubmit" class="p-5 bg-white shadow-sm rounded-3xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800">
						<h2 class="mb-3 text-base font-bold text-slate-950 dark:text-white">审批意见</h2>
						<el-input v-model="approveDesc" type="textarea" :rows="4" maxlength="100" show-word-limit placeholder="请输入审批意见" />
					</section>
				</template>
			</main>

			<footer
				v-if="!pageError && (canResubmit || canSubmit)"
				class="shrink-0 border-t border-slate-200/80 bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
			>
				<div class="mx-auto flex max-w-[430px] gap-3">
					<el-button
						v-if="canResubmit"
						class="!h-11 flex-[2] !rounded-2xl"
						size="large"
						type="primary"
						:loading="submitLoading"
						@click="submitResubmit"
						>重新提交</el-button
					>
					<template v-else-if="canSubmit">
						<el-button class="!h-11 flex-1 !rounded-2xl" size="large" type="danger" @click="refuseTask">拒绝</el-button>
						<el-button class="!h-11 flex-1 !rounded-2xl" size="large" type="info" @click="transferTask">转办</el-button>
						<el-button class="!h-11 flex-[1.4] !rounded-2xl" size="large" type="primary" :loading="submitLoading" @click="submitAgree"
							>同意</el-button
						>
					</template>
				</div>
			</footer>
			<RefuseHandle ref="refuseHandler" @taskSubmitEvent="handleTaskSubmitted" />
			<TransferHandle ref="transferHandler" :show-success-message="false" @taskSubmitEvent="handleTaskSubmitted" />
		</div>
	</div>
</template>
