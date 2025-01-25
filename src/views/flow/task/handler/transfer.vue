<script setup lang="ts">
import { defineExpose, ref } from 'vue';
import { transferTask } from '/@/api/flow/task';
import selectShow from '/@/components/OrgSelector/index.vue';
import { ElMessage } from 'element-plus';

interface FlowFormItem {
	id: string;
	type: string;
	props: {
		value: any;
		label?: string;
	};
}

interface TaskData {
	taskId: string;
	nodeId: string;
}

const dialogVisible = ref(false);
const submitDesc = ref('');
const userList = ref<Array<{ id: string }>>([]);
const currentData = ref<TaskData>();
const currentOpenFlowForm = ref<FlowFormItem[]>();

const handle = (row: TaskData, formData: FlowFormItem[]) => {
	submitDesc.value = '';
	currentData.value = row;
	currentOpenFlowForm.value = formData;
	dialogVisible.value = true;
};

defineExpose({ handle });
const emit = defineEmits(['taskSubmitEvent']);

const validateForm = (): boolean => {
	if (userList.value.length === 0) {
		ElMessage.warning('请选择转办人员');
		return false;
	}

	if (!submitDesc.value.trim()) {
		ElMessage.warning('请输入审核意见');
		return false;
	}

	if (submitDesc.value.trim().length < 2) {
		ElMessage.warning('审核意见至少需要2个字符');
		return false;
	}

	return true;
};

const submit = async () => {
	if (!currentOpenFlowForm.value || !currentData.value) return;

	// 表单校验
	if (!validateForm()) return;

	try {
		const formData: Record<string, any> = {};

		formData[`${currentData.value.nodeId}_approve_condition`] = true;

		const param = {
			paramMap: formData,
			taskId: currentData.value.taskId,
			targetUserIdList: userList.value.map((user) => user.id),
			taskLocalParamMap: {
				approveDesc: '转办事由：' + submitDesc.value.trim(),
			},
		};

		await transferTask(param);
		ElMessage.success('转办成功');
		dialogVisible.value = false;
		emit('taskSubmitEvent');
	} catch (error) {
		ElMessage.error('转办失败，请重试');
	}
};
</script>

<template>
	<div>
		<el-dialog v-model="dialogVisible" width="400px" :close-on-click-modal="false" :close-on-press-escape="false" class="transfer-dialog">
			<div class="space-y-4">
				<div class="w-full">
					<label class="block pb-2">
						<span class="text-base font-medium after:content-['*'] after:text-red-500 after:ml-1"> 选择转办人员 </span>
					</label>
					<select-show v-model:orgList="userList" type="user" :multiple="true"></select-show>
				</div>

				<div class="w-full">
					<label class="block pb-2">
						<span class="text-base font-medium after:content-['*'] after:text-red-500 after:ml-1"> 审核意见 </span>
					</label>
					<el-input v-model="submitDesc" type="textarea" maxlength="100" :rows="5" placeholder="请输入审核意见（2-100字）" show-word-limit />
				</div>
			</div>

			<template #footer>
				<span class="flex justify-end gap-2">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="submit">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
