<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item :label="$t('leave.username')" prop="username">
            <el-input :placeholder="t('leave.inputUsernameTip')" v-model="state.queryForm.username"
              style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="t('leave.state')" prop="state" class="ml2">
            <el-select v-model="state.queryForm.state" :placeholder="t('leave.inputStateTip')">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in leave_status"
                :key="index"></el-option>
            </el-select>
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
          <el-button formDialogRef icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button formDialogRef icon="Download" type="primary" class="ml10" @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button formDialogRef :disabled="multiple" icon="Delete" type="primary" class="ml10"
            @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="60" align="center" />
        <el-table-column type="index" :label="t('leave.index')" width="80" />
        <el-table-column prop="leaveId" :label="t('leave.leaveId')" show-overflow-tooltip />
        <el-table-column prop="username" :label="t('leave.username')" show-overflow-tooltip />
        <el-table-column prop="days" :label="t('leave.days')" show-overflow-tooltip />
        <el-table-column prop="state" :label="t('leave.state')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="leave_status" :value="scope.row.state"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="leaveTime" :label="t('leave.leaveTime')" show-overflow-tooltip />
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary" @click="handleSubmit(scope.row)" v-if="scope.row.state === '0'">提交</el-button>
            <el-button text type="primary" @click="formDialogRef.openDialog(scope.row.leaveId)">{{ $t('common.editBtn')
            }}</el-button>
            <el-button text type="primary" @click="handleDelete([scope.row.leaveId])">{{
              $t('common.delBtn')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </el-card>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)" />
  </div>
</template>

<script setup lang="ts" name="systemOaLeaveBill">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObj, submit } from "/@/api/oa/leave-bill";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from '/@/hooks/dict';
import { useI18n } from "vue-i18n";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n()
// 定义查询字典

const { leave_status } = useDict('leave_status')
// 定义变量内容
const formDialogRef = ref()
// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/leave/export', state.queryForm, 'leave.xlsx')
}

// 多选事件
const handleSelectionChange = (objs: any) => {
  objs.forEach((val: any) => {
    selectObjs.value.push(val.leaveId)
  });
  multiple.value = !objs.length
}

// 删除操作
const handleDelete = (ids: string[]) => {
  useMessageBox().confirm(t('common.delConfirmText'))
    .then(() => {
      delObj(ids).then(() => {
        getDataList(false);
        useMessage().success(t('common.delSuccessText'));
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    })
};

const handleSubmit = (row) => {
  useMessageBox().confirm(t('common.optConfirmText'))
    .then(() => {
      submit(row.leaveId).then(() => {
        getDataList(false);
        useMessage().success(t('common.optSuccessText'));
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    })
}
</script>