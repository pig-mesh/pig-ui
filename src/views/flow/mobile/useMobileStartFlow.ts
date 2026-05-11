import { markRaw, ref, shallowRef } from 'vue';
import { useAsyncState } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import type { Api } from '@form-create/element-ui';
import FcDesigner from 'form-create-designer';
import { getFlowDetail, startFlow } from '/@/api/flow/flow';
import { processFormItemsWithPerms } from '/@/views/flow/workflow/utils/formPermissions';
import { createDynamicFormComponent, type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';
import { initFormCreateFetch } from '/@/views/flow/workflow/utils/formCreateFetch';

initFormCreateFetch();

interface FlowData {
	flowId: string;
	name?: string;
	logo?: string;
	remark?: string;
	formItems?: string;
	formPerms?: Record<string, unknown>;
	formConfig?: string;
	selectUserNodeId?: string[];
	[key: string]: any;
}

interface FlowNodeFormatExpose {
	validate: () => boolean;
	formatSelectNodeUser: () => Record<string, any>;
	nodeUser: Record<string, any>;
}

interface UseMobileStartFlowOptions {
	flowId: () => string;
	onSubmitted: (message: string) => void | Promise<void>;
}

function parseFormConfig(formConfig: string) {
	try {
		return JSON.parse(formConfig);
	} catch {
		return {};
	}
}

export function useMobileStartFlow(options: UseMobileStartFlowOptions) {
	const submitLoading = shallowRef(false);
	const pageError = shallowRef('');
	const currentFlow = ref<FlowData>();
	const fApi = shallowRef<Api>();
	const formData = ref<Record<string, any>>({});
	const formOption = ref<Record<string, any>>({});
	const rule = ref<any[]>([]);
	const dynamicFormComponent = shallowRef<DynamicFormComponent | null>(null);
	const businessFormData = ref<Record<string, any>>({});
	const selectUserNodeId = ref<string[]>([]);
	const flowNodeFormatRef = shallowRef<FlowNodeFormatExpose>();

	const flowHelper = markRaw({
		validate: () => {
			const isValid = flowNodeFormatRef.value?.validate?.() ?? true;
			if (!isValid) ElMessage.warning('请选择节点执行人');
			return isValid;
		},
		getFlowData: () => {
			const approverData = flowNodeFormatRef.value?.formatSelectNodeUser?.() || {};
			return { flowParamMap: { ...approverData } };
		},
		getRawApproverData: () => flowNodeFormatRef.value?.formatSelectNodeUser?.() || {},
	});

	function resetFormState() {
		dynamicFormComponent.value = null;
		businessFormData.value = {};
		formData.value = {};
		formOption.value = {};
		rule.value = [];
		selectUserNodeId.value = [];
		fApi.value = undefined;
	}

	function handleBusinessFormChange(data: Record<string, any>) {
		businessFormData.value = data || {};
	}

	function setupDynamicFormForStart(formItems?: string, formPerms: Record<string, unknown> = {}) {
		if (!formItems) {
			rule.value = [];
			return;
		}

		const parsedFormItems = FcDesigner.formCreate.parseJson(formItems);
		rule.value = processFormItemsWithPerms(parsedFormItems, formPerms);
	}

	async function loadFlowData() {
		pageError.value = '';
		const id = options.flowId();
		if (!id) {
			pageError.value = '缺少流程标识';
			return undefined;
		}

		const res = await getFlowDetail(id);
		const data = res.data as FlowData;
		currentFlow.value = data;
		resetFormState();
		selectUserNodeId.value = data.selectUserNodeId || [];

		if (data.formConfig) {
			const parsedConfig = parseFormConfig(data.formConfig);
			formOption.value = parsedConfig.formOption || {};
			const component = createDynamicFormComponent(data.formConfig);
			if (component) {
				component.props = {
					...component.props,
					readonly: false,
					flowHelper,
				};
				dynamicFormComponent.value = component;
				return data;
			}
		}

		setupDynamicFormForStart(data.formItems, data.formPerms || {});
		return data;
	}

	const { isLoading: loading, execute: executeLoadFlow } = useAsyncState(loadFlowData, undefined as FlowData | undefined, {
		immediate: false,
		resetOnExecute: false,
		onError: (error: any) => {
			pageError.value = error?.msg || error?.message || '流程详情加载失败';
		},
	});

	function loadFlow() {
		return executeLoadFlow();
	}

	async function submitProcess() {
		if (!currentFlow.value?.flowId) {
			ElMessage.warning('缺少流程标识');
			return;
		}

		if (!flowNodeFormatRef.value?.validate?.()) {
			ElMessage.warning('请选择节点执行人');
			return;
		}

		const paramMap: Record<string, any> = flowNodeFormatRef.value.formatSelectNodeUser();
		if (dynamicFormComponent.value) Object.assign(paramMap, businessFormData.value);
		else Object.assign(paramMap, formData.value);

		const doSubmit = async () => {
			submitLoading.value = true;
			try {
				await startFlow({ flowId: currentFlow.value?.flowId, paramMap });
			} catch (error: any) {
				ElMessage.error(error?.msg || error?.message || '提交失败');
				return;
			} finally {
				submitLoading.value = false;
			}
			await options.onSubmitted('提交成功');
		};

		if (fApi.value) {
			try {
				await fApi.value.submit();
			} catch {
				// form-create 校验失败时 reject，UI 已展示行内错误，不继续提交
				return;
			}
			await doSubmit();
			return;
		}

		await doSubmit();
	}

	return {
		loading,
		submitLoading,
		pageError,
		currentFlow,
		fApi,
		formData,
		formOption,
		rule,
		dynamicFormComponent,
		selectUserNodeId,
		flowNodeFormatRef,
		handleBusinessFormChange,
		loadFlow,
		submitProcess,
	};
}
