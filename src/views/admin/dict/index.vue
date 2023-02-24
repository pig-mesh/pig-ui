<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('sysdict.dictType')" prop="dictType">
            <el-input :placeholder="$t('sysdict.inputDictTypeTip')" v-model="state.queryForm.dictType" style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('sysdict.systemFlag')" prop="systemFlag">
            <el-select v-model="state.queryForm.systemFlag" clearable>
              <el-option v-for="(item, index) in dict_type" :label="item.label" :value="item.value"
                :key="index"></el-option>
            </el-select>
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
          <el-button icon="folder-add" type="primary" class="ml10" @click="dicDialogRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button :disabled="multiple" icon="Delete" type="primary" class="ml10" v-auth="'sys_dict_del'"
            @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <el-button class="ml10" formDialogRef icon="refresh-left" type="primary" @click="handleRefreshCache()">
            {{ $t('common.refreshCacheBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" :selectable='handleSelectable' width="50">
        </el-table-column>
        <el-table-column type="index" :label="$t('sysdict.index')" width="80" />
        <el-table-column :label="$t('sysdict.dictType')" show-overflow-tooltip>
          <template #default="scope">
            <el-button text type="primary" @click="showDictITem(scope.row)">{{ scope.row.dictType }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="description" :label="$t('sysdict.description')"  show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="systemFlag" :label="$t('sysdict.systemFlag')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dict_type" :value="scope.row.systemFlag"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" :label="$t('sysdict.remarks')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" :label="$t('sysdict.createTime')" show-overflow-tooltip sortable></el-table-column>
        <el-table-column :label="$t('common.action')" width="200">
          <template #default="scope">
            <el-button text type="primary" @click="showDictITem(scope.row)">{{ $t('sysdict.dictItem') }}</el-button>
            <el-button text type="primary" @click="onOpenEditDic('edit', scope.row)">{{ $t('common.editBtn') }}</el-button>
            <el-tooltip :content="$t('sysdict.deleteDisabledTip')" :disabled="scope.row.systemFlag === 1"
              placement="top">
              <span style="margin-left: 12px">
                <el-button text type="primary" :disabled="scope.row.systemFlag !== 1"
                  @click="handleDelete([scope.row.id])">
                  {{ $t('common.delBtn') }}
                </el-button>
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
    </el-card>
    <DicDialog ref="dicDialogRef" @refresh="getDataList()" />
    <dict-item-dialog ref="dictItemDialogRef"></dict-item-dialog>
  </div>
</template>

<script setup lang="ts" name="systemDic">
import { BasicTableProps, useTable } from "/@/hooks/table";
import { delObj, fetchList, refreshCache } from "/@/api/admin/dict";
import { useMessage, useMessageBox } from "/@/hooks/message";
import { useDict } from "/@/hooks/dict";
import { useI18n } from "vue-i18n";
const { dict_type } = useDict('dict_type')
// 引入组件
const DicDialog = defineAsyncComponent(() => import('./form.vue'));
const DictItemDialog = defineAsyncComponent(() => import('./dictItem/index.vue'))
const { t } = useI18n()
// 定义变量内容
const dicDialogRef = ref();
const dictItemDialogRef = ref()
const queryRef = ref()
const showSearch = ref(true)
// 多选变量
const selectObjs = ref([]) as any
const multiple = ref(true)


const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList
})
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
} = useTable(state)

// 打开修改字典弹窗
const onOpenEditDic = (type: string, row: any) => {
  dicDialogRef.value.openDialog(type, row);
};

const showDictITem = (row: any) => {
  dictItemDialogRef.value.open(row)
}

// 清空搜索条件
const resetQuery = () => {
  queryRef.value.resetFields()
  state.queryForm = {}
  getDataList()
}

// 是否可以多选
const handleSelectable = (row: any) => {
  // 系统类不可多选删除
  return row.systemFlag !== '1'
}

// 多选事件
const handleSelectionChange = (objs: any) => {
  objs.forEach((val: any) => {
    selectObjs.value.push(val.id)
  });
  multiple.value = !objs.length
}
//刷新缓存
const handleRefreshCache = () =>{
   refreshCache().then(() =>{
     useMessage().success('同步成功')
  })
}

// 删除操作
const handleDelete = (ids: string[]) => {
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
