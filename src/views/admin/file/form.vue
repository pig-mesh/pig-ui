<template>
  <el-dialog title="上传文件" v-model="visible" :close-on-click-modal="false" draggable>
    <upload @change="success" />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SysFileDialog">
const Upload = defineAsyncComponent(() => import('/@/components/Upload/index.vue'))

const emit = defineEmits(['refresh']);

// 定义变量内容
const visible = ref(false)

// 打开弹窗
const openDialog = () => {
  visible.value = true
};

const success = () => {
  emit('refresh')
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
