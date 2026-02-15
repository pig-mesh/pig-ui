<template>
  <el-drawer v-model="visible" size="40%">
    <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" @sort-change="sortChangeHandle"
              @cell-click="cellClick">
      <el-table-column type="index" :label="t('home.index')" width="60"/>
      <el-table-column prop="title" :label="t('home.newsTitle')" show-overflow-tooltip/>
      <el-table-column prop="readFlag" :label="t('home.newsStatus')" show-overflow-tooltip>
        <template #default="scope">
          <el-tag>{{ scope.row.readFlag === '1' ? $t('msg.readed') : $t('msg.unread') }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" :label="t('home.newsTime')"/>
    </el-table>
    <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>

    <news-content ref="contentRef" @refresh="getDataList"/>
  </el-drawer>
</template>

<script setup lang="ts" name="newsList">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchUserMessageList } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';

import NewsContent from './content.vue';

const { t } = useI18n();
const contentRef = ref();
const visible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { category: '0' },
	pageList: fetchUserMessageList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle } = useTable(state);

const openDialog = (type: string): void => {
	state.queryForm.category = type;
	getDataList();
	visible.value = true;
};

const cellClick = (row: any): void => {
	contentRef.value.openDialog(row);
};

defineExpose({
	openDialog,
});
</script>
