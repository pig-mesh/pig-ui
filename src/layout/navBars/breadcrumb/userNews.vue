<template>
  <div class="layout-navbars-breadcrumb-user-news">
    <div class="head-box">
      <div class="head-box-title">{{ $t('user.newTitle') }}</div>
      <div class="head-box-btn" @click="listRef.openDialog('1')">{{ $t('user.newBtn') }}</div>
    </div>
    <div class="content-box">
      <template v-if="newsList.length > 0">
        <div class="relative">
          <div class="content-box-item" v-for="(v, k) in newsList" :key="k" @click="contentRef.openDialog(v)">
            <button
                class="py-1 px-3 -left-8 -top-2 border bg-primary text-white font-bold">
              {{parseDate(v.createTime)}}
            </button>
            <div class="purple_border p-2 border border-gray-400">
              {{ v.title }}
            </div>
          </div>
        </div>
      </template>
      <el-empty :description="$t('user.newDesc')" v-else></el-empty>
    </div>

    <!-- 消息列表 -->
    <news-lists ref="listRef"/>

    <!-- 消息内容 -->
    <news-content ref="contentRef" @refresh="getUserMessage"/>
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUserNews">
import {fetchUserMessageList} from "/@/api/admin/message";

const NewsContent = defineAsyncComponent(() => import('/@/views/home/news/content.vue'));
const NewsLists = defineAsyncComponent(() => import('/@/views/home/news/list.vue'));

const newsList = ref([])
const listRef = ref()
const contentRef = ref()

// 获取用户的信息
const getUserMessage = () => {
  // 取前五条数据
  return fetchUserMessageList({current: 1, size: 5, category: '1', readFlag: '0'}).then(res => {
    newsList.value = res.data.records;
  })
}

onMounted(() => {
  getUserMessage()
})
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
  .head-box {
    display: flex;
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-sizing: border-box;
    color: var(--el-text-color-primary);
    justify-content: space-between;
    height: 35px;
    align-items: center;

    .head-box-btn {
      color: var(--el-color-primary);
      font-size: 13px;
      cursor: pointer;
      opacity: 0.8;

      &:hover {
        opacity: 1;
      }
    }
  }

  .content-box {
    font-size: 13px;

    .content-box-item {
      padding-top: 12px;

      &:last-of-type {
        padding-bottom: 12px;
      }

      .content-box-msg {
        color: var(--el-text-color-secondary);
        margin-top: 5px;
        margin-bottom: 5px;
      }

      .content-box-time {
        color: var(--el-text-color-secondary);
      }
    }
  }

  .foot-box {
    height: 35px;
    color: var(--el-color-primary);
    font-size: 13px;
    cursor: pointer;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-lighter);

    &:hover {
      opacity: 1;
    }
  }

  :deep(.el-empty__description p) {
    font-size: 13px;
  }
}
</style>
