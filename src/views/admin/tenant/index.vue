<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row shadow="hover" v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('tenant.name')" prop="name">
            <el-input :placeholder="$t('tenant.inputnameTip')" v-model="state.queryForm.name"
                      style="max-width: 180px"/>
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
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
                     v-auth="'admin_systenant_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <!--          <el-button  icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()"-->
          <!--            v-auth="'admin_systenant_add'">-->
          <!--            {{ $t('common.importBtn') }}-->
          <!--          </el-button>-->
          <el-button icon="Download" type="primary" class="ml10" @click="exportExcel"
                     v-auth="'admin_systenant_add'">
            {{ $t('common.exportBtn') }}
          </el-button>

          <el-button :disabled="multiple" icon="Delete" type="primary" class="ml10"
                     v-auth="'admin_systenant_del'" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>

          <el-button type="primary" class="ml10" @click="handleTenantMenu()" v-auth="'admin_systenant_tenantmenu'">
            {{ $t('tenantmenu.name') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center"/>
        <el-table-column type="index" :label="t('tenant.index')" width="80"/>
        <el-table-column prop="name" :label="t('tenant.name')" show-overflow-tooltip/>
        <el-table-column prop="code" :label="t('tenant.code')" show-overflow-tooltip/>
        <el-table-column prop="tenantDomain" :label="t('tenant.tenantDomain')" show-overflow-tooltip/>
        <el-table-column prop="startTime" :label="t('tenant.startTime')" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ parseDate(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="endTime" :label="t('tenant.endTime')" show-overflow-tooltip>
          <template #default="scope">
            <span>{{ parseDate(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="t('tenant.status')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="status_type" :value="scope.row.status"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary" v-auth="'admin_systenant_edit'"
                       @click="formDialogRef.openDialog(scope.row.id)">{{
                $t('common.editBtn')
              }}
            </el-button>

            <el-button text type="primary" v-auth="'admin_systenant_del'" @click="handleDelete(scope.row)">{{
                $t('common.delBtn')
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </el-card>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList()"/>
    <!-- 导入excel -->
    <upload-excel ref="excelUploadRef" :title="$t('tenant.importTenantTip')" url="/admin/tenant/import"
                  temp-url="/admin/sys-file/local/file/tenant.xlsx" @refreshDataList="getDataList"/>

    <tenant-menu ref="TenantMenuRef"></tenant-menu>
  </div>
</template>

<script setup lang="ts" name="systemTenant">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchPage, delObj} from "/@/api/admin/tenant";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useI18n} from "vue-i18n";
import {useDict} from "/@/hooks/dict";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const TenantMenu = defineAsyncComponent(() => import('./tenantMenu/index.vue'))
const {t} = useI18n()

// 定义变量内容
const formDialogRef = ref()
const excelUploadRef = ref()
const TenantMenuRef = ref()
// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([])
const multiple = ref(true)

// 字典
const {status_type} = useDict('status_type')

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchPage
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
  downBlobFile('/admin/tenant/export', state.queryForm, 'tenant.xlsx')
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

const handleTenantMenu = () => {
  TenantMenuRef.value.open()
}

</script>
