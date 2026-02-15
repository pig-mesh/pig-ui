<template>
	<el-drawer v-model="visible" size="40%">
		<el-row>
			<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
				<el-form-item :label="t('internal.name')" prop="name">
					<el-input :placeholder="t('internal.inputNameTip')" v-model="state.queryForm.name" />
				</el-form-item>
				<el-form-item>
					<el-button icon="search" type="primary" @click="getDataList">
						{{ $t('common.queryBtn') }}
					</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" @sort-change="sortChangeHandle">
			<el-table-column type="index" label="#" width="60" />
			<el-table-column prop="title" :label="t('internal.title')" show-overflow-tooltip />
			<el-table-column prop="username" :label="t('internal.username')" show-overflow-tooltip />
			<el-table-column prop="name" :label="t('internal.name')" show-overflow-tooltip />
			<el-table-column prop="readFlag" :label="t('internal.status')" show-overflow-tooltip>
				<template #default="scope">
					<el-tag>{{ scope.row.readFlag === '1' ? t('internal.readed') : t('internal.unread') }}</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
	</el-drawer>
</template>

<script setup lang="ts" name="reviceDialog">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchUserMessageReadList } from '/@/api/admin/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const visible = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchUserMessageReadList,
});

const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle } = useTable(state);

const openDialog = (msgId: string): void => {
	visible.value = true;
	state.queryForm.messageId = msgId;
	getDataList();
};

defineExpose({
	openDialog,
});
</script>

