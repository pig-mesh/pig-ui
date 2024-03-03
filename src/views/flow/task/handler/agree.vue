<script setup lang="ts">
import {defineExpose} from 'vue';
import {completeTask} from '/@/api/flow/task';

const dialogVisible = ref(false);

const submitDesc = ref('');

const currentData = ref();
const currentOpenFlowForm = ref();

const handle = (row, formData) => {
  submitDesc.value = '';
  currentData.value = row;
	currentOpenFlowForm.value = formData;
	dialogVisible.value = true;
};

defineExpose({ handle });
const emit = defineEmits(['taskSubmitEvent']);

const submit = () => {
	let value = currentOpenFlowForm.value;

  const formData = {};
  for (const item of value) {
		formData[item.id] = item.props.value;

		if (item.type === 'Layout') {
			let subList = item.props.value;

      const d = [];
      for (const array of subList) {
				var v = {};

				for (var subItem of array) {
          v[subItem.id] = subItem.props.value;
				}
				d.push(v);
			}
			formData[item.id] = d;
		}
	}

	formData[currentData.value.nodeId + '_approve_condition'] = true;

  const param = {
    paramMap: formData,
    taskId: currentData.value.taskId,
    taskLocalParamMap: {
      approveDesc: submitDesc.value,
    },
  };

  completeTask(param).then((res) => {
		dialogVisible.value = false;

		emit('taskSubmitEvent');
	});
};
</script>

<template>
	<div>
		<el-dialog v-model="dialogVisible" title="提交审核" width="400px">
			<el-input v-model="submitDesc" type="textarea" maxlength="100" :rows="5" placeholder="审核意见" show-word-limit />
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="dialogVisible = false">取消</el-button>
					<el-button type="primary" @click="submit"> 确定 </el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
