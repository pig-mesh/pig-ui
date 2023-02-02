<template>
	<div class="system-user-container layout-padding">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-card shadow="hover" class="layout-padding-auto">
          <query-tree
              @node-click="handleNodeClick"
              :placeholder="deptData.placeholder"
              :query="deptData.queryList"
          />
        </el-card>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-card shadow="hover" class="layout-padding-auto">
          <el-row v-show="showSearch">
            <div class="mb15">
              <el-input size="default" placeholder="请输入用户名称" style="max-width: 180px" v-model="state.queryForm.username"> </el-input>
              <el-button size="default" icon="search" type="primary" class="ml10" @click="getDataList">
                查询
              </el-button>
            </div>
          </el-row>
          <el-row style="margin-top: 20px">
            <div class="mb15" style="width: 100%">
              <el-button size="default" icon="folder-add" type="success" class="ml10" @click="userDialogRef.openDialog('add')">
                新增用户
              </el-button>
              <right-toolbar  v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px" @queryTable="getDataList"></right-toolbar>
            </div>
          </el-row>
          <el-table :data="state.dataList" v-loading="state.loading" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
            <el-table-column label="岗位" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-for="(item,index) in scope.row.postList" type="success" :key="index">{{item.postName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="角色" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-for="(item,index) in scope.row.roleList" type="success" :key="index">{{item.roleName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
              <template #default="scope">
                <dict-tag :options="lock_flag" :value="scope.row.lockFlag"></dict-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button  size="small" text type="primary" @click="userDialogRef.openDialog('edit', scope.row)"
                >修改</el-button
                >
                <el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              v-bind="state.pagination"
          >
          </pagination>
        </el-card>
      </el-col>
    </el-row>

		<UserDialog ref="userDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { pageList, delObj } from '/@/api/admin/user'
import { depttree } from '/@/api/admin/dept'
import {BasicTableProps, useTable} from '/@/hooks/table'
import { useDict } from '/@/hooks/dict'
import {ElMessage, ElMessageBox} from "element-plus";

// 引入组件
const UserDialog = defineAsyncComponent(() => import('./form.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'))
// @ts-ignore
const { lock_flag } = useDict('lock_flag')

// 定义变量内容
const userDialogRef = ref();

const showSearch = ref(true)

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    deptId: '',
    username: ''
  },
  pageList: pageList // H
});

// 部门树使用的数据
const deptData = reactive({
  queryList: (name:String) => {
    return depttree({
      deptName: name
    })
  },
  placeholder: '输入部门名称'
})

//  table hook
const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle
} = useTable(state)


// 点击树
const handleNodeClick = (e: any) => {
  state.queryForm.deptId = e.id
  getDataList()
}

// 删除用户
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.username}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
      // 删除用户的接口
      delObj(row.userId).then(() => {
        getDataList();
        ElMessage.success('删除成功');
      }).catch(err => {
        ElMessage.error(err.msg)
      })
		})
};
</script>
