<template>
    <el-card class="layout-padding-auto" shadow="hover">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('syslog.logType')" prop="logType">
            <el-select v-model="state.queryForm.logType" :placeholder="$t('syslog.inputLogTypeTip')" clearable
              class="w100">
              <el-option v-for="item in log_type" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('syslog.createTime')" prop="createTime">
            <el-date-picker v-model="state.queryForm.createTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetimerange"
              range-separator="To" :start-placeholder="$t('syslog.inputStartPlaceholderTip')"
              :end-placeholder="$t('syslog.inputEndPlaceholderTip')" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button size="default" icon="Download" type="primary" class="ml10" @click="exportExcel"
            v-auth="'sys_user_export'">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button size="default" :disabled="multiple" icon="Delete" type="primary" class="ml10"
            v-auth="'sys_user_del'" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column :label="$t('syslog.index')" type="index" width="80" />
        <el-table-column :label="$t('syslog.logType')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="log_type" :value="scope.row.logType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('syslog.title')" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.remoteAddr')" prop="remoteAddr" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.remoteAddr')" prop="remoteAddr" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.method')" prop="method" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.serviceId')" prop="serviceId" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.time')" prop="time" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('syslog.createTime')" prop="createTime" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('common.action')" width="100">
          <template #default="scope">
            <el-button v-auth="'sys_user_del'" size="small" text type="primary" @click="handleDelete(scope.row)">
              {{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle">
      </pagination>
    </el-card>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from "/@/hooks/table";
import { pageList, delObj } from "/@/api/admin/log";
import { useI18n } from 'vue-i18n'
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from "/@/hooks/dict";


const { log_type } = useDict('log_type')
const { t } = useI18n()

// 定义变量内容
const queryRef = ref();
const showSearch = ref(true)

// 多选rows
const selectObjs = ref([]);
// 是否可以多选
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    logType: '',
    createTime: ''
  },
  selectObjs: [],
  pageList: pageList // H
});


//  table hook
const {
  downBlobFile,
  getDataList,
  currentChangeHandle,
  sizeChangeHandle
} = useTable(state)


// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields()
  getDataList()
}

// 多选事件
const handleSelectionChange = (val: any) => {
  selectObjs.value = val
  multiple.value = !val.length
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/log/export', state.queryForm, 'log.xlsx')
}

// 删除数据
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach(val => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(`${t('common.delConfirmText')}：${row.id} ?`).then(() => {
    // 删除用户的接口
    delObj(row.id).then(() => {
      getDataList();
      useMessage().success(t('common.delSuccessText'))
    }).catch(err => {
      useMessage().error(err.msg)
    })
  })
};
</script>

<style scoped>

</style>
