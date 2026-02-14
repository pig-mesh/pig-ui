<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="数据源" prop="name">
            <el-select @change="getDataList" placeholder="请选择数据源" v-model="state.queryForm.dsName">
              <el-option label="默认数据源" value="master"></el-option>
              <el-option :key="ds.id" :label="ds.name" :value="ds.name" v-for="ds in datasourceList"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('createTable.tableName')" prop="tableName">
            <el-input :placeholder="t('createTable.inputTableNameTip')" v-model="state.queryForm.tableName"/>
          </el-form-item>
          <el-form-item>
            <el-button icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" v-auth="'codegen_table_add'"
                     @click="formDialogRef.openDialog('add',null,state.queryForm.dsName)">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button plain :disabled="multiple" v-auth="'codegen_table_add'" icon="Delete" type="primary" class="ml10"
                     @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" :export="'order_createtable_export'"
                         @exportExcel="exportExcel" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
                :cell-style="tableStyle.cellStyle"
                border
                :header-cell-style="tableStyle.headerCellStyle"
                @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column type="selection" width="40" align="center"/>
        <el-table-column type="index" fixed="left" :label="t('createTable.index')" width="40"/>
        <el-table-column prop="tableName" :label="t('createTable.tableName')" show-overflow-tooltip/>
        <el-table-column prop="comments" :label="t('createTable.comments')" show-overflow-tooltip/>
        <el-table-column prop="primary" :label="t('createTable.primary')" show-overflow-tooltip>
          <template #default="scope">
            <!--  获取主键列名称-->
            {{ JSON.parse(scope.row.columnInfo).find(col => col.primary === 1)?.name }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" :label="t('createTable.createTime')" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" fixed="right" width="200">
          <template #default="scope">
            <el-button text type="primary" icon="view" @click="formDialogRef.openDialog('view', scope.row.id)">
              {{ $t('common.viewBtn') }}
            </el-button>
            <el-button icon="FolderOpened" @click="openGen(scope.row)" text type="primary">{{
                $t('gen.genBtn')
              }}
            </el-button>
            <el-button icon="edit-pen" text type="primary" v-auth="'order_createtable_edit'"
                       @click="formDialogRef.openDialog('edit', scope.row.id)">{{ $t('common.editBtn') }}
            </el-button>
            <el-button icon="delete" text type="primary" @click="handleDelete([scope.row.id])">{{
                $t('common.delBtn')
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>
  </div>
</template>

<script setup lang="ts" name="systemCreateTable">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList, delObjs} from "/@/api/gen/create-table";
import {useMessage, useMessageBox} from "/@/hooks/message";

import {useI18n} from "vue-i18n";
import {list} from "/@/api/gen/datasource";
import {useSyncTableApi, useTableApi} from "/@/api/gen/table";
import {validateNull} from "/@/utils/validate";

const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const {t} = useI18n()
const formDialogRef = ref()
const datasourceList = ref();
const router = useRouter();
const queryRef = ref()
const showSearch = ref(true)
const selectObjs = ref([]) as any
const multiple = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
  },
  pageList: fetchList,
  descs: ["create_time"]
})

const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
  downBlobFile,
  tableStyle
} = useTable(state)

const resetQuery = () => {
  queryRef.value?.resetFields()
  selectObjs.value = []
  getDataList()
}

const exportExcel = () => {
  downBlobFile('/order/create-table/export', state.queryForm, 'create-table.xlsx')
}

const handleSelectionChange = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({id}) => id);
  multiple.value = !objs.length;
};

const handleDelete = async (ids: string[]) => {
  try {
    await useMessageBox().confirm(t('common.delConfirmText'));
  } catch {
    return;
  }

  try {
    await delObjs(ids);
    getDataList();
    useMessage().success(t('common.delSuccessText'));
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

/**
 * 打开生成代码页面
 * @param row
 */
const openGen = (row: { tableName: string }) => {
  useTableApi(state.queryForm.dsName, row.tableName)
      .then((res) => {
        if (validateNull(res.data.fieldList)) {
          useSyncTableApi(state.queryForm.dsName, row.tableName);
        }
      })
      .finally(() => {
        router.push({
          path: '/gen/gener/index',
          query: {
            tableName: row.tableName,
            dsName: state.queryForm.dsName,
          },
        });
      });
};

// 初始化数据
onMounted(() => {
  list().then((res) => {
    datasourceList.value = res.data;
    // 默认去第一个数据源
    state.queryForm.dsName = datasourceList.value[0]?.name || 'master';
    getDataList();
  });
});
</script>
