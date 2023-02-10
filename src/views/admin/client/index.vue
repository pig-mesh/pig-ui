<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button v-auth="'sys_client_add'" class="ml10" formDialogRef icon="folder-add" type="primary"
                     @click="formDialogRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button class="ml10" formDialogRef icon="Download" type="primary"
                     @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button v-auth="'sys_client_del'" :disabled="multiple" class="ml10" formDialogRef icon="Delete"
                     type="primary" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <el-button class="ml10" formDialogRef icon="refresh-left"
                     type="primary" @click="handleRefreshCache()">
            {{ $t('common.refreshCacheBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="60"/>
        <el-table-column :label="t('client.index')" type="index" width="80"/>
        <el-table-column :label="t('client.clientId')" prop="clientId" show-overflow-tooltip/>
        <el-table-column :label="t('client.clientSecret')" prop="clientSecret" show-overflow-tooltip/>
        <el-table-column :label="t('client.scope')" prop="scope" show-overflow-tooltip/>
        <el-table-column :label="t('client.authorizedGrantTypes')" prop="authorizedGrantTypes" show-overflow-tooltip width="600px">
          <template #default="scope">
            <dict-tag :options="grant_types" :value="scope.row.authorizedGrantTypes"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('client.accessTokenValidity')" prop="accessTokenValidity" show-overflow-tooltip/>
        <el-table-column :label="t('client.refreshTokenValidity')" prop="refreshTokenValidity" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button v-auth="'sys_client_add'" text type="primary"
                       @click="formDialogRef.openDialog(scope.row.clientId)">{{ $t('common.editBtn') }}
            </el-button>
            <el-button v-auth="'sys_client_del'" text type="primary" @click="handleDelete(scope.row)">{{
                $t('common.delBtn')
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
    </el-card>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList()"/>
  </div>
</template>

<script lang="ts" name="systemSysOauthClientDetails" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObj, fetchList, refreshCache} from "/@/api/admin/client";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';
import {useI18n} from "vue-i18n";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const {t} = useI18n()
// 定义查询字典

const {grant_types} = useDict('grant_types')
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



// 多选事件
const handleSelectionChange = (val: any) => {
  selectObjs.value = val
  multiple.value = !val.length
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/client/export', state.queryForm, 'client.xlsx')
}

const handleRefreshCache = () => {
  refreshCache().then(() => {
    useMessage().success('同步成功')
  }).catch(function () {
  })
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
