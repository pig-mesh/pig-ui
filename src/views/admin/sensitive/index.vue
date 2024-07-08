<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="敏感词" prop="sensitiveWord">
            <el-input placeholder="请输入敏感词" v-model="state.queryForm.sensitiveWord"/>
          </el-form-item>
          <el-form-item label="类型" prop="sensitiveType">
            <el-radio-group v-model="state.queryForm.sensitiveType">
              <el-radio :label="item.value" v-for="(item, index) in sensitive_type" border :key="index">{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              查询
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="formDialogRef.openDialog()"
                     v-auth="'admin_sysSensitiveWord_add'">
            新 增
          </el-button>
          <el-button plain :disabled="multiple" icon="Delete" type="primary"
                     v-auth="'admin_sysSensitiveWord_del'" @click="handleDelete(selectObjs)">
            删 除
          </el-button>
          <el-button plain icon="Check" type="primary"
                     v-auth="'admin_sysSensitiveWord_del'" @click="matchDialogRef.openDialog()">
            匹配测试
          </el-button>
          <el-button plain @click="handleRefreshCache()" class="ml10" icon="refresh-left" type="primary">
            {{ $t('common.refreshCacheBtn') }}
          </el-button>

          <right-toolbar v-model:showSearch="showSearch" :export="'admin_sysSensitiveWord_export'"
                         @exportExcel="exportExcel" class="ml10 mr20" style="float: right;"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" border
                :cell-style="tableStyle.cellStyle" :header-cell-style="tableStyle.headerCellStyle"
                @selection-change="selectionChangHandle"
                @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column type="index" label="#" width="40"/>
        <el-table-column prop="sensitiveWord" label="敏感词" show-overflow-tooltip/>
        <el-table-column prop="sensitiveType" label="类型" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="sensitive_type" :value="scope.row.sensitiveType"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="200" show-overflow-tooltip/>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button icon="edit-pen" text type="primary" v-auth="'admin_sysSensitiveWord_edit'"
                       @click="formDialogRef.openDialog(scope.row.sensitiveId)">编辑
            </el-button>
            <el-button icon="delete" text type="primary" v-auth="'admin_sysSensitiveWord_del'"
                       @click="handleDelete([scope.row.sensitiveId])">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

    <!-- 匹配测试 -->
    <match-dialog ref="matchDialogRef" @refresh="getDataList(false)"/>
  </div>
</template>

<script setup lang="ts" name="systemSysSensitiveWord">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList, delObjs, refreshObj} from "/@/api/admin/sensitive";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const MatchDialog = defineAsyncComponent(() => import('./match.vue'));
// 定义查询字典

const {sensitive_type} = useDict('sensitive_type')
// 定义变量内容
const formDialogRef = ref()
const matchDialogRef = ref()
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
  downBlobFile,
  tableStyle
} = useTable(state)

// 清空搜索条件
const resetQuery = () => {
  // 清空搜索条件
  queryRef.value?.resetFields()
  // 清空多选
  selectObjs.value = []
  getDataList()
}

// 导出excel
const exportExcel = () => {
  downBlobFile('/admin/sysSensitiveWord/export', Object.assign(state.queryForm, {ids: selectObjs}), 'sysSensitiveWord.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { sensitiveId: string }[]) => {
  selectObjs.value = objs.map(({sensitiveId}) => sensitiveId);
  multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm('此操作将永久删除');
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success('删除成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

// 刷新缓存
const handleRefreshCache = async () => {
  try {
    await refreshObj();
    getDataList();
    useMessage().success('刷新成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
}
</script>
