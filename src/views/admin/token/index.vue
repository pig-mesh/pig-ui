<template>
  <div class="layout-padding">

    <el-card class="layout-padding-auto" shadow="hover">
      <el-row v-show="showSearch" class="mb8">
        <el-form :model="state.queryForm" ref="queryRef" :inline="true">
          <el-form-item :label="$t('systoken.username')" prop="username">
            <el-input v-model="state.queryForm.username" :placeholder="$t('systoken.inputUsernameTip')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
            <el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button size="default" :disabled="multiple" icon="Delete" type="primary" class="ml10"
            v-auth="'sys_user_del'" @click="handleDelete(undefined)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
            @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%"
        @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column align="center" type="selection" width="50" />
        <el-table-column :label="$t('systoken.index')" type="index" width="80" />
        <el-table-column :label="$t('systoken.userId')" prop="userId" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('systoken.username')" prop="username" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('systoken.clientId')" prop="clientId" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('systoken.accessToken')" prop="accessToken" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('systoken.expiresAt')" prop="expiresAt" show-overflow-tooltip></el-table-column>
        <el-table-column :label="$t('common.action')" width="100">
          <template #default="scope">
            <el-button v-auth="'sys_user_del'" size="small" text type="primary" @click="handleDelete(scope.row)">
              {{ $t('common.delBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle">
      </pagination>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { BasicTableProps, useTable } from "/@/hooks/table";
import { fetchList,delObj } from "/@/api/admin/token";
import { useI18n } from 'vue-i18n'
import { useMessage, useMessageBox } from "/@/hooks/message";

const { t } = useI18n()
// 定义变量内容
const queryRef = ref();
const showSearch = ref(true)

// 多选rows
const selectObjs = ref([]);
// 是否可以多选
const multiple = ref(true);


const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    username: ''
  },
  pageList: fetchList
});


//  table hook
const {
  getDataList,
  currentChangeHandle,
  sortChangeHandle,
  sizeChangeHandle
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


// 删除数据
const handleDelete = (row: any) => {
  if (!row) {
    selectObjs.value.forEach(val => {
      handleDelete(val)
    });
    return
  }

  useMessageBox().confirm(`${t('common.delConfirmText')}：${row.username} ?`).then(() => {
    // 删除用户的接口
    delObj(row.accessToken).then(() => {
      getDataList();
      useMessage().success(t('common.delSuccessText'))
    }).catch(err => {
      useMessage().error(err.msg)
    })
  })
};
</script>

<style scoped>

</style>
