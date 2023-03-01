<template>
  <div class="layout-padding">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-card class="layout-padding-auto" shadow="hover">
          <query-tree :query="deptData.queryList"
                      @node-click="handleNodeClick"/>
        </el-card>
      </el-col>
      <el-col :md="20">
        <el-tabs v-model="type" @tab-click="handleClick">
          <el-tab-pane name="1" label="1">
            <template #label>关注时回复</template>
            <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%" @sort-change="sortChangeHandle">
              <el-table-column label="序号" type="index" width="80"/>
              <el-table-column label="回复消息类型" prop="repType" show-overflow-tooltip>
                <template #default="scope">
                  <dict-tag :options="dicDataRepType" :value="scope.row.repType"></dict-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="action" show-overflow-tooltip/>
            </el-table>
            <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
          </el-tab-pane>
          <el-tab-pane name="2" label="2">
            <template #label>消息回复</template>
            <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%" @sort-change="sortChangeHandle">
              <el-table-column label="序号" type="index" width="80"/>
              <el-table-column label="请求消息类型" prop="reqType" show-overflow-tooltip>
                <template #default="scope">
                  <dict-tag :options="dicDataReqType" :value="scope.row.reqType"></dict-tag>
                </template>
              </el-table-column>
              <el-table-column label="回复消息类型" prop="repType" show-overflow-tooltip>
                <template #default="scope">
                  <dict-tag :options="dicDataRepType" :value="scope.row.repType"></dict-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="action" show-overflow-tooltip/>
            </el-table>
            <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
          </el-tab-pane>
          <el-tab-pane name="3" label="3">
            <template #label>关键词回复</template>

            <el-table v-loading="state.loading" :data="state.dataList" style="width: 100%" @sort-change="sortChangeHandle">
              <el-table-column label="序号" type="index" width="80"/>
              <el-table-column label="关键词" prop="reqKey" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="匹配类型" prop="repMate" show-overflow-tooltip>
                <template #default="scope">
                  <dict-tag :options="dicRepMate" :value="scope.row.repMate"></dict-tag>
                </template>
              </el-table-column>
              <el-table-column label="匹配类型" prop="repMate" show-overflow-tooltip>
                <template #default="scope">
                  <dict-tag :options="dicDataRepType" :value="scope.row.repType"></dict-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" prop="action" show-overflow-tooltip/>
            </el-table>
            <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="wx-auto-reply">

import {fetchAccountList} from "/@/api/mp/wx-account";
import {BasicTableProps, useTable} from "/@/hooks/table";
import {fetchList} from "/@/api/mp/wx-fans-msg";

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'))

// 点击树
const handleNodeClick = (node: any) => {
  accountId.value = node.appid
}

const dicDataRepType = ref([{
  label: '文本',
  value: 'text'
}, {
  label: '图片',
  value: 'image'
}, {
  label: '语音',
  value: 'voice'
}, {
  label: '视频',
  value: 'video'
}, {
  label: '图文',
  value: 'news'
}])


const dicDataReqType = ref(
  [{
    value: 'text',
    label: '文本'
  }, {
    value: 'image',
    label: '图片'
  }, {
    value: 'voice',
    label: '语音'
  }, {
    value: 'video',
    label: '视频'
  }, {
    value: 'shortvideo',
    label: '小视频'
  }, {
    value: 'location',
    label: '地理位置'
  }, {
    value: 'link',
    label: '链接消息'
  }, {
    value: 'event',
    label: '事件推送'
  }]
)
const dicRepMate = ref([
  {
    value: '1',
    label: '全匹配'
  }, {
    value: '2',
    label: '半匹配'
  }
])

const deptData = reactive({
  queryList: () => {
    return fetchAccountList()
  }
})

const accountId = ref()

const type = ref()

const handleClick = (e: any) => {

}

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {},
  pageList: fetchList
})

const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
  sortChangeHandle,
} = useTable(state)


</script>

<style scoped>

</style>
