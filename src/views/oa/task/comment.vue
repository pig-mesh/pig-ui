<template>
	<div class="layout-padding">
		<el-dialog title="批注列表" v-model="visible" :close-on-click-modal="false" draggable>
			<el-card class="layout-padding-auto">
				<el-table
					:data="state.dataList"
					v-loading="state.loading"
					style="width: 100%"
					@selection-change="handleSelectionChange"
					@sort-change="sortChangeHandle"
				>
					<el-table-column type="selection" width="60" align="center" />
					<el-table-column type="index" :label="t('comment.index')" width="80" />
					<el-table-column prop="userId" :label="t('comment.userId')" show-overflow-tooltip />
					<el-table-column prop="fullMessage" :label="t('comment.fullMessage')" show-overflow-tooltip>
						<template #default="scope">
							<span v-html="scope.row.fullMessage"></span>
						</template>
					</el-table-column>
					<el-table-column prop="time" :label="t('comment.time')" show-overflow-tooltip />
				</el-table>
			</el-card>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemTask">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchComment } from '/@/api/oa/task';
import { useI18n } from 'vue-i18n';

// 引入组件
const { t } = useI18n();
// 搜索变量
const visible = ref(false);
const taskId = ref('');
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 定义查询方法
const pageList = () => {
	return fetchComment(taskId.value);
};

const state: BasicTableProps = reactive<BasicTableProps>({
	isPage: false,
	queryForm: {},
	createdIsNeed: false,
	pageList: pageList,
});

//  table hook
const { getDataList, sortChangeHandle } = useTable(state);

// 多选事件
const handleSelectionChange = (objs: any) => {
	objs.forEach((val: any) => {
		selectObjs.value.push(val.leaveId);
	});
	multiple.value = !objs.length;
};

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	taskId.value = id;
	getDataList();
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
