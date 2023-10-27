<template>
  <!-- 消息内容 -->
  <el-drawer v-model="visible" size="40%">
    <div class="flex items-center justify-center -mt-8">
      <div class="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 class="text-2xl font-semibold text-center text-gray-500 mb-6">{{ currentNew.title }}</h1>
        <div class="text-center">
          <p class="text-xs text-gray-600 text-center mt-8">&copy; {{ currentNew.createBy }}  {{ currentNew.createTime }}</p>
        </div>
        <p class="text-sm text-gray-600 text-justify mt-8 mb-6" v-html="currentNew.content"></p>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="newsLetter">
import {readUserMessage} from "/@/api/admin/message";

const emit = defineEmits(['refresh']);

const currentNew = ref()
const visible = ref(false)

// 打开信息内容
const openDialog = (item: any) => {
  visible.value = true
  currentNew.value = item;
  readMessage(item)
}

// 阅读事件
const readMessage = async (item: any) => {
  if (item.readFlag === '1') {
    return
  }
  await readUserMessage({id: item.id})
  emit('refresh')
}

defineExpose({
  openDialog
})
</script>
