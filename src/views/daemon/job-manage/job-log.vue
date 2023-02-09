<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" fullscreen
             title="运行日志" draggable>
    <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%">
      <el-table-column prop="jobId" :label="t('job.jobId')" show-overflow-tooltip/>
      <el-table-column prop="jobName" :label="t('job.jobName')" show-overflow-tooltip/>
      <el-table-column prop="jobGroup" :label="t('job.jobGroup')" show-overflow-tooltip/>
      <el-table-column prop="jobOrder" :label="t('job.jobOrder')" show-overflow-tooltip/>
      <el-table-column prop="jobType" :label="t('job.jobType')" show-overflow-tooltip>
        <template #default="scope">
          <dict-tag :options="job_type" :value="scope.row.jobType"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column prop="executePath" :label="t('job.executePath')" show-overflow-tooltip/>
      <el-table-column prop="className" :label="t('job.className')" show-overflow-tooltip/>
      <el-table-column prop="methodName" :label="t('job.methodName')" show-overflow-tooltip/>
      <el-table-column prop="methodParamsValue" :label="t('job.methodParamsValue')" show-overflow-tooltip/>
      <el-table-column prop="cronExpression" :label="t('job.cronExpression')" show-overflow-tooltip/>
      <el-table-column prop="jobMessage" :label="t('job.jobMessage')" show-overflow-tooltip/>
      <el-table-column prop="jobLogStatus" :label="t('job.jobLogStatus')" show-overflow-tooltip>
        <template #default="scope">
          <dict-tag :options="job_execute_status" :value="scope.row.jobLogStatus"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column prop="executeTime" :label="t('job.executeTime')" show-overflow-tooltip/>
      <el-table-column prop="exceptionInfo" :label="t('job.exceptionInfo')" show-overflow-tooltip/>
      <el-table-column prop="createTime" :label="t('job.createTime')" show-overflow-tooltip/>
    </el-table>
    <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
  </el-dialog>
</template>

<script setup lang="ts" name="job-log">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList} from "/@/api/daemon/job";
import {useI18n} from "vue-i18n";
import { useDict } from '/@/hooks/dict';
const {t} = useI18n()
const visible = ref(false)


const { job_type,job_execute_status } = useDict('job_type','job_execute_status')

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    jobId: ''
  },
  pageList: fetchList,
  createdIsNeed: false
})

const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle
} = useTable(state)


const openDialog = (id: string) => {
  visible.value = true
  state.queryForm.jobId = id
  getDataList()

};

// 暴露变量
defineExpose({
  openDialog
});
</script>

<style scoped>

</style>
