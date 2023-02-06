<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row shadow="hover" v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('sysrole.roleName')" prop="roleName">
            <el-input size="default" :placeholder="$t('sysrole.inputRoleNameTip')" v-model="state.queryForm.roleName"
              style="max-width: 180px" />
          </el-form-item>
          <el-form-item class="ml2">
            <el-button size="default" icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button size="default" icon="folder-add" type="primary" class="ml10" @click="roleDialogRef.openDialog()"
            v-auth="'sys_role_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button size="default" icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()"
            v-auth="'sys_user_add'">
            {{ $t('common.importBtn') }}
          </el-button>
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
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleCode" label="角色标识" show-overflow-tooltip></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" show-overflow-tooltip></el-table-column>
        <el-table-column label="数据权限" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dictType" :value="scope.row.dsType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" text type="primary" v-auth="'sys_role_edit'"
              @click="roleDialogRef.openDialog(scope.row.roleId)">{{ $t('common.editBtn') }}</el-button>

            <el-button size="small" text type="primary" v-auth="'sys_role_del'" @click="handleDelete(scope.row)">{{
              $t('common.delBtn')
            }}</el-button>

            <el-button size="small" text type="primary" v-auth="'sys_role_del'"
              @click="permessionRef.openDialog(scope.row)">{{ $t('sysrole.permissionTip') }}</el-button>
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
import { pageList, delObj } from "/@/api/admin/role";
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
const selectObjs = ref([])
// 是否可以多选
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    roleName: ''
  },
  pageList: pageList // H
});

const dictType = ref([{
  label: '全部',
  value: '0'
}, {
  label: '自定义',
  value: '1'
}, {
  label: '本级及子级',
  value: '2'
}, {
  label: '本级',
  value: '3'
}])

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
  downBlobFile('/admin/role/export', state.queryForm, 'role.xlsx')
}

// 删除角色
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach(val => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(`${t('common.delConfirmText')}：${row.roleName}?`)
    .then(() => {
      delObj(row.roleId).then(() => {
        getDataList();
        useMessage().success(t('common.delSuccessText'));
      }).catch(err => {
        useMessage().error(err.msg)
      })
    })
};
</script>
