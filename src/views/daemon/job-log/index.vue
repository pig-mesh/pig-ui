<template>
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('job.jobName')" prop="jobName" >
            <el-input :placeholder="t('job.inputjobNameTip')" v-model="state.queryForm.jobName"
                      style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('job.jobGroup')" prop="jobGroup" >
            <el-input :placeholder="t('job.inputjobGroupTip')" v-model="state.queryForm.jobGroup"
                      style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="t('job.jobLogStatus')" prop="jobLogStatus" class="ml2">
            <el-select v-model="state.queryForm.jobLogStatus" :placeholder="t('job.inputjobLogStatusTip')">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in job_execute_status" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="ml2">
            <el-button formDialogRef icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row class="mb8">
        <div class="mb8" style="width: 100%">
          <el-button :disabled="multiple" class="ml10" icon="Delete" type="primary"
                     @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%"
                @selection-change="handleSelectionChange"
      >
        <el-table-column align="center" type="selection" width="50"/>
        <el-table-column prop="jobName" :label="t('job.jobName')" show-overflow-tooltip/>
        <el-table-column prop="jobGroup" :label="t('job.jobGroup')" show-overflow-tooltip/>
        <el-table-column prop="jobLogStatus" :label="t('job.jobLogStatus')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="job_execute_status" :value="scope.row.jobLogStatus"></dict-tag>
          </template>
        </el-table-column>
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
        <el-table-column prop="executeTime" :label="t('job.executeTime')" show-overflow-tooltip/>
        <el-table-column prop="exceptionInfo" :label="t('job.exceptionInfo')" show-overflow-tooltip/>
        <el-table-column prop="createTime" :label="t('job.createTime')" show-overflow-tooltip/>
      </el-table>
      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
    </el-card>
</template>

<script setup lang="ts">
import {useDict} from "/@/hooks/dict";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {delObjs, fetchList} from "/@/api/daemon/job-log";
import {BasicTableProps, useTable} from "/@/hooks/table";
import {useI18n} from "vue-i18n";

const { job_type,job_execute_status } = useDict('job_type','job_execute_status')
const {t} = useI18n()
const queryRef = ref()
const showSearch = ref(true)

const selectObjs = ref([])
const multiple = ref(true)

const resetQuery = () => {
  queryRef.value.resetFields()
  getDataList()
}


const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    jobName: '',
    jobGroup: '',
    jobLogStatus: ''
  },
  pageList: fetchList
})

const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle
} = useTable(state)

const handleSelectionChange = (val: any) => {
  selectObjs.value = val
  multiple.value = !val.length
}

// 删除操作
const handleDelete = (row: any) => {
  let ids = row?.jobId
  if (!row) {
    ids = selectObjs.value.map((item: any) => {
      return item.jobId
    })
  }
  useMessageBox().confirm(t('common.delConfirmText'))
      .then(() => {
        delObjs(ids).then(() => {
          getDataList();
          useMessage().success(t('common.delSuccessText'));
        }).catch((err: any) => {
          useMessage().error(err.msg)
        })
      })
};

</script>

<style scoped>

</style>
