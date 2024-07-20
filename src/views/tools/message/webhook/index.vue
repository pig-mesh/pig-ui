<template>
  <div>
    <el-row v-show="showSearch">
      <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
        <el-form-item label="业务名称" prop="configName">
          <el-input placeholder="请输入业务名称" v-model="state.queryForm.configName"/>
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
                   v-auth="'sys_message_add'">
          新 增
        </el-button>
        <el-button plain :disabled="multiple" icon="Delete" type="primary"
                   v-auth="'sys_message_del'" @click="handleDelete(selectObjs)">
          删除
        </el-button>
        <right-toolbar v-model:showSearch="showSearch" :export="'admin_sysMessage_export'"
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
      <el-table-column prop="configName" label="业务名称" show-overflow-tooltip/>
      <el-table-column prop="configKey" label="业务标识" show-overflow-tooltip/>
      <el-table-column prop="configValue.supplier" label="厂商" show-overflow-tooltip>
        <template #default="scope">
          {{ formDialogRef?.supplierList.find((item: any) => item.value === JSON.parse(scope.row.configValue).supplier)?.label}}
        </template>
      </el-table-column>
      <el-table-column prop="configStatus" label="启用状态" show-overflow-tooltip width="100">
        <template #default="scope">
          <dict-tag :options="yes_no_type" :value="scope.row.configStatus"></dict-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template #default="scope">
          <el-button icon="view" text type="primary" v-auth="'sys_message_edit'"
                     @click="senderDialogRef.openDialog(scope.row.id)">测试
          </el-button>
          <el-button icon="edit-pen" text type="primary" v-auth="'sys_message_edit'"
                     @click="formDialogRef.openDialog(scope.row.id)">编辑
          </el-button>
          <el-button icon="delete" text type="primary" v-auth="'sys_message_del'"
                     @click="handleDelete([scope.row.id])">删除
          </el-button>
          <el-button icon="Tickets" text type="primary" v-auth="'sys_message_del'"
                     @click="handleLog">日志
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>
    <sender-dialog ref="senderDialogRef"/>
  </div>
</template>

<script setup lang="ts" name="systemSysHookMessage">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList} from "/@/api/admin/config";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const SenderDialog = defineAsyncComponent(() => import('./sender.vue'));
const senderDialogRef = ref()

// 定义查询字典
const {yes_no_type} = useDict('yes_no_type')
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
    configType: 'webhook',
    configName: ''
  },
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
  downBlobFile('/admin/sysMessage/export', Object.assign(state.queryForm, {ids: selectObjs}), 'sysMessage.xlsx')
}

// 多选事件
const selectionChangHandle = (objs: { id: string }[]) => {
  selectObjs.value = objs.map(({id}) => id);
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

// 跳转日志
const router = useRouter();
const handleLog = () => {
  router.push({path: '/admin/log/index', query: {serviceId: 'webhook'}})
}
</script>
