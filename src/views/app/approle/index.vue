<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row shadow="hover" v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('approle.roleName')" prop="roleName">
            <el-input :placeholder="$t('approle.inputRoleNameTip')" v-model="state.queryForm.roleName"
              style="max-width: 180px" />
          </el-form-item>
          <el-form-item class="ml2">
            <el-button icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="roleDialogRef.openDialog()" v-auth="'app_approle_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()" v-auth="'app_approle_export'">
            {{ $t('common.importBtn') }}
          </el-button>
          <el-button icon="Download" type="primary" class="ml10" @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button :disabled="multiple" icon="Delete" type="primary" class="ml10" v-auth="'app_approle_del'"
            @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" :label="$t('approle.index')" width="80" />
        <el-table-column prop="roleName" :label="$t('approle.roleName')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleCode" :label="$t('approle.roleCode')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleDesc" :label="$t('approle.roleDesc')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" :label="$t('approle.createTime')" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary" v-auth="'app_approle_edit'"
              @click="roleDialogRef.openDialog(scope.row.roleId)">{{ $t('common.editBtn') }}</el-button>

            <el-button text type="primary" v-auth="'app_approle_del'" @click="handleDelete([scope.row.roleId])">{{
              $t('common.delBtn')
            }}</el-button>

            <el-button text type="primary" @click="permessionRef.openDialog(scope.row)" v-auth="'app_approle_perm'">{{
              $t('approle.permissionTip')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </el-card>

    <!-- 角色编辑、新增  -->
    <role-dialog ref="roleDialogRef" @refresh="getDataList()" />
    <!-- 导入角色 -->
    <upload-excel ref="excelUploadRef" :title="$t('sysuser.importUserTip')" url="/admin/role/import"
      temp-url="/admin/sys-file/local/file/role.xlsx" @refreshDataList="getDataList" />
    <!-- 授权 -->
    <permession ref="permessionRef" />
  </div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObj } from "/@/api/app/approle";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useI18n } from "vue-i18n";

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('./form.vue'));
const Permession = defineAsyncComponent(() => import('./permession.vue'))
const { t } = useI18n()

// 定义变量内容
const roleDialogRef = ref()
const permessionRef = ref()
const excelUploadRef = ref()
const queryRef = ref()
const showSearch = ref(true)
// 多选rows
const selectObjs = ref([]) as any

// 是否可以多选
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    roleName: ''
  },
  pageList: fetchList // H
});


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
const handleSelectionChange = (objs: any) => {
  objs.forEach((val: any) => {
    selectObjs.value.push(val.roleId)
  });
  multiple.value = !objs.length
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/approle/export', state.queryForm, 'approle.xlsx')
}


// 删除操作
const handleDelete = (ids: string[]) => {
  useMessageBox().confirm(t('common.delConfirmText'))
          .then(() => {
            delObj(ids).then(() => {
              getDataList();
              useMessage().success(t('common.delSuccessText'));
            }).catch((err: any) => {
              useMessage().error(err.msg)
            })
          })
};

</script>
