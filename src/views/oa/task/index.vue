<template>
	<div class="layout-padding">
		<el-card class="layout-padding-auto">
			<el-row v-show="showSearch" class="mb8">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('task.taskName')" prop="taskName">
						<el-input :placeholder="t('task.inputTaskNameTip')" v-model="state.queryForm.taskName" style="max-width: 180px" />
					</el-form-item>
					<el-form-item class="ml2">
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" formDialogRef @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button formDialogRef icon="Download" type="primary" class="ml10" @click="exportExcel">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button formDialogRef :disabled="multiple" icon="Delete" type="primary" class="ml10" @click="handleDelete(selectObjs)">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
			>
				<el-table-column type="selection" width="60" align="center" />
				<el-table-column type="index" :label="t('task.index')" width="80" />
				<el-table-column prop="taskId" :label="t('task.taskId')" show-overflow-tooltip />
				<el-table-column prop="taskName" :label="t('task.taskName')" show-overflow-tooltip />
				<el-table-column prop="time" :label="t('task.time')" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="200">
					<template #default="scope">
						<el-button text type="primary" @click="handleView(scope.row)">流程图 </el-button>
						<el-button text type="primary" @click="formDialogRef.openDialog(scope.row.taskId)">审批 </el-button>
						<el-button text type="primary" @click="commentDialogRef.openDialog(scope.row.taskId)">批注 </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</el-card>

		<!-- 编辑、新增  -->
		<form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
		<comment-dialog ref="commentDialogRef" @refresh="getDataList(false)" />

		<el-dialog v-model="showPicDialog" title="流程图">
			<img :src="actPicUrl" style="width: 100%" />
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemTask">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList } from '/@/api/oa/task';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const CommentDialog = defineAsyncComponent(() => import('./comment.vue'));
const { t } = useI18n();
// 定义查询字典
const formDialogRef = ref();
const commentDialogRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);
// 流程图URL
const actPicUrl = ref('');
// 定义变量内容
const showPicDialog = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/task/export', state.queryForm, 'task.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	objs.forEach((val: any) => {
		selectObjs.value.push(val.leaveId);
	});
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = (ids: string[]) => {};

//查看流程图
const handleView = (row: any) => {
	actPicUrl.value = `/admin/task/view/${row.taskId}`;
	showPicDialog.value = true;
};
</script>
