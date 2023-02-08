<template>
    <el-dialog title="上传文件" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-upload
          class="upload-demo"
          drag
          action="/admin/sys-file/upload"
          :headers="headers"
          multiple
          @success="success"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          拖拽到这个位置或者<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            上传同步至文件服务器
          </div>
        </template>
      </el-upload>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
        </span>
      </template>
    </el-dialog>
</template>

<script setup lang="ts" name="SysFileDialog">
// 定义子组件向父组件传值/事件
import {Session} from "/@/utils/storage";

const emit = defineEmits(['refresh']);

const headers = reactive({
  Authorization: ''
})

// 定义变量内容
const visible = ref(false)
// 定义字典


// 打开弹窗
const openDialog = () => {
  visible.value = true
  // 获取 token 进行拼接
  if (Session.get('token')) {
    headers.Authorization = `Bearer ${Session.get('token')}`;
  }
};

const success = () => {
  emit('refresh')
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
