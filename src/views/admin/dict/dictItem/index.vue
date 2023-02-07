<template>
  <el-drawer v-model="visible" title="字典项" size="80%">
    <el-card shadow="hover" class="layout-padding-auto">
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="dictformRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <right-toolbar :search='false' class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
        <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%">
          <el-table-column prop="dictType" label="类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="value" label="数据值" show-overflow-tooltip></el-table-column>
          <el-table-column prop="label" label="标签" show-overflow-tooltip></el-table-column>
          <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
          <el-table-column prop="sortOrder" label="排序" show-overflow-tooltip></el-table-column>
          <el-table-column prop="remarks" label="备注信息" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="创建日期" show-overflow-tooltip></el-table-column>

          <el-table-column :label="$t('common.action')" width="150">
            <template #default="scope">
              <el-button   text type="primary" @click="dictformRef.openDialog(scope.row)"> {{$t('common.editBtn') }}
              </el-button>
              <el-button text type="primary" @click="handleDelete(scope.row)">
                {{ $t('common.delBtn') }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination">
        </pagination>
      </el-row>
    </el-card>
    <dict-form ref="dictformRef" @refresh="getDataList"></dict-form>

  </el-drawer>
</template>

<script setup lang="ts" name="dict-item">


import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchItemList,delItemObj} from "/@/api/admin/dict";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useI18n} from "vue-i18n";

const  { t } = useI18n()
const visible = ref(false)
const DictForm = defineAsyncComponent(() => import("./form.vue"))
const dictformRef = ref()
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    dictId: ''
  },
  createdIsNeed: false,
  pageList: fetchItemList
})
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
} = useTable(state)

const handleDelete = (row: any) => {
  useMessageBox().confirm(`${t('common.delConfirmText')}：${row.name} ?`).then(() => {
    // 删除用户的接口
    delItemObj(row.id).then(() => {
      getDataList();
      useMessage().success(t('common.delSuccessText'))
    }).catch(err => {
      useMessage().error(err.msg)
    })
  })
};
const open = (row: any) => {
  state.queryForm.dictId = row.id
  visible.value = true
  getDataList()
}
// 暴露变量
defineExpose({
  open,
});
</script>

<style scoped>

</style>
