<template>
  <el-dialog v-model="visible" :close-on-click-modal="false" fullscreen
             title="运行日志" draggable>
    <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%">
      <el-table-column :label="t('job.jobName')" prop="jobName" show-overflow-tooltip width="120" fixed="left"/>
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
      <el-table-column :label="t('job.methodParamsValue')" prop="methodParamsValue" show-overflow-tooltip width="120"/>
      <el-table-column :label="t('job.cronExpression')" prop="cronExpression" show-overflow-tooltip width="120"/>
      <el-table-column :label="t('job.misfirePolicy')" prop="misfirePolicy" show-overflow-tooltip width="200">
        <template #default="scope">
          <dict-tag :options="misfire_policy" :value="scope.row.misfirePolicy"></dict-tag>
        </template>
      </el-table-column>

    </el-table>
    <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
  </el-dialog>
</template>

<script setup lang="ts" name="job-log">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList} from "/@/api/daemon/job";
import {useI18n} from "vue-i18n";
const {t} = useI18n()
const visible = ref(false)

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
