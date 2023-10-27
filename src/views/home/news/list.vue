<template>
  <el-drawer v-model="visible" size="40%">
    <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" @sort-change="sortChangeHandle"
              @cell-click="cellClick">
      <el-table-column type="index" label="序号" width="60"/>
      <el-table-column prop="title" label="标题" show-overflow-tooltip/>
      <el-table-column prop="readFlag" label="状态" show-overflow-tooltip>
        <template #default="scope">
          <el-tag>{{ scope.row.readFlag === '1' ? $t('msg.readed') : $t('msg.unread') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="时间"/>
    </el-table>
    <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>

    <!-- 消息内容 -->
    <news-content ref="contentRef" @refresh="getDataList"/>
  </el-drawer>
</template>

<script setup lang="ts" name="newsList">
import {BasicTableProps, useTable} from '/@/hooks/table';
import {fetchUserMessageList} from '/@/api/admin/message';

const NewsContent = defineAsyncComponent(() => import('./content.vue'));

// 搜索变量
const contentRef = ref()
const visible = ref(false);
//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {category: '0'},
  pageList: fetchUserMessageList,
});
const {getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle} = useTable(state);


// 打开弹窗
const openDialog = (type: string) => {
  state.queryForm.category = type
  getDataList();
  visible.value = true
};

const cellClick = (row: any) => {
  contentRef.value.openDialog(row)
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
