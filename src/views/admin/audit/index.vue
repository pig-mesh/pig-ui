<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item :label="$t('audit.auditName')" prop="auditName">
            <el-input :placeholder="t('audit.inputAuditNameTip')" v-model="state.queryForm.auditName"
                      style="max-width: 180px"/>
          </el-form-item>
          <el-form-item :label="$t('audit.auditField')" prop="auditField">
            <el-input :placeholder="t('audit.inputAuditFieldTip')" v-model="state.queryForm.auditField"
                      style="max-width: 180px"/>
          </el-form-item>
          <el-form-item :label="$t('audit.createBy')" prop="createBy">
            <el-input :placeholder="t('audit.inputCreateByTip')" v-model="state.queryForm.createBy"
                      style="max-width: 180px"/>
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
          <el-button formDialogRef icon="Download" type="primary" class="ml10" @click="exportExcel"
                     v-auth="'sys_audit_export'">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button formDialogRef :disabled="multiple" icon="Delete" type="primary" class="ml10"
                     v-auth="'sys_audit_del'" @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
                @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column type="index" :label="t('audit.index')" width="80"/>
        <el-table-column prop="auditName" :label="t('audit.auditName')" show-overflow-tooltip/>
        <el-table-column prop="auditField" :label="t('audit.auditField')" show-overflow-tooltip/>
        <el-table-column prop="beforeVal" :label="t('audit.beforeVal')" show-overflow-tooltip/>
        <el-table-column prop="afterVal" :label="t('audit.afterVal')" show-overflow-tooltip/>
        <el-table-column prop="createBy" :label="t('audit.createBy')" show-overflow-tooltip/>
        <el-table-column prop="createTime" :label="t('audit.createTime')" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary" v-auth="'sys_audit_del'" @click="handleDelete([scope.row.id])">{{
                $t('common.delBtn')
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="systemSysAuditLog">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList, delObjs} from "/@/api/admin/audit";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useI18n} from "vue-i18n";

const {t} = useI18n()
// 定义查询字典

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
  downBlobFile('/admin/audit/export', state.queryForm, 'audit.xlsx')
}

// 多选事件
const handleSelectionChange = (objs: any) => {
  objs.forEach((val: any) => {
    selectObjs.value.push(val.id)
  });
  multiple.value = !objs.length
}

// 删除操作
const handleDelete = (ids: string[]) => {
  useMessageBox().confirm(t('common.delConfirmText'))
      .then(() => {
        delObjs(ids).then(() => {
          getDataList(false);
          useMessage().success(t('common.delSuccessText'));
        }).catch((err: any) => {
          useMessage().error(err.msg)
        })
      })
};
</script>
