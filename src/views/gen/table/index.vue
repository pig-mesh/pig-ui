<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item label="数据源" prop="name">
            <el-select v-model="state.queryForm.dsName" style="width: 100%" placeholder="请选择数据源" @change="getDataList">
              <el-option label="默认数据源" value="master"></el-option>
              <el-option v-for="ds in datasourceList" :key="ds.id" :label="ds.name" :value="ds.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('table.tableName')" prop="tableName">
            <el-input :placeholder="$t('table.inputtableNameTip')" v-model="state.queryForm.tableName"
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
          <el-button icon="Download" type="primary" class="ml10" @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button :disabled="multiple" icon="Delete" type="primary" class="ml10" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" :label="t('table.index')" width="80" />
        <el-table-column prop="tableName" :label="t('table.tableName')" show-overflow-tooltip />
        <el-table-column prop="tableComment" :label="t('table.tableDesc')" show-overflow-tooltip />
        <el-table-column prop="createTime" :label="t('table.createTime')" show-overflow-tooltip />
        <el-table-column :label="$t('common.action')" width="200">
          <template #default="scope">
            <el-button text type="primary" @click="syncTable(state.queryForm.dsName, scope.row.tableName)">{{
              $t('gen.syncBtn')
            }}</el-button>
            <el-button text type="primary"
              @click="formDialogRef.openDialog(state.queryForm.dsName, scope.row.tableName)">{{
                $t('gen.designBtn')
              }}</el-button>

            <el-button text type="primary"
              @click="generatorRef.openDialog(state.queryForm.dsName, scope.row.tableName)">{{
                $t('gen.genBtn')
              }}</el-button>

            <el-button text type="primary" @click="handleDelete(scope.row)">{{
              $t('common.delBtn')
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </el-card>

    <!-- 编辑  -->
    <edit-dialog ref="formDialogRef" @refresh="getDataList()" />

    <!-- 生成-->
    <generator-dialog ref="generatorRef" @refreshDataList="getDataList" />

  </div>
</template>

<script setup lang="ts" name="systemTable">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList, delObj, useSyncTableApi } from "/@/api/gen/table";
import { list } from '/@/api/gen/datasource'
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useI18n } from "vue-i18n";

// 引入组件
const EditDialog = defineAsyncComponent(() => import('./edit.vue'));
const GeneratorDialog = defineAsyncComponent(() => import('./generator.vue'));
const { t } = useI18n()

// 定义变量内容
const formDialogRef = ref()
const generatorRef = ref()

// 搜索变量
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([])
const multiple = ref(true)
const datasourceList = ref()

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    dsName: 'master'
  },
  pageList: fetchList,
  createdIsNeed: false
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  downBlobFile
} = useTable(state)

// 初始化数据
onMounted(() => {
  list().then(res => {
    datasourceList.value = res.data
    // 默认去第一个数据源
    state.queryForm.dsName = datasourceList.value[0].name
    getDataList()
  })
})

// 同步表数据
const syncTable = (dsName: string, tableName: string) => {
  useSyncTableApi(dsName, tableName).then(() => {
    useMessage().success(t('common.optSuccessText'));
  })
}

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
  downBlobFile('/gen/table/export', state.queryForm, 'table.xlsx')
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
