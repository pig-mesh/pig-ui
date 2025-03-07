<template>
	<div>
		<el-dialog v-model="dialogTableVisible" title="发起流程" width="800px" destroy-on-close @closed="handleDialogClosed">
			<el-row>
				<el-col :span="12">
					<el-form label-position="top">
						<FormCreate :rule="rule" v-model="formData" v-model:api="fApi" />
					</el-form>

					<div class="flex justify-center mt-4">
						<el-button @click="dialogTableVisible = false">取消</el-button>
						<el-button type="primary" @click="submitProcess"> 提交</el-button>
					</div>
				</el-col>
				<el-col :span="12">
					<flow-node-format :selectUserNodeId="selectUserNodeId" :flow-id="currentOpenFlow.flowId" ref="flowNodeFormatRef"></flow-node-format>
				</el-col>
			</el-row>
		</el-dialog>
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

// 类型是 Rule Array
const rule = ref<Rule>([]);

const dialogTableVisible = ref<Boolean>(false);
const currentOpenFlow = ref<FlowData>();

const submitProcess = () => {
	let validate = flowNodeFormatRef.value.validate();
	if (!validate) {
		ElMessage.warning('请选择节点执行人');
		return;
	}

	let param: Record<string, any> = flowNodeFormatRef.value.formatSelectNodeUser();

	// 将 formData 这个map 的所有值 push 到 param 里面
	for (const key in formData.value) {
		param[key] = formData.value[key];
	}

	const data = {
		flowId: currentOpenFlow.value?.flowId,
		paramMap: param,
	};

	if (fApi.value) {
		fApi.value.submit().then(() => {
			startFlow(data).then(() => {
				ElMessage.success('提交成功');
				dialogTableVisible.value = false;
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
		const { formItems, formPerms = {} } = data;

		// 解析表单项
		const parsedFormItems = FcDesigner.formCreate.parseJson(formItems);
		// 处理表单权限
		const itemsWithPerms = processFormItemsWithPerms(parsedFormItems, formPerms);

		rule.value = itemsWithPerms;
		selectUserNodeId.value = data.selectUserNodeId;
		dialogTableVisible.value = true;
	});
};

const flowNodeFormatRef = ref();

const handleDialogClosed = () => {
	formData.value = {};
	if (fApi.value) {
		fApi.value.resetFields();
	}
	// Reset other related data
	currentOpenFlow.value = undefined;
};
</script>
