<template>
	<el-drawer title="设计历史" v-model="visible" draggable>
		<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" @sort-change="sortChangeHandle">
			<el-table-column type="index" label="序号" width="60" />
			<el-table-column prop="createTime" label="设计时间" show-overflow-tooltip />
			<el-table-column label="操作" width="100">
				<template #default="scope">
					<el-button text type="primary" @click="handleRollback(scope.row.id)">回滚</el-button>
					<el-button text type="primary" @click="handleDelete(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
	</el-drawer>
</template>

<script setup lang="ts" name="systemFormHistoryDialog">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delFormObj, fetchFormList } from '/@/api/gen/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
const emit = defineEmits(['refresh']);
// 搜索变量
const visible = ref(false);
//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchFormList,
	createdIsNeed: false,
	descs: ['create_time'],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle } = useTable(state);

// 删除操作
const handleDelete = (id: string) => {
	useMessageBox()
		.confirm('此操作将永久删除')
		.then(() => {
			delFormObj(id)
				.then(() => {
					getDataList(false);
					useMessage().success('删除成功');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};

// 回滚
const handleRollback = (id: string) => {
	emit('refresh', id);
};

// 打开弹窗
const openDialog = (dsName: string, tableName: string) => {
	visible.value = true;
	state.queryForm.dsName = dsName;
	state.queryForm.tableName = tableName;
	getDataList();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
