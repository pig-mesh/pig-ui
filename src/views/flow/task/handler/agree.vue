<script setup lang="ts">
import { ref } from 'vue'
import { completeTask } from '/@/api/flow/task'
import { useMessage } from '/@/hooks/message'
import type { FlowFormItem, TaskData, TaskSubmitParam } from './types'

const dialogVisible = ref(false)
const submitLoading = ref(false)
const submitDesc = ref('')
const currentData = ref<TaskData>()
const currentFormData = ref({});

const handle = (row: TaskData,formData: any) => {
  submitDesc.value = ''
  currentData.value = row
  currentFormData.value = formData
  dialogVisible.value = true
}

defineExpose({ handle })
const emit = defineEmits<{
  (e: 'taskSubmitEvent'): void
}>()

const submit = async () => {

  const formData: Record<string, any> = {}
  formData[`${currentData.value?.nodeId}_approve_condition`] = true

  const param: TaskSubmitParam = {
    paramMap: formData,
    formData: currentFormData.value!,
    taskId: currentData.value!.taskId,
    taskLocalParamMap: {
      approveDesc: submitDesc.value,
    },
  }

  submitLoading.value = true
  try {
    await completeTask(param)
    dialogVisible.value = false
    emit('taskSubmitEvent')
  } catch (error: any) {
    useMessage().error(error?.msg || '提交失败，请重试')
    dialogVisible.value = false
    emit('taskSubmitEvent')
  } finally {
    submitLoading.value = false
  }
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="提交审核"
    :width="400"
  >
    <div class="p-4 space-y-4">
      <el-input
        v-model="submitDesc"
        type="textarea"
        maxlength="100"
        :rows="5"
        placeholder="请输入审核意见..."
        show-word-limit
      />

      <div class="flex justify-end pt-4 space-x-3">
        <el-button
          @click="dialogVisible = false"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          :loading="submitLoading"
          @click="submit"
        >
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>
