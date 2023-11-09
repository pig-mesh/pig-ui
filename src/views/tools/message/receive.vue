<template>
  <el-drawer v-model="visible" size="40%">
    <el-row>
      <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
        <el-form-item label="姓名" prop="name">
          <el-input placeholder="请输入姓名" v-model="state.queryForm.name"/>
        </el-form-item>
        <el-form-item>
          <el-button icon="search" type="primary" @click="getDataList">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" @sort-change="sortChangeHandle">
      <el-table-column type="index" label="序号" width="60"/>
      <el-table-column prop="title" label="标题" show-overflow-tooltip/>
      <el-table-column prop="username" label="用户名" show-overflow-tooltip/>
      <el-table-column prop="name" label="姓名" show-overflow-tooltip/>
      <el-table-column prop="readFlag" label="状态" show-overflow-tooltip>
        <template #default="scope">
          <el-tag>{{ scope.row.readFlag === '1' ? $t('msg.readed') : $t('msg.unread') }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
  </el-drawer>
</template>

<script setup lang="ts" name="newsList">
import {BasicTableProps, useTable} from '/@/hooks/table';
import {fetchUserMessageReadList} from '/@/api/admin/message';

// 搜索变量
const contentRef = ref()
const visible = ref(false);
//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchUserMessageReadList,
});
const {getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle} = useTable(state);


// 打开弹窗
const openDialog = (msgId:string) => {
  visible.value = true
  state.queryForm.messageId = msgId
  getDataList();
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
