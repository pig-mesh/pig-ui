<template>
  <el-card class="h-full">
    <template #header>
      <div class="card-header">
        <span>{{ $t('home.newsletterTip') }}</span>
        <el-button link class="button" text @click="openList">{{ $t('home.moreTip') }}</el-button>
      </div>
    </template>
    <el-timeline v-if="newsList.length > 0">
      <el-timeline-item v-for="(item, index) in newsList" :key="index" :timestamp="item.createTime"
                        @click="contentRef.openDialog(item)">
        {{ item.title }}
        <el-tag>{{ item.readFlag === '1' ? $t('msg.readed') : $t('msg.unread') }}</el-tag>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else/>
  </el-card>

  <!-- 消息列表 -->
  <news-lists ref="listRef" v-if="showList"/>

  <!-- 消息内容 -->
  <news-content ref="contentRef" @refresh="getUserMessage"/>
</template>

<script setup lang="ts" name="newsLetter">
import {fetchUserMessageList} from "/@/api/admin/message";

const NewsContent = defineAsyncComponent(() => import('./content.vue'));
const NewsLists = defineAsyncComponent(() => import('./list.vue'));

const listRef = ref()
const contentRef = ref()
const visible = ref(false)
const showList = ref(false)
const newsList = ref([])


// 获取用户的信息
const getUserMessage = () => {
  // 取前五条数据
  return fetchUserMessageList({current: 1, size: 5, category: '0'}).then(res => {
    newsList.value = res.data.records;
  })
}

const openList = () =>{
  showList.value = true
  listRef.value.openDialog('0')
}

onMounted(() => {
  getUserMessage()
})
</script>
<style scoped lang="scss">
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
