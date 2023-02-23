<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="t('appsocial.type')" prop="type" class="ml2">
            <el-select v-model="state.queryForm.type" :placeholder="t('appsocial.inputTypeTip')">
              <el-option :label="item.label" :value="item.value" v-for="(item, index) in app_social_type"
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
          <el-button formDialogRef icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
                     v-auth="'app_social_details_add'">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button formDialogRef icon="Download" type="primary" class="ml10" @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button formDialogRef :disabled="multiple" icon="Delete" type="primary" class="ml10"
                     v-auth="'app_social_details_del'" @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
                @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="60" align="center"/>
        <el-table-column type="index" :label="t('appsocial.index')" width="80"/>
        <el-table-column prop="type" :label="t('appsocial.type')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="app_social_type" :value="scope.row.type"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" :label="t('appsocial.remark')" show-overflow-tooltip/>
        <el-table-column prop="appId" :label="t('appsocial.appId')" show-overflow-tooltip/>
        <el-table-column prop="appSecret" :label="t('appsocial.appSecret')" show-overflow-tooltip/>
        <el-table-column prop="createTime" :label="t('appsocial.createTime')" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button text type="primary" v-auth="'app_social_details_edit'"
                       @click="formDialogRef.openDialog(scope.row.id)">{{ $t('common.editBtn') }}
            </el-button>
            <el-button text type="primary" v-auth="'app_social_details_del'" @click="handleDelete([scope.row.id])">{{
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
  </div>
</template>

<script setup lang="ts" name="systemAppSocialDetails">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList, delObj} from "/@/api/app/appsocial";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';
import {useI18n} from "vue-i18n";

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const {t} = useI18n()
// 定义查询字典

const {app_social_type} = useDict('app_social_type')
// 定义变量内容
const formDialogRef = ref()
// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    type: ''
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
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 多选事件
const handleSelectionChange = (objs: any) => {
  selectObjs.value = []
  objs.forEach((val: any) => {
    selectObjs.value.push(val.id)
  });
  multiple.value = !objs.length
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/app/appsocial/export', state.queryForm, 'appsocial.xlsx')
}

// 删除操作
const handleDelete = (ids: any) => {
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
