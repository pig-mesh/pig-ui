<template>
  <el-dialog
    v-model="visible"
    :title="textConfig.title"
    width="400px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
  >
    <div class="flex items-center gap-4 text-left">
      <div class="flex-shrink-0">
        <el-icon size="48" color="#E6A23C">
          <Warning />
        </el-icon>
      </div>
      <div class="flex-1">
        <p class="m-0 text-sm text-[var(--el-text-color-regular)] dark:text-[var(--next-text-color-regular)] leading-6">
          {{ textConfig.description }}
        </p>
        <div class="mt-3">
          <a 
            :href="textConfig.linkUrl" 
            target="_blank" 
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1 text-xs text-[var(--el-color-primary)] hover:text-[var(--el-color-primary-light-3)] transition-colors duration-200"
          >
            <el-icon size="14"><Link /></el-icon>
            {{ textConfig.linkText }}
          </a>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-between items-center gap-4">
        <el-checkbox v-model="dontShowAgain">
          {{ textConfig.dontShowAgain }}
        </el-checkbox>
        <el-button type="primary" @click="handleConfirm">
          {{ textConfig.confirmButton }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { Warning, Link } from '@element-plus/icons-vue'
import { useVModel, useLocalStorage } from '@vueuse/core'

interface Props {
  show?: boolean
}

interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm'): void
}

const props = withDefaults(defineProps<Props>(), {
  show: false
})

const emit = defineEmits<Emits>()

const textConfig = {
  title: '演示环境说明',
  description: '当前环境仅供演示，新增、编辑、删除等操作受限。如需完整功能体验，建议本地部署私有化版本。',
  linkUrl: 'https://docs.pig4cloud.com/ai#/test',
  linkText: '查看部署文档',
  dontShowAgain: '不再提醒',
  confirmButton: '我知道了'
}

const visible = useVModel(props, 'show', emit)
const dontShowAgain = useLocalStorage('demo-notice-dont-show', false)

// 初始化时检查是否需要隐藏
onMounted(() => {
  if (dontShowAgain.value) {
    visible.value = false
  }
})

const handleConfirm = () => {
  visible.value = false
  emit('confirm')
}
</script>

