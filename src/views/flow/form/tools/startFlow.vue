<template>
	<div>
		<el-drawer v-model="drawerVisible" title="发起流程" size="50%" direction="rtl" destroy-on-close @closed="handleDrawerClosed">
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
									@update:modelValue="handleBusinessFormChange"
								/>
							</div>
						</el-form>
					</el-col>
					<el-col :span="8">
						<flow-node-format :selectUserNodeId="selectUserNodeId" :flow-id="currentOpenFlow?.flowId" ref="flowNodeFormatRef"></flow-node-format>
					</el-col>
				</el-row>
			</template>
			<template #footer v-if="!dynamicFormComponent">
				<div class="flex justify-center">
					<el-button @click="drawerVisible = false">取消</el-button>
					<el-button type="primary" @click="submitProcess">提交</el-button>
				</div>
			</template>
		</el-drawer>
	</div>
</template>
<script setup lang="ts">
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';
import { getFlowDetail, startFlow } from '/@/api/flow/flow';
import { ElMessage } from 'element-plus';
import FcDesigner from 'form-create-designer';
import { Api, Rule } from '@form-create/element-ui';
import FormCreate from '/@/views/flow/workflow/components/FormCreate.vue';
import { processFormItemsWithPerms } from '/@/views/flow/workflow/utils/formPermissions';
import { createDynamicFormComponent, type DynamicFormComponent } from '/@/views/flow/workflow/utils/dynamicComponent';

// 定义接口
interface FlowData {
	flowId: string;
	[key: string]: any;
}

interface FormDataType {
	[key: string]: any;
}

// Api 类型
const fApi = ref<Api>();
const formData = ref<FormDataType>({});
const option = ref<any>({});

// 类型是 Rule Array
const rule = ref<any>([]);
const dynamicFormComponent = shallowRef<DynamicFormComponent | null>(null); // 动态表单组件
const businessFormData = ref<Record<string, any>>({}); // 业务表单数据

const drawerVisible = ref<Boolean>(false);
const currentOpenFlow = ref<FlowData | undefined>();

// 处理业务表单数据变化
const handleBusinessFormChange = (data: any) => {
	businessFormData.value = data;
};

// 校验审批人选择完整性
const validateFlowNode = () => {
	if (flowNodeFormatRef.value) {
		flowNodeValidateResult.value = flowNodeFormatRef.value.validate();
		return flowNodeValidateResult.value;
	}
	return false;
};

// 审批人工具方法（提供给子组件使用）
// 使用 markRaw 避免 Vue 进行响应式追踪
const flowHelper = markRaw({
	// 校验审批人
	validate: () => {
		if (!flowNodeFormatRef.value) return true; // 没有审批人组件时直接通过
		const isValid = flowNodeFormatRef.value.validate();
		if (!isValid) {
			ElMessage.warning('请选择节点执行人');
		}
		return isValid;
	},

	// 获取流程数据（包含审批人信息，包装在 flowParamMap 中）
	getFlowData: () => {
		if (!flowNodeFormatRef.value) return {};
		const approverData = flowNodeFormatRef.value.formatSelectNodeUser();
		return {
			flowParamMap: { ...approverData }
		};
	},

	// 获取审批人原始数据
	getRawApproverData: () => {
		if (!flowNodeFormatRef.value) return {};
		return flowNodeFormatRef.value.formatSelectNodeUser();
	}
});

const submitProcess = () => {
	let validate = flowNodeFormatRef.value.validate();
	if (!validate) {
		ElMessage.warning('请选择节点执行人');
		return;
	}

	let param: Record<string, any> = flowNodeFormatRef.value.formatSelectNodeUser();

	// 根据表单类型处理数据
	if (dynamicFormComponent.value) {
		// 使用业务表单数据
		Object.assign(param, businessFormData.value);
	} else {
		// 将动态表单数据 push 到 param 里面
		for (const key in formData.value) {
			param[key] = formData.value[key];
		}
	}

	const data = {
		flowId: currentOpenFlow.value?.flowId || '',
		paramMap: param,
	};

	// 动态表单需要验证
	if (fApi.value) {
		fApi.value.submit().then(() => {
			startFlow(data).then(() => {
				ElMessage.success('提交成功');
				drawerVisible.value = false;
			});
		});
	}
};

const handle = (row: FlowData) => {
	currentOpenFlow.value = row;
	startProcess(row);
};

defineExpose({ handle });

const selectUserNodeId = ref<String[]>([]);

const startProcess = (f: FlowData) => {
	getFlowDetail(f.flowId).then((res) => {
		const { data } = res;
		const { formItems, formPerms = {}, formConfig } = data;

		// 重置动态表单组件
		dynamicFormComponent.value = null;
		businessFormData.value = {};

		// 检查是否有formConfig，判断表单类型
		if (formConfig) {
			option.value = JSON.parse(formConfig).formOption || {};
			const dynamicComponent = createDynamicFormComponent(formConfig);
			if (dynamicComponent) {
				// 使用自定义业务表单
				// 修改props，去掉readonly属性（发起流程时是可编辑的）
				dynamicComponent.props = {
					...dynamicComponent.props,
					readonly: false,
					flowHelper: flowHelper
				};
				dynamicFormComponent.value = dynamicComponent;
			} else {
				// 使用动态表单
				setupDynamicFormForStart(formItems, formPerms);
			}
		} else {
			// 兼容旧版本，使用动态表单
			setupDynamicFormForStart(formItems, formPerms);
		}

		selectUserNodeId.value = data.selectUserNodeId;
		drawerVisible.value = true;
	});
};

// 设置动态表单的辅助函数（用于发起流程）
const setupDynamicFormForStart = (formItems: any, formPerms: any) => {
	// 解析表单项
	const parsedFormItems = FcDesigner.formCreate.parseJson(formItems);
	// 处理表单权限
	const itemsWithPerms = processFormItemsWithPerms(parsedFormItems, formPerms);

	rule.value = itemsWithPerms;
};

const flowNodeFormatRef = ref();
const flowNodeValidateResult = ref(false); // 审批人校验结果

// 监听审批人选择变化，实时更新校验结果
watch(
	() => flowNodeFormatRef.value?.nodeUser,
	() => {
		validateFlowNode();
	},
	{ deep: true }
);

const handleDrawerClosed = () => {
	formData.value = {};
	businessFormData.value = {};
	dynamicFormComponent.value = null;
	if (fApi.value) {
		fApi.value.resetFields();
	}
	// Reset other related data
	currentOpenFlow.value = undefined;
};
</script>
