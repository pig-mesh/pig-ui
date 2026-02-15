<template>
	<el-dialog v-model="visible" :close-on-click-modal="false" fullscreen title="运行日志" draggable>
		<div class="layout-padding-auto layout-padding-view">
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						formDialogRef
						:disabled="multiple"
						icon="Delete"
						type="primary"
						class="ml10"
						v-auth="'sys_log_del'"
						@click="handleDelete(selectObjs)"
					>
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
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" :label="t('log.index')" width="80" />
				<el-table-column prop="jobName" :label="t('log.jobName')" show-overflow-tooltip />
				<el-table-column prop="jobMessage" :label="t('log.jobMessage')" show-overflow-tooltip />
				<el-table-column prop="jobLogStatus" :label="t('log.jobLogStatus')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="job_execute_status" :value="scope.row.jobLogStatus"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="executeTime" :label="t('log.executeTime')" show-overflow-tooltip />
				<el-table-column prop="exceptionInfo" :label="t('log.exceptionInfo')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="t('log.createTime')" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button text type="primary" v-auth="'pigx_log_edit'" @click="formDialogRef.openDialog(scope.row.jobLogId)"
							>{{ $t('common.editBtn') }}
						</el-button>
						<el-button text type="primary" v-auth="'sys_log_del'" @click="handleDelete([scope.row.jobLogId])">{{ $t('common.delBtn') }} </el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</el-dialog>
</template>

<script setup lang="ts" name="job-log">
/**
 * Job Log Component
 * 作业日志组件
 * Displays and manages job execution logs
 * 显示和管理作业执行日志
 */

import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/daemon/job-log';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';
import { useMessage, useMessageBox } from '/@/hooks/message';

// 获取国际化方法
const { t } = useI18n();
const visible = ref(false);

// 定义字典
const { job_execute_status } = useDict('job_type', 'job_execute_status');

// 搜索变量
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 表格状态变量
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		jobId: '',
	},
	pageList: fetchList,
	createdIsNeed: false,
});

// 获取表格数据方法
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

/**
 * Opens the job log dialog
 * 打开作业日志对话框
 * @param id - Job ID 作业ID
 */
const openDialog = async (id: string) => {
	visible.value = true;
	state.queryForm.jobId = id;
	await getDataList();
};

/**
 * Handles row selection change
 * 处理行选中事件
 * @param objs - Selected objects 选中的对象
 */
const handleSelectionChange = (objs: { jobLogId: string }[]) => {
	selectObjs.value = objs.map(({ jobLogId }) => jobLogId);
	multiple.value = !objs.length;
};

/**
 * Deletes selected job logs
 * 删除选中的作业日志
 * @param ids - Array of job log IDs 作业日志ID数组
 */
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObjs(ids);
		await getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

