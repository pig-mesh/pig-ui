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
      <el-table-column :label="t('common.action')" width="90">
        <template #default="scope">
          <el-button type="danger" link :disabled="deleting || state.loading" @click.stop="removeMessage(scope.row.id)">{{ t('user.newDelete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>

    <news-content ref="contentRef" @refresh="refreshMessages"/>
  </el-drawer>
</template>

<script setup lang="ts" name="newsList">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchUserMessageList, deleteUserMessage } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';
import { ElMessageBox } from 'element-plus';
import { useMessage } from '/@/hooks/message';

const emit = defineEmits(['refresh']);

import NewsContent from './content.vue';

const { t } = useI18n();
const contentRef = ref();
const visible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: { category: '0' },
	pageList: fetchUserMessageList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle } = useTable(state);


const deleting = ref(false);
const removeMessage = async (id: string | number) => {
	if (deleting.value) return;
	deleting.value = true;
	try {
		await ElMessageBox.confirm(t('user.newDeleteConfirm'), t('user.newDeleteTitle'), {
			type: 'warning',
			modalClass: 'user-message-delete-confirm',
		});
		await deleteUserMessage(id);
		if (state.dataList?.length === 1 && state.pagination!.current! > 1) state.pagination!.current!--;
		getDataList(false);
		emit('refresh');
		useMessage().success(t('user.newDeleteSuccess'));
	} catch (error) {
		if (error !== 'cancel' && error !== 'close') useMessage().error(t('user.newDeleteFailed'));
	} finally {
		deleting.value = false;
	}
};

const openDialog = (type: string): void => {
	state.queryForm.category = type;
	getDataList();
	visible.value = true;
};

const refreshMessages = () => {
	getDataList(false);
	emit('refresh');
};

const cellClick = (row: any): void => {
	contentRef.value.openDialog(row);
};

defineExpose({
	openDialog,
});
</script>
