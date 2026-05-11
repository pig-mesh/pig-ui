import { computed, ref, shallowRef } from 'vue';
import { useAsyncState } from '@vueuse/core';
import type { Api } from '@form-create/element-ui';
import { ElMessage } from 'element-plus';
import { queryMineCCDetail, queryTask, completeTask, resubmitTask } from '/@/api/flow/task';
import { detail } from '/@/api/flow/processInstance';
import { type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';
import { useTaskFormLoader } from '/@/views/flow/task/composables/useTaskForm';

export type MobileTaskType = 'pending' | 'completed' | 'cc' | 'started';
type MobileTaskDetailData = Record<string, any> | undefined;

interface UseMobileTaskDetailOptions {
	type: () => MobileTaskType;
	taskId: () => string;
	copyId: () => string;
	processInstanceId: () => string;
	onSubmitted: (message: string) => void | Promise<void>;
}

function isReadonlyType(type: MobileTaskType) {
	return type !== 'pending';
}

export function useMobileTaskDetail(options: UseMobileTaskDetailOptions) {
	const submitLoading = shallowRef(false);
	const pageError = shallowRef('');
	const currentData = ref<MobileTaskDetailData>();
	const rule = ref<any[]>([]);
	const fApi = shallowRef<Api>();
	const formData = ref<Record<string, any>>({});
	const option = ref<any>({});
	const dynamicFormComponent = shallowRef<DynamicFormComponent | null>(null);
	const currentOpenFlowForm = ref();
	const approveDesc = ref('');

	const { handleFormResponse } = useTaskFormLoader({
		rule,
		formData,
		option,
		dynamicFormComponent,
		currentOpenFlowForm,
	});

	const activeTaskId = computed(() => currentData.value?.taskId || options.taskId());
	const activeNodeId = computed(() => currentData.value?.nodeId || currentData.value?.node?.id || '');
	const flowTitle = computed(() => currentData.value?.processName || currentData.value?.name || '流程详情');
	const canSubmit = computed(() => options.type() === 'pending' && !!activeNodeId.value && activeNodeId.value !== 'root');
	const canResubmit = computed(() => options.type() === 'pending' && activeNodeId.value === 'root');

	function validateParams() {
		const type = options.type();
		if ((type === 'pending' || type === 'completed') && !options.taskId()) return '缺少任务标识';
		if (type === 'cc' && !options.copyId()) return '缺少抄送标识';
		if (type === 'started' && !options.processInstanceId()) return '缺少流程实例标识';
		return '';
	}

	function queryDetail() {
		const type = options.type();
		if (type === 'pending') return queryTask(options.taskId(), false);
		if (type === 'completed') return queryTask(options.taskId(), true);
		if (type === 'cc') return queryMineCCDetail({ id: options.copyId() });
		return detail({ processInstanceId: options.processInstanceId() });
	}

	function normalizeDetailData(data: any) {
		const type = options.type();
		if (type === 'pending' || type === 'completed') {
			return {
				...data,
				taskId: data?.taskId || options.taskId(),
				nodeId: data?.nodeId || data?.node?.id,
			};
		}
		return data;
	}

	async function loadDetailData() {
		pageError.value = '';
		const paramError = validateParams();
		if (paramError) {
			pageError.value = paramError;
			return undefined;
		}

		const res = await queryDetail();
		const detailData = normalizeDetailData(res.data);
		currentData.value = detailData;
		handleFormResponse(detailData, {
			parseFormData: options.type() !== 'pending',
			readonly: isReadonlyType(options.type()),
		});
		return detailData;
	}

	const { isLoading: loading, execute: executeLoadDetail } = useAsyncState(loadDetailData, undefined as MobileTaskDetailData, {
		immediate: false,
		resetOnExecute: false,
		onError: (error: any) => {
			pageError.value = error?.msg || error?.message || '任务详情加载失败';
		},
	});

	function loadDetail() {
		return executeLoadDetail();
	}

	async function submitAgree() {
		const taskId = activeTaskId.value;
		if (!taskId) {
			ElMessage.warning('缺少任务标识');
			return;
		}
		const nodeId = activeNodeId.value;
		if (!nodeId) {
			ElMessage.warning('缺少节点标识');
			return;
		}
		const paramMap: Record<string, any> = {};
		paramMap[`${nodeId}_approve_condition`] = true;

		submitLoading.value = true;
		try {
			if (fApi.value) await fApi.value.submit();
			await completeTask({
				paramMap,
				formData: formData.value,
				taskId,
				taskLocalParamMap: {
					approveDesc: approveDesc.value,
				},
			});
		} catch (error: any) {
			ElMessage.error(error?.msg || error?.message || '提交失败');
			return;
		} finally {
			submitLoading.value = false;
		}
		await options.onSubmitted('提交成功');
	}

	async function submitResubmit() {
		const taskId = activeTaskId.value;
		if (!taskId) {
			ElMessage.warning('缺少任务标识');
			return;
		}

		submitLoading.value = true;
		try {
			if (fApi.value) await fApi.value.submit();
			await resubmitTask({
				taskId,
				formData: formData.value,
			});
		} catch (error: any) {
			ElMessage.error(error?.msg || error?.message || '重新提交失败');
			return;
		} finally {
			submitLoading.value = false;
		}
		await options.onSubmitted('重新提交成功');
	}

	return {
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
		flowTitle,
		canSubmit,
		canResubmit,
		loadDetail,
		submitAgree,
		submitResubmit,
	};
}
