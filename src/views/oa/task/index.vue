<template>
	<div class="layout-padding">
		<el-card class="layout-padding-auto">
			<el-row v-show="showSearch">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('task.taskName')" prop="taskName">
						<el-input :placeholder="t('task.inputTaskNameTip')" v-model="state.queryForm.taskName" style="max-width: 180px" />
					</el-form-item>
					<el-form-item>
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" formDialogRef @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						plain
						v-auth="'oa_task_del'"
						formDialogRef
						:disabled="multiple"
						icon="Delete"
						type="primary"
						class="ml10"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'oa_task_add'"
						@exportExcel="exportExcel"
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
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="60" align="center" />
				<el-table-column type="index" :label="t('task.index')" width="80" />
				<el-table-column prop="taskId" :label="t('task.taskId')" show-overflow-tooltip />
				<el-table-column prop="taskName" :label="t('task.taskName')" show-overflow-tooltip />
				<el-table-column prop="time" :label="t('task.time')" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button icon="picture" text v-auth="'oa_task_del'" type="primary" @click="handleView(scope.row)">流程图 </el-button>
						<el-button icon="pointer" text v-auth="'oa_task_del'" type="primary" @click="formDialogRef.openDialog(scope.row.taskId)">审批 </el-button>
						<el-button icon="ChatLineSquare" text v-auth="'oa_task_del'" type="primary" @click="commentDialogRef.openDialog(scope.row.taskId)"
							>批注
						</el-button>
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
import { fetchList, delObj } from '/@/api/oa/task';
import { useI18n } from 'vue-i18n';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { Session } from '/@/utils/storage';

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
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

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
	downBlobFile('/act/task/export', state.queryForm, 'task.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	selectObjs.value.push(...objs.map((val: any) => val.taskId));
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//查看流程图
const handleView = (row: any) => {
	actPicUrl.value = `/admin/task/view/${row.taskId}?access_token=${Session.getToken()}&TENANT-ID=${Session.getTenant()}`;
	showPicDialog.value = true;
};
</script>
