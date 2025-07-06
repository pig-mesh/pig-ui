<template>
  <!-- 消息内容 -->
  <el-drawer v-model="visible" size="50%" direction="rtl" :with-header="false" class="news-content-drawer">
    <div class="min-h-full p-6 news-content-wrapper">
      <div class="max-w-4xl mx-auto">
        <!-- 头部区域 -->
        <div class="news-header rounded-t-xl shadow-sm p-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="w-3 h-3 bg-blue-500 rounded-full indicator-dot"></div>
              <span class="text-sm font-medium news-tag px-3 py-1 rounded-full">公告通知</span>
            </div>
            <el-button 
              type="text" 
              @click="visible = false" 
              class="close-button transition-colors"
            >
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          
          <h1 class="text-2xl font-bold leading-tight mb-4 news-title">
            {{ currentNew.title }}
          </h1>
          
          <div class="flex items-center justify-between text-sm news-meta">
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2">
                <el-icon class="meta-icon"><User /></el-icon>
                <span>{{ currentNew.createBy }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <el-icon class="meta-icon"><Clock /></el-icon>
                <span>{{ currentNew.createTime }}</span>
              </div>
            </div>
            <div v-if="currentNew.readFlag === '0'" class="flex items-center space-x-1 unread-badge">
              <el-icon><Warning /></el-icon>
              <span class="text-xs">未读</span>
            </div>
          </div>
        </div>
        
        <!-- 内容区域 -->
        <div class="news-body rounded-b-xl shadow-sm p-8">
          <div class="prose prose-lg max-w-none">
            <div 
              class="leading-relaxed news-content"
              v-html="currentNew.content"
              style="line-height: 1.8; font-size: 16px;"
            ></div>
          </div>
          
          <!-- 底部分割线 -->
          <div class="mt-8 pt-6 news-footer">
            <div class="flex items-center justify-center text-xs footer-text">
              <el-icon class="mr-1"><Document /></el-icon>
              <span>感谢您的阅读</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="newsLetter">
import {readUserMessage} from "/@/api/admin/message";
import { Close, User, Clock, Warning, Document } from '@element-plus/icons-vue';

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