<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('post.postName')" prop="postName">
            <el-input  :placeholder="$t('post.inputpostNameTip')" v-model="state.queryForm.postName"
              style="max-width: 180px" />
          </el-form-item>
          <el-form-item class="ml2">
            <el-button  icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh"  @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button  icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
            v-auth="'sys_post_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button  icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()"
            v-auth="'sys_post_add'">
            {{ $t('common.importBtn') }}
          </el-button>
          <el-button  icon="Download" type="primary" class="ml10" @click="exportExcel"
            v-auth="'sys_post_export'">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button  :disabled="multiple" icon="Delete" type="primary" class="ml10"
            v-auth="'sys_post_del'" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" :label="t('post.index')" width="80" />
        <el-table-column prop="postCode" :label="t('post.postCode')" show-overflow-tooltip />
        <el-table-column prop="postName" :label="t('post.postName')" show-overflow-tooltip />
        <el-table-column prop="postSort" :label="t('post.postSort')" show-overflow-tooltip />
        <el-table-column prop="remark" :label="t('post.remark')" show-overflow-tooltip />
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button   text type="primary" v-auth="'sys_post_edit'"
              @click="formDialogRef.openDialog(scope.row.postId)">{{ $t('common.editBtn') }}</el-button>

            <el-button   text type="primary" v-auth="'sys_post_del'" @click="handleDelete(scope.row)">{{
              $t('common.delBtn')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </el-card>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList()" />
    <!-- 导入excel -->
    <upload-excel ref="excelUploadRef" :title="$t('post.importPostTip')" url="/admin/post/import"
      temp-url="/admin/sys-file/local/file/post.xlsx" @refreshDataList="getDataList" />
  </div>
</template>

<script setup lang="ts" name="systemPost">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObj } from "/@/api/admin/post";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useI18n } from "vue-i18n";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n()

// 定义变量内容
const formDialogRef = ref()
const excelUploadRef = ref()
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

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/post/export', state.queryForm, 'post.xlsx')
}

// 删除操作
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach((val: any) => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(t('common.delConfirmText') + row.postId)
    .then(() => {
      delObj(row.postId).then(() => {
        getDataList();
        useMessage().success(t('common.delSuccessText'));
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    })
};
</script>
