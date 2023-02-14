<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('i18n.name')" prop="name" >
            <el-input :placeholder="t('i18n.inputKeyTip')" v-model="state.queryForm.name"
                      style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('i18n.zhCn')" prop="zh-cn" >
            <el-input :placeholder="t('i18n.inputZhCnTip')" v-model="state.queryForm.zhCn"
                      style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('i18n.en')" prop="en" >
            <el-input :placeholder="t('i18n.inputEnTip')" v-model="state.queryForm.en"
                      style="max-width: 180px" />
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
          <el-button formDialogRef icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'admin_i18n_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button formDialogRef icon="Download" type="primary" class="ml10" @click="exportExcel"
            v-auth="'admin_i18n_export'">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button formDialogRef :disabled="multiple" icon="Delete" type="primary" class="ml10"
            v-auth="'admin_i18n_del'" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="60" align="center" />
          <el-table-column prop="name" :label="t('i18n.name')"  show-overflow-tooltip/>
          <el-table-column prop="zhCn" :label="t('i18n.zhCn')"  show-overflow-tooltip/>
          <el-table-column prop="en" :label="t('i18n.en')"  show-overflow-tooltip/>
          <el-table-column prop="createBy" :label="t('i18n.createBy')"  show-overflow-tooltip/>
          <el-table-column prop="createTime" :label="t('i18n.createTime')"  show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary" v-auth="'admin_i18n_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">{{ $t('common.editBtn') }}</el-button>
            <el-button text type="primary" v-auth="'admin_i18n_del'" @click="handleDelete(scope.row)">{{
              $t('common.delBtn')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </el-card>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList()" />
  </div>
</template>

<script setup lang="ts" name="systemSysI18n">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObj } from "/@/api/admin/i18n";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useI18n } from "vue-i18n";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n()
// 定义查询字典

// 定义变量内容
const formDialogRef = ref()
// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([])
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    name: '',
    zhCn: '',
    en: ''
  },
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
  // 清空排序规则
  state.queryForm!.descs = []
  state.queryForm!.ascs = []
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 多选事件
const handleSelectionChange = (val: any) => {
  selectObjs.value = val
  multiple.value = !val.length
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/i18n/export', state.queryForm, 'i18n.xlsx')
}

// 删除操作
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach((val: any) => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(t('common.delConfirmText') + row.id)
    .then(() => {
      delObj(row.id).then(() => {
        getDataList();
        useMessage().success(t('common.delSuccessText'));
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    })
};
</script>
