<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm">
          <el-form-item :label="t('param.systemFlag')" class="ml2" prop="systemFlag">
            <el-select v-model="state.queryForm.systemFlag" :placeholder="t('param.inputsystemFlagTip')">
              <el-option v-for="(item, index) in dict_type" :key="index" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="ml2">
            <el-button formDialogRef icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button formDialogRef icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button class="ml10" formDialogRef icon="folder-add" type="primary"
                     @click="formDialogRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button class="ml10" formDialogRef icon="Download" type="primary"
                     @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button :disabled="multiple" class="ml10" formDialogRef icon="Delete"
                     type="primary" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="50"/>
        <el-table-column :label="t('param.index')" type="index" width="80"/>
        <el-table-column :label="t('param.publicId')" prop="publicId" show-overflow-tooltip/>
        <el-table-column :label="t('param.publicName')" prop="publicName" show-overflow-tooltip/>
        <el-table-column :label="t('param.publicKey')" prop="publicKey" show-overflow-tooltip/>
        <el-table-column :label="t('param.publicValue')" prop="publicValue" show-overflow-tooltip/>
        <el-table-column :label="t('param.status')" prop="status" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="status_type" :value="scope.row.status"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('param.validateCode')" prop="validateCode" show-overflow-tooltip/>
        <el-table-column :label="t('param.createTime')" prop="createTime" show-overflow-tooltip/>
        <el-table-column :label="t('param.publicType')" prop="publicType" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="param_type" :value="scope.row.publicType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('param.systemFlag')" prop="systemFlag" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dict_type" :value="scope.row.systemFlag"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary"
                       @click="formDialogRef.openDialog(scope.row.publicId)">{{ $t('common.editBtn') }}
            </el-button>

            <el-button text type="primary" @click="handleDelete(scope.row)">{{
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

<script lang="ts" name="systemSysPublicParam" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObj, fetchList} from "/@/api/admin/param";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';
import {useI18n} from "vue-i18n";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const {t} = useI18n()
// 定义查询字典

const {dict_type, status_type, param_type} = useDict('dict_type', 'status_type', 'param_type')
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
    systemFlag: ''
  },
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
  downBlobFile('/admin/param/export', state.queryForm, 'param.xlsx')
}

// 删除操作
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach((val: any) => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(t('common.delConfirmText') + row.publicId)
      .then(() => {
        delObj(row.publicId).then(() => {
          getDataList();
          useMessage().success(t('common.delSuccessText'));
        }).catch((err: any) => {
          useMessage().error(err.msg)
        })
      })
};
</script>
