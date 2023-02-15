<template>
  <div class="layout-padding">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('sysdict.dictType')" prop="dictType">
            <el-input :placeholder="$t('sysdict.inputDictTypeTip')" v-model="state.queryForm.dictType" style="max-width: 180px" />
          </el-form-item>
          <el-form-item :label="$t('sysdict.systemFlag')" prop="systemFlag">
            <el-select v-model="state.queryForm.systemFlag"  clearable>
              <el-option v-for="(item, index) in dict_type" :label="item.label" :value="item.value"
                :key="index" ></el-option>
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
            @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%">
        <el-table-column type="index" :label="$t('sysdict.index')" width="80" />
        <el-table-column prop="dictType" :label="$t('sysdict.dictType')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="description" :label="$t('sysdict.description')" show-overflow-tooltip sortable></el-table-column>
        <el-table-column prop="systemFlag" :label="$t('sysdict.systemFlag')" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dict_type" :value="scope.row.systemFlag"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" :label="$t('sysdict.remarks')" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" :label="$t('sysdict.createTime')" show-overflow-tooltip sortable></el-table-column>

        <el-table-column :label="$t('common.action')" width="200">
          <template #default="scope">
            <el-button text type="primary" @click="onOpenEditDic('edit', scope.row)">{{ $t('common.delBtn') }}</el-button>
            <el-button text type="primary" @click="showDictITem(scope.row)">{{ $t('sysdict.dictItem') }}</el-button>
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
import { fetchList, delObj } from "/@/api/admin/dict";
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
const selectObjs = ref([])
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
// 删除操作
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach((val: any) => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(t('common.delConfirmText') + row.postId)
    .then(() => {
      delObj(row.postId).then(() => {
        getDataList();
        useMessage().success(t('common.delSuccessText'));
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    })
};
</script>
