<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row class="ml10" v-show="showSearch">
        <el-form :inline="true" :model="state.queryForm" ref="queryRef">
          <el-form-item :label="$t('job.jobName')" prop="jobName">
            <el-input :placeholder="$t('job.inputjobNameTip')" @keyup.enter="getDataList" clearable
                      v-model="state.queryForm.jobName"/>
          </el-form-item>
          <el-form-item :label="t('job.jobStatus')" prop="jobStatus">
            <el-select :placeholder="t('job.inputjobStatusTip')" v-model="state.queryForm.jobStatus">
              <el-option :key="index" :label="item.label" :value="item.value"
                         v-for="(item, index) in job_status"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="t('job.jobExecuteStatus')" prop="jobExecuteStatus">
            <el-select :placeholder="t('job.inputjobExecuteStatusTip')" v-model="state.queryForm.jobExecuteStatus">
              <el-option :key="index" :label="item.label" :value="item.value"
                         v-for="(item, index) in job_execute_status"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button @click="getDataList" icon="Search" type="primary">{{ $t('common.queryBtn') }}</el-button>
            <el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button v-auth="'job_sys_job_add'" @click="formDialogRef.openDialog()" class="ml10" icon="folder-add"
                     type="primary">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button plain v-auth="'job_sys_job_del'" :disabled="multiple" @click="handleDelete(undefined)" class="ml10"
                     icon="Delete" type="primary">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar
              :export="'job_sys_job_add'"
              @exportExcel="exportExcel"
              @queryTable="getDataList"
              class="ml10"
              style="float: right; margin-right: 20px"
              v-model:showSearch="showSearch"
          >
            <el-tooltip class="item" effect="dark" :content="$t('queryTree.view')" placement="top">
              <el-button circle icon="Grid" @click="tableViewRef = !tableViewRef"></el-button>
            </el-tooltip>
          </right-toolbar>
        </div>
      </el-row>

      <!-- 表格视图  -->
      <el-table
          v-if="tableViewRef"
          :data="state.dataList"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          row-key="jobId"
          v-loading="state.loading"
          border
          :cell-style="tableStyle.cellStyle"
          :header-cell-style="tableStyle.headerCellStyle"
      >
        <el-table-column align="center" type="selection" width="40"/>
        <el-table-column :label="t('job.index')" fixed="left" type="index" width="60"/>
        <el-table-column :label="t('job.jobName')" fixed="left" prop="jobName" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.jobGroup')" prop="jobGroup" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.jobStatus')" prop="jobStatus" show-overflow-tooltip width="120">
          <template #default="scope">
            <dict-tag :options="job_status" :value="scope.row.jobStatus"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('job.jobExecuteStatus')" prop="jobExecuteStatus" show-overflow-tooltip width="120">
          <template #default="scope">
            <dict-tag :options="job_execute_status" :value="scope.row.jobExecuteStatus"></dict-tag>
          </template>
        </el-table-column>

        <el-table-column :label="t('job.startTime')" prop="startTime" show-overflow-tooltip width="120"/>

        <el-table-column :label="t('job.previousTime')" prop="previousTime" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.nextTime')" prop="nextTime" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.jobType')" prop="jobType" show-overflow-tooltip width="120">
          <template #default="scope">
            <dict-tag :options="job_type" :value="scope.row.jobType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('job.executePath')" prop="executePath" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.className')" prop="className" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.methodName')" prop="methodName" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.methodParamsValue')" prop="methodParamsValue" show-overflow-tooltip
                         width="120"/>
        <el-table-column :label="t('job.cronExpression')" prop="cronExpression" show-overflow-tooltip width="120"/>
        <el-table-column :label="t('job.misfirePolicy')" prop="misfirePolicy" show-overflow-tooltip width="200">
          <template #default="scope">
            <dict-tag :options="misfire_policy" :value="scope.row.misfirePolicy"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" fixed="right" width="300">
          <template #default="scope">
            <el-button @click="handleJobLog(scope.row)" text type="primary">{{ $t('job.jobLogBtn') }}</el-button>

            <el-button v-auth="'job_sys_job_start_job'" @click="handleStartJob(scope.row)" text type="primary"
                       v-if="scope.row.jobStatus !== '2'"
            >
              {{ $t('job.jobStartBtn') }}
            </el-button>

            <el-button
                v-auth="'job_sys_job_shutdown_job'"
                @click="handleShutDownJob(scope.row)"
                text
                type="primary"
                v-if="scope.row.jobStatus === '2'"
            >
              {{ $t('job.jobPauseBtn') }}
            </el-button>

            <el-button v-auth="'job_sys_job_edit'" @click="handleEditJob(scope.row)" text type="primary">
              {{ $t('common.editBtn') }}
            </el-button>

            <el-button v-auth="'job_sys_job_start_job'" @click="handleRunJob(scope.row)" text type="primary">
              {{ $t('job.jobRunBtn') }}
            </el-button>

            <el-button v-auth="'job_sys_job_del'" @click="handleDelete(scope.row)" text type="primary"
                       :disabled="scope.row.jobStatus === '2'">{{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 卡片视图  -->
      <el-scrollbar v-if="!tableViewRef">
        <div class="p-4">
          <div class="mx-auto">
            <!-- Main -->
            <div class="grid grid-cols-4 gap-x-4 gap-y-6">
              <div
                  v-for="job in state.dataList"
                  :key="job.jobId"
                  class="w-full max-w-sm mt-2 bg-gray-100 dark:bg-[#1d1e1f] rounded-lg border dark:border-[#303030]"
              >
                <div aria-label="header" class="flex items-center p-4 space-x-4">
                  <div aria-label="avatar" class="flex items-center mr-auto space-x-4">
                    <div class="flex flex-col flex-1 space-y-2">
                      <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {{ job.jobName }}
                      </div>
                      <p class="text-base font-normal text-gray-500 truncate dark:text-gray-400">
                        {{ job.jobGroup }} / {{ job_type.find((item: any) => item.value === job.jobType)?.label }}
                      </p>
                    </div>
                  </div>
                </div>
                <div aria-label="navigation" class="py-2">
                  <nav class="grid gap-1">
                    <div class="flex items-center w-full px-4 py-1 space-x-3 leading-6 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#303030] rounded-md">
                      <span class="font-medium">{{ $t('job.jobStatus') }}:</span>
                      <span>{{ job_status.find((item: any) => item.value === job.jobStatus)?.label }}</span>
                    </div>
                    <div class="flex items-center w-full px-4 py-1 space-x-3 leading-6 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#303030] rounded-md">
                      <span class="font-medium">{{ $t('job.cronExpression') }}:</span>
                      <span>{{ job.cronExpression }}</span>
                    </div>
                    <div class="flex items-center w-full px-4 py-1 space-x-3 leading-6 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#303030] rounded-md">
                      <span class="font-medium">{{ $t('job.previousTime') }}:</span>
                      <span>{{ job.previousTime }}</span>
                    </div>
                    <div class="flex items-center w-full px-4 py-1 space-x-3 leading-6 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#303030] rounded-md">
                      <span class="font-medium">{{ $t('job.nextTime') }}:</span>
                      <span>{{ job.nextTime }}</span>
                    </div>
                    <div class="flex items-center w-full px-4 py-1 space-x-3 leading-6 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#303030] rounded-md">
                      <span class="font-medium">{{ $t('job.jobExecuteStatus') }}:</span>
                      <span>
                          <el-icon v-if="job.jobExecuteStatus === '1'"><CircleCloseFilled/></el-icon>
                          <el-icon v-if="job.jobExecuteStatus === '0'"><CircleCheckFilled/></el-icon>
                      </span>
                    </div>
                  </nav>
                </div>
                <div aria-label="footer" class="pt-2 border-t dark:border-[#303030]">
                  <div class="flex items-center justify-center min-w-full">
                    <nav class="flex">
                      <a
                          @click="handleJobLog(job)"
                          href="javascript:;"
                          class="px-2 py-2 text-primary hover:text-primary-400 dark:text-primary-300"
                      >
                        <span>{{ $t('job.jobLogBtn') }}</span>
                      </a>
                      <a
                          v-auth="'job_sys_job_start_job'"
                          @click="handleStartJob(job)"
                          v-if="job.jobStatus !== '2'"
                          href="javascript:;"
                          class="px-2 py-2 text-primary hover:text-primary-400 dark:text-primary-300"
                      >
                        <span>{{ $t('job.jobStartBtn') }}</span>
                      </a>
                      <a
                          v-auth="'job_sys_job_shutdown_job'"
                          @click="handleShutDownJob(job)"
                          v-if="job.jobStatus === '2'"
                          href="javascript:;"
                          class="px-2 py-2 text-primary hover:text-primary-400 dark:text-primary-300"
                      >
                        <span>{{ $t('job.jobPauseBtn') }}</span>
                      </a>
                      <a
                          v-auth="'job_sys_job_edit'" @click="handleEditJob(job)"
                          href="javascript:;"
                          class="px-2 py-2 text-primary hover:text-primary-400 dark:text-primary-300"
                      >
                        <span> {{ $t('common.editBtn') }}</span>
                      </a>
                      <a
                          v-auth="'job_sys_job_start_job'" @click="handleRunJob(job)"
                          href="javascript:;"
                          class="px-2 py-2 text-primary hover:text-primary-400 dark:text-primary-300"
                      >
                        <span>{{ $t('job.jobRunBtn') }}</span>
                      </a>

                      <a
                          v-auth="'job_sys_job_del'" @click="handleDelete(job)" type="primary"
                          v-if="job.jobStatus !== '2'"
                          href="javascript:;"
                          class="px-2 py-2 text-primary hover:text-primary-400 dark:text-primary-300"
                      >
                        <span>{{ $t('common.delBtn') }}</span>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </el-scrollbar>

      <pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog @refresh="getDataList()" ref="formDialogRef"/>
    <job-log ref="jobLogRef"></job-log>
  </div>
</template>

<script lang="ts" name="systemSysJob" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList, runJobRa, shutDownJobRa, startJobRa } from '/@/api/daemon/job';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const JobLog = defineAsyncComponent(() => import('./job-log.vue'));

/**
 * Job Management Component
 * Handles job listing, operations, and management
 */

// 获取国际化方法
const { t } = useI18n();

/** 表单弹窗引用 */
const formDialogRef = ref();
/** 作业日志引用 */
const jobLogRef = ref();
/** 表格视图 */
const tableViewRef = ref(false);
/** 搜索表单信息 */
const queryForm = reactive({
  jobName: '',
  jobGroup: '',
  jobStatus: '',
  jobExecuteStatus: '',
});
/** 是否展示搜索表单 */
const showSearch = ref(true);

// 多选变量
/** 选中的行 */
const selectedRows = ref([]);
/** 是否可以多选 */
const multiple = ref(true);

/** 查询字典 */
const {
  job_status,
  job_execute_status,
  misfire_policy,
  job_type
} = useDict('job_status', 'job_execute_status', 'misfire_policy', 'job_type');

/** 表格状态变量 */
const state = reactive<BasicTableProps>({
  queryForm,
  pageList: fetchList,
  pagination: {
    size: 8,
    pageSizes: [4, 8, 12]
  }
});

/** 获取表格数据方法 */
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

/**
 * Resets the query form and refreshes the data list
 * 重置查询表单并刷新数据列表
 */
const resetQuery = () => {
  Object.keys(queryForm).forEach((key) => (queryForm[key] = ''));
  getDataList();
};

/**
 * Handles row selection change
 * 处理行选中事件
 * @param rows - Selected rows 选中的行
 */
const handleSelectionChange = (rows: any) => {
  selectedRows.value = rows;
  multiple.value = !rows.length;
};

/**
 * Exports data to Excel
 * 导出数据到Excel
 */
const exportExcel = () => {
  downBlobFile('/job/sys-job/export', Object.assign(state.queryForm, {ids: selectedRows}), 'job.xlsx');
};

/**
 * Opens job log dialog
 * 打开作业日志对话框
 * @param row - Job row data 作业行数据
 */
const handleJobLog = (row: any) => {
  jobLogRef.value.openDialog(row.jobId);
};

/**
 * Handles job editing
 * 处理作业编辑
 * @param row - Job row data 作业行数据
 */
const handleEditJob = (row: any) => {
  const { jobStatus } = row;
  if (jobStatus === '1' || jobStatus === '3') {
    formDialogRef.value.openDialog(row.jobId);
  } else {
    useMessage().error(t('job.editRunningJobError'));
  }
};

/**
 * Starts a job
 * 启动作业
 * @param row - Job row data 作业行数据
 */
const handleStartJob = async (row: any) => {
  const { jobStatus, jobName, jobId } = row;

  if (jobStatus === '1' || jobStatus === '3') {
    try {
      await useMessageBox().confirm(t('job.startJobConfirm', { jobName }));
    } catch {
      return;
    }

    try {
      await startJobRa(jobId);
      await getDataList();
      useMessage().success(t('common.optSuccessText'));
    } catch (err: any) {
      useMessage().error(err.msg);
    }
  } else {
    useMessage().error(t('job.jobAlreadyRunning'));
  }
};

/**
 * Shuts down a running job
 * 暂停作业
 * @param row - Job row data 作业行数据
 */
const handleShutDownJob = async (row: any) => {
  const { jobStatus, jobName, jobId } = row;

  if (jobStatus === '2') {
    try {
      await useMessageBox().confirm(t('job.shutdownJobConfirm', { jobName }));
    } catch {
      return;
    }

    try {
      await shutDownJobRa(jobId);
      await getDataList();
      useMessage().success(t('common.optSuccessText'));
    } catch (err: any) {
      useMessage().error(err.msg);
    }
  } else {
    useMessage().error(t('job.jobAlreadyPaused'));
  }
};

/**
 * Runs a job immediately
 * 立即运行作业
 * @param row - Job row data 作业行数据
 */
const handleRunJob = async (row: any) => {
  const { jobName, jobId } = row;

  try {
    await useMessageBox().confirm(t('job.runJobConfirm', { jobName }));
  } catch {
    return;
  }

  try {
    await runJobRa(jobId);
    await getDataList();
    useMessage().success(t('common.optSuccessText'));
  } catch (err: any) {
    useMessage().error(t('job.runJobFailed'));
  }
};

/**
 * Deletes a job
 * 删除作业
 * @param row - Job row data 作业行数据
 */
const handleDelete = async (row: any) => {
  if (!row) {
    selectedRows.value.forEach(handleDelete);
    return;
  }

  const { jobId, jobName } = row;

  try {
    await useMessageBox().confirm(t('job.deleteJobConfirm', { jobName }));
  } catch {
    return;
  }

  try {
    await delObj(jobId);
    await getDataList();
    useMessage().success(t('common.delSuccessText'));
  } catch (error: any) {
    useMessage().error(t('job.deleteJobFailed'));
  }
};
</script>
