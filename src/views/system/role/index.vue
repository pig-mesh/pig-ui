<template>
	<div class="system-role-container layout-padding">
		<div class="system-role-padding layout-padding-auto layout-padding-view">
      <el-row v-show="showSearch">
        <div class="mb15">
          <el-input size="default" placeholder="请输入角色名称" style="max-width: 180px" v-model="state.queryForm.roleName"> </el-input>
          <el-button size="default" icon="search" type="primary" class="ml10" @click="getDataList">
            查询
          </el-button>
        </div>
      </el-row>
      <el-row style="margin-top: 20px">
        <div class="mb15" style="width: 100%">
          <el-button size="default" icon="folder-add" type="success" class="ml10" @click="roleDialogRef.openDialog('add')">
            新增用户
          </el-button>
          <right-tool-bar  v-model:showSearch="showSearch" class="ml10" style="float: right;margin-right: 20px" @queryTable="getDataList"></right-tool-bar>
        </div>
      </el-row>
			<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%">
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="roleName" label="角色名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleCode" label="角色标识" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleDesc" label="角色描述" show-overflow-tooltip></el-table-column>
				<el-table-column label="数据权限" show-overflow-tooltip>
          <template #default="scope">
            <dict-tag :options="dictType" :value="scope.row.dsType"></dict-tag>
          </template>
        </el-table-column>
				<el-table-column prop="createTime" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="100">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="roleDialogRef.openDialog('edit', scope.row);">修改</el-button>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
      <pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          v-bind="state.pagination"
      />
		</div>
		<RoleDialog ref="roleDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemRole">
import {defineAsyncComponent, reactive, ref, Ref} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import {BasicTableProps, useTable} from "/@/hooks/table";
import { pageList } from "/@/api/admin/role";

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('./form.vue'));
const DictTag  = defineAsyncComponent(() => import("/@/components/DictTag/index.vue"))
// 定义变量内容
const roleDialogRef = ref();

const showSearch : Ref<Boolean> = ref(true)

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    roleName: ''
  },
  pageList: pageList // H
});

const dictType = ref([{
  label: '全部',
  value: '0'
}, {
  label: '自定义',
  value: '1'
}, {
  label: '本级及子级',
  value: '2'
}, {
  label: '本级',
  value: '3'
}])

//  table hook
const {
  RightToolBar,
  pagination,
  getDataList,
  currentChangeHandle,
  sizeChangeHandle
} = useTable(state)

// 删除角色
const onRowDel = (row: RowRoleType) => {
	ElMessageBox.confirm(`此操作将永久删除角色名称：“${row.roleName}”，是否继续?`, '提示', {
		confirmButtonText: '确认',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {

			getDataList();
			ElMessage.success('删除成功');
		})
		.catch(() => {});
};
</script>

<style scoped lang="scss">
.system-role-container {
	.system-role-padding {
		padding: 15px;
		.el-table {
			flex: 1;
		}
	}
}
</style>
