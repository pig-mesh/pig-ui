<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
          <el-form-item label="标题" prop="title">
            <el-input placeholder="请输入标题" v-model="state.queryForm.title"/>
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
        <el-table-column prop="category" label="分类" show-overflow-tooltip width="100">
          <template #default="scope">
            <dict-tag :options="message_type" :value="scope.row.category"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" show-overflow-tooltip/>
        <el-table-column prop="allFlag" label="全部通知" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="yes_no_type" :value="scope.row.allFlag"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sendFlag" label="已发送" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="yes_no_type" :value="scope.row.sendFlag"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" show-overflow-tooltip/>
        <el-table-column label="操作" width="300">
          <template #default="scope">
            <el-button icon="view" text type="primary" @click="contentRef.openDialog(scope.row)">详情
            </el-button>
            <el-button icon="BellFilled" text type="primary" v-auth="'sys_message_edit'"
                       v-if="scope.row.sendFlag !== '1'"
                       @click="handleSend(scope.row.id)">群发
            </el-button>
            <el-button icon="edit-pen" text type="primary" v-auth="'sys_message_edit'"
                       v-if="scope.row.sendFlag === '0'"
                       @click="formDialogRef.openDialog(scope.row.id)">编辑
            </el-button>
            <el-button icon="delete" text type="primary" v-auth="'sys_message_del'"
                       @click="handleDelete([scope.row.id])">删除
            </el-button>
            <el-button icon="List" text type="primary" v-auth="'sys_message_edit'"
                       v-if="scope.row.sendFlag === '1'"
                       @click="receiveRef.openDialog(scope.row.id)">接收情况
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination"/>
    </div>

    <!-- 编辑、新增  -->
    <form-dialog ref="formDialogRef" @refresh="getDataList(false)"/>

    <!-- 消息内容 -->
    <news-content ref="contentRef"/>

    <!-- 接收列表 -->
    <receive ref="receiveRef"/>
  </div>
</template>

<script setup lang="ts" name="systemSysMessage">
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList, sendObj} from "/@/api/admin/message";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const Receive = defineAsyncComponent(() => import('./receive.vue'));
const NewsContent = defineAsyncComponent(() => import('/@/views/home/news/content.vue'));
// 定义查询字典
const {message_type, yes_no_type} = useDict('message_type', 'yes_no_type')
// 定义变量内容
const formDialogRef = ref()
// 搜索变量
const queryRef = ref()
const receiveRef = ref()
const contentRef = ref()
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

// 推送给目标用户
const handleSend = async (id: string) => {
  try {
    await useMessageBox().confirm('此操作将消息推送给目标用户');
  } catch {
    return;
  }

  try {
    await sendObj({id: id});
    getDataList();
    useMessage().success('推送成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};
</script>
