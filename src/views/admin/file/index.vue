<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button formDialogRef icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" :label="t('file.index')" width="80" />
          <el-table-column prop="fileName" :label="t('file.fileName')" show-overflow-tooltip/>
          <el-table-column prop="bucketName" :label="t('file.bucketName')" show-overflow-tooltip/>
          <el-table-column prop="original" :label="t('file.original')" show-overflow-tooltip/>
          <el-table-column prop="type" :label="t('file.type')" show-overflow-tooltip/>
          <el-table-column prop="fileSize" :label="t('file.fileSize')" show-overflow-tooltip/>
          <el-table-column prop="createTime" :label="t('file.createTime')" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button size="small" text type="primary" v-auth="'admin_file_edit'"
              @click="formDialogRef.openDialog(scope.row.id)">{{ $t('common.editBtn') }}</el-button>

            <el-button size="small" text type="primary" v-auth="'sys_file_del'" @click="handleDelete(scope.row)">{{
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

<script setup lang="ts" name="systemSysFile">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObj } from "/@/api/admin/file";
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
  queryForm: {},
  pageList: fetchList
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  downBlobFile
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
