<template>
	<div class="system-user-container layout-padding">
    <el-row :gutter="20">
      <el-col :span="4" :xs="24">
        <el-card shadow="hover" class="layout-padding-auto">
          <div class="head-container">
            <el-input
                v-model="deptData.search.deptName"
                placeholder="请输入部门名称"
                clearable
                prefix-icon="Search"
                style="margin-bottom: 20px"
                @change="getDeptTree"
            />
          </div>
          <div class="head-container">
            <el-tree
                :data="deptData.deptList"
                :props="{ label: 'name', children: 'children',value: 'id' }"
                :expand-on-click-node="false"
                ref="deptTreeRef"
                :loading="deptData.loading"
                node-key="id"
                highlight-current
                default-expand-all
                @node-click="handleNodeClick"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-card shadow="hover" class="layout-padding-auto">
          <div class="system-user-search mb15">
            <el-input size="default" placeholder="请输入用户名称" style="max-width: 180px" v-model="state.search.username"> </el-input>
            <el-button size="default" type="primary" class="ml10" @click="getTableData">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddUser('add')">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增用户
            </el-button>
          </div>
          <el-table :data="state.tableData.data" v-loading="state.tableData.loading" style="width: 100%">
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="phone" label="手机号" show-overflow-tooltip></el-table-column>
            <el-table-column label="岗位" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-for="(item,index) in scope.row.postList" type="success">{{item.postName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="角色" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-for="(item,index) in scope.row.roleList" type="success">{{item.roleName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" show-overflow-tooltip>
              <template #default="scope">
                <el-tag v-if="scope.row.lockFlag === '0'" type="success">有效</el-tag>
                <el-tag v-if="scope.row.lockFlag === '9'" type="success">锁定</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onOpenEditUser('edit', scope.row)"
                >修改</el-button
                >
                <el-button :disabled="scope.row.userName === 'admin'" size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
              @size-change="onHandleSizeChange"
              @current-change="onHandleCurrentChange"
              class="mt15"
              :pager-count="5"
              :page-sizes="[10, 20, 30]"
              v-model:current-page="state.tableData.param.pageNum"
              background
              v-model:page-size="state.tableData.param.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="state.tableData.total"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>

		<UserDialog ref="userDialogRef" @refresh="getTableData()" />
	</div>
</template>

<script setup lang="ts" name="systemUser">
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { pageList, delObj } from '/@/api/admin/user'
import { depttree } from '/@/api/admin/dept'

// 引入组件
const UserDialog = defineAsyncComponent(() => import('/@/views/system/user/dialog.vue'));

// 定义变量内容
const userDialogRef = ref();
const state = reactive({
	tableData: {
		data: [],
		total: 0,
		loading: false,
		param: {
			pageNum: 1,
			pageSize: 10,
		},
	},
  search: {
    deptId: '',
    username: ''
  }
});

const search = reactive({
  deptName: ''
})
const deptData = reactive({
  deptList: [],
  search: {
    deptName: ''
  },
  loading: false
})

// 初始化表格数据
const getTableData = () => {
	state.tableData.loading = true;
  pageList(state.search).then(res => {
    state.tableData.data = res.data.records;
    state.tableData.total = res.data.total;
    state.tableData.loading = false;
  }).catch(err => {
    ElMessage.error(err.msg)
    state.tableData.loading = false;
  })
};

// 获取部门数据

const getDeptTree = () => {
  deptData.loading = true
  depttree(deptData.search).then(res => {
    deptData.deptList = res.data
  }).catch(err => {
    ElMessage.error(err.msg)
  }).finally(() => {
    deptData.loading = false
  })

}

// 点击数
const handleNodeClick = (e: any) => {
  state.search.deptId = e.id
  getTableData()
}


// 打开新增用户弹窗
const onOpenAddUser = (type: string) => {
	userDialogRef.value.openDialog(type);
};
// 打开修改用户弹窗
const onOpenEditUser = (type: string, row: any) => {
	userDialogRef.value.openDialog(type, row);
};
// 删除用户
const onRowDel = (row: any) => {
	ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.username}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
      // 删除用户的接口
      delObj(row.userId).then(res => {
        getTableData();
        ElMessage.success('删除成功');
      }).catch(err => {
        ElMessage.error(err.msg)
      })
		})
};
// 分页改变
const onHandleSizeChange = (val: number) => {
	state.tableData.param.pageSize = val;
	getTableData();
};
// 分页改变
const onHandleCurrentChange = (val: number) => {
	state.tableData.param.pageNum = val;
	getTableData();
};
// 页面加载时
onMounted(() => {
	getTableData();
  getDeptTree();
});
</script>

<style scoped lang="scss">
.system-user-container {
	:deep(.el-card__body) {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
		.el-table {
			flex: 1;
		}
	}
}
</style>
