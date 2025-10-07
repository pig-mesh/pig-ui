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

    <!-- 消息内容 -->
    <news-content ref="contentRef" @refresh="getDataList"/>
  </el-drawer>
</template>

<script setup lang="ts" name="newsList">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchUserMessageList } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';

const NewsContent = defineAsyncComponent(() => import('./content.vue'));

/**
 * 国际化工具
 */
const { t } = useI18n();

/**
 * 消息内容对话框引用
 */
const contentRef = ref();

/**
 * 抽屉显示状态
 */
const visible = ref(false);

/**
 * 表格状态配置
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { category: '0' },
	pageList: fetchUserMessageList,
});

/**
 * 表格相关钩子函数
 */
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle } = useTable(state);

/**
 * 打开消息列表抽屉
 * @param type - 消息类型
 */
const openDialog = (type: string): void => {
	state.queryForm.category = type;
	getDataList();
	visible.value = true;
};

/**
 * 点击表格单元格事件处理
 * @param row - 点击的行数据
 */
const cellClick = (row: any): void => {
	contentRef.value.openDialog(row);
};

/**
 * 暴露方法供父组件调用
 */
defineExpose({
	openDialog,
});
</script>
