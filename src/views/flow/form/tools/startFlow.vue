<template>
	<div>
		<el-dialog v-model="dialogTableVisible" title="发起流程" width="800px" destroy-on-close>
			<el-row>
				<el-col :span="12">
					<el-form label-position="top">
						<form-render
							@addLayoutOneItem="addLayoutOneItem"
							ref="formRenderRef"
							@deleteLayoutOneItem="deleteLayoutOneItem"
							:form-list="currentOpenFlowForm"
						></form-render>
					</el-form>

					<div class="flex justify-center mt-4">
						<el-button @click="dialogTableVisible = false">取消</el-button>
						<el-button type="primary" @click="submitProcess"> 提交 </el-button>
					</div>
				</el-col>
				<el-col :span="12">
					<flow-node-format
						:formData="formValue"
						:selectUserNodeId="selectUserNodeId"
						:flow-id="currentOpenFlow.flowId"
						ref="flowNodeFormatRef"
					></flow-node-format>
				</el-col>
			</el-row>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import FormRender from '/@/views/flow/form/render/FormRender.vue';
import FlowNodeFormat from '/@/views/flow/form/tools/FlowNodeFormatData.vue';
import { FormVO } from '/@/api/flow/form/types';
import { getFlowDetail, startFlow } from '/@/api/flow/flow';
import other from '/@/utils/other';
import { ElMessage } from 'element-plus';

const dialogTableVisible = ref<Boolean>(false);
const currentOpenFlowForm = ref<FormVO[]>([]);
const currentOpenFlow = ref<FormVO[]>([]);
const formRenderRef = ref();
const submitProcess = () => {
	let validate = flowNodeFormatRef.value.validate();
	if (!validate) {
		ElMessage.warning('请选择节点执行人');
		return;
	}

	let param = flowNodeFormatRef.value.formatSelectNodeUser();

	currentOpenFlowForm.value.forEach((res) => (param[res.id] = res.props.value));

	{
		for (var item of currentOpenFlowForm.value) {
			param[item.id] = item.props.value;
			if (item.type === 'Layout') {
				let subList = item.props.value;

				var d = [];
				for (var array of subList) {
					var v = {};

					for (var subItem of array) {
						let value = subItem.props.value;
						v[subItem.id] = value;
					}
					d.push(v);
				}
				param[item.id] = d;
			}
		}
	}

	var data = {
		flowId: currentOpenFlow.value.flowId,
		paramMap: param,
	};
	formRenderRef.value.validate(function (valid) {
		if (valid) {
			startFlow(data).then((res) => {
				ElMessage.success('提交成功');
				dialogTableVisible.value = false;
			});
		}
	});
};

const handle = (row) => {
	currentOpenFlow.value = row;

	startProcess(row);
};

defineExpose({ handle });

const selectUserNodeId = ref<String[]>([]);

const startProcess = (f) => {
	getFlowDetail(f.flowId).then((res) => {
		const { data } = res;

		const { formItems } = data;

		let formIteamJsonArray = JSON.parse(formItems);

		for (var fi of formIteamJsonArray) {
			if (fi.type === 'Layout') {
				var arr = [];
				let value = fi.props.value;
				arr.push(value);
				fi.props.value = arr;
				fi.props.oriForm = other.deepClone(value);
			}
		}

		currentOpenFlowForm.value = formIteamJsonArray;

		selectUserNodeId.value = data.selectUserNodeId;

		dialogTableVisible.value = true;
	});
};

const formValue = computed(() => {
	var obj = {};

	for (var item of currentOpenFlowForm.value) {
		obj[item.id] = item.props.value;
	}
	return obj;
});

//明细的添加一个
const addLayoutOneItem = (id) => {
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

const flowNodeFormatRef = ref();
</script>
