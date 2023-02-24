<template>
  <div class="layout-padding">
    <el-card class="layout-padding-auto">
      <el-row v-show="showSearch" class="mb8">
        <el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
          <el-form-item :label="$t('wxFansMsg.appName')" prop="wxAccountAppid">
            <el-select v-model="state.queryForm.wxAccountAppid" :placeholder="$t('fans.appName')" clearable class="w100">
              <el-option v-for="item in accountList" :key="item.appid" :label="item.name" :value="item.appid"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('wxFansMsg.nickName')" prop="nickName">
            <el-input v-model="state.queryForm.nickName" :placeholder="t('wxFansMsg.inputNickNameTip')"
                      style="max-width: 180px"/>
          </el-form-item>
          <el-form-item :label="$t('wxFansMsg.repType')" prop="repType">
            <el-select v-model="state.queryForm.repType" :placeholder="$t('wxFansMsg.repType')" clearable class="w100">
              <el-option v-for="item in repType" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item class="ml2">
            <el-button formDialogRef icon="search" type="primary" @click="getDataList">
              {{ $t('common.queryBtn') }}
            </el-button>
            <el-button formDialogRef icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
          </el-form-item>
        </el-form>
      </el-row>
      <el-row>
        <div class="mb8" style="width: 100%">
          <el-button v-auth="'mp_wxFansMsg_export'" class="ml10" formDialogRef icon="Download" type="primary"
                     @click="exportExcel">
            {{ $t('common.exportBtn') }}
          </el-button>
          <el-button v-auth="'mp_wxmsg_del'" :disabled="multiple" class="ml10" formDialogRef icon="Delete"
                     type="primary" @click="handleDelete(selectObjs)">
            {{ $t('common.delBtn') }}
          </el-button>
          <right-toolbar v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px"
                         @queryTable="getDataList"></right-toolbar>
        </div>
      </el-row>
      <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%"
                @selection-change="handleSelectionChange" @sort-change="sortChangeHandle">
        <el-table-column align="center" type="selection" width="60"/>
        <el-table-column :label="t('wxFansMsg.index')" type="index" width="80"/>
        <el-table-column :label="t('wxFansMsg.appName')" prop="appName" show-overflow-tooltip/>
        <el-table-column :label="t('wxFansMsg.wxUserId')" prop="wxUserId" show-overflow-tooltip/>
        <el-table-column :label="t('wxFansMsg.nickName')" prop="nickName" show-overflow-tooltip/>
        <el-table-column :label="t('wxFansMsg.repMediaId')" prop="repMediaId" show-overflow-tooltip/>
        <el-table-column :label="t('wxFansMsg.content')" prop="content" show-overflow-tooltip/>
        <el-table-column :label="t('wxFansMsg.readFlag')" prop="readFlag" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="response_type" :value="scope.row.readFlag"></dict-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('wxFansMsg.createTime')" prop="createTime" show-overflow-tooltip/>
        <el-table-column :label="$t('common.action')" width="150">
          <template #default="scope">
            <el-button v-auth="'mp_wxFansMsg_edit'" text type="primary"
                       @click="formDialogRef.openDialog(scope.row.id)">{{ $t('common.editBtn') }}
            </el-button>
            <el-button v-auth="'sys_wxFansMsg_del'" text type="primary" @click="handleDelete([scope.row.id])">{{
                $t('common.delBtn')
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
    </el-card>
  </div>
</template>

<script lang="ts" name="systemWxMsg" setup>
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObjs, fetchList} from "/@/api/mp/wx-fans-msg";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {useDict} from '/@/hooks/dict';
import {useI18n} from "vue-i18n";
import {fetchAccountList} from "/@/api/mp/wx-account";

const {t} = useI18n()
// 定义查询字典

const {response_type,repType} = useDict('response_type','repType')
// 定义变量内容
const formDialogRef = ref()
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

const accountList = ref([])

const getAccountList = () => {
  fetchAccountList().then(res => {
    accountList.value = res.data
    if(accountList.value.length > 0){
      state.queryForm.wxAccountAppid = accountList.value[0].appid
      getDataList()
    }
  })
}

watch(() => state.queryForm.wxAccountAppid,() => {
  getDataList()
})

onMounted(() => {
  getAccountList()
})


// 导出excel
const exportExcel = () => {
  downBlobFile('/mp/wxFansMsg/export', state.queryForm, 'wxFansMsg.xlsx')
}

// 多选事件
const handleSelectionChange = (objs: any) => {
  objs.forEach((val: any) => {
    selectObjs.value.push(val.id)
  });
  multiple.value = !objs.length
}

// 删除操作
const handleDelete = (ids: string[]) => {
  useMessageBox().confirm(t('common.delConfirmText'))
      .then(() => {
        delObjs(ids).then(() => {
          getDataList(false);
          useMessage().success(t('common.delSuccessText'));
        }).catch((err: any) => {
          useMessage().error(err.msg)
        })
      })
};
</script>
