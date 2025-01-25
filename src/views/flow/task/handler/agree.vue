<script setup lang="ts">
import { ref } from 'vue'
import { completeTask } from '/@/api/flow/task'
import type { FlowFormItem, TaskData, TaskSubmitParam } from './types'

const dialogVisible = ref(false)
const submitDesc = ref('')
const currentData = ref<TaskData>()
const currentOpenFlowForm = ref<FlowFormItem[]>()

const handle = (row: TaskData, formData: FlowFormItem[]) => {
  submitDesc.value = ''
  currentData.value = row
  currentOpenFlowForm.value = formData
  dialogVisible.value = true
}

defineExpose({ handle })
const emit = defineEmits<{
  (e: 'taskSubmitEvent'): void
}>()

const submit = async () => {
  if (!currentData.value || !currentOpenFlowForm.value) return

  const formData: Record<string, any> = {}
  formData[`${currentData.value.nodeId}_approve_condition`] = true

  const param: TaskSubmitParam = {
    paramMap: formData,
    taskId: currentData.value.taskId,
    taskLocalParamMap: {
      approveDesc: submitDesc.value,
    },
  }

  try {
    await completeTask(param)
    dialogVisible.value = false
    emit('taskSubmitEvent')
  } catch (error) {
    console.error('Failed to complete task:', error)
  }
}
</script>

<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="提交审核"
      :width="400"
      class="rounded-lg shadow-xl"
    >
      <div class="p-4 space-y-4">
        <el-input
          v-model="submitDesc"
          type="textarea"
          maxlength="100"
          :rows="5"
          placeholder="请输入审核意见..."
          show-word-limit
          class="w-full transition-all duration-300 focus:ring-2 focus:ring-primary"
        />

        <div class="flex justify-end pt-4 space-x-3">
          <el-button
            @click="dialogVisible = false"
            class="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            取消
          </el-button>
          <el-button
            type="primary"
            @click="submit"
            class="bg-primary hover:bg-primary-focus"
          >
            确定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
