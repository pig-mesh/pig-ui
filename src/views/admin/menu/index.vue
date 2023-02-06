<template>
	<div class="system-menu-container layout-pd">
		<el-card shadow="hover">
			<div class="mb15">
				<el-input size="default" placeholder="请输入菜单名称" style="max-width: 180px" v-model="state.queryForm.menuName"> </el-input>
				<el-button size="default" icon="search" type="primary" class="ml10" @click="getDataList">
					查询
				</el-button>
				<el-button size="default" icon="folder-add" type="success" class="ml10" @click="onOpenAddMenu">
					新增菜单
				</el-button>
			</div>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="path"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="name" label="菜单名称" show-overflow-tooltip ></el-table-column>
				<el-table-column prop="sortOrder" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
        <el-table-column label="类型" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.menuType === '0'" type="success">左菜单</el-tag>
            <el-tag v-if="scope.row.menuType === '2'" type="success">顶菜单</el-tag>
            <el-tag v-if="scope.row.menuType === '1'" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="缓冲" show-overflow-tooltip>
          <template #default="scope">
            <el-tag v-if="scope.row.keepAlive === '0'" type="info">关闭</el-tag>
            <el-tag v-if="scope.row.keepAlive === '1'" type="success">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permission" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button   text type="primary" @click="onOpenAddMenu('add')">新增</el-button>
						<el-button   text type="primary" @click="onOpenEditMenu('edit', scope.row)">修改</el-button>
						<el-button   text type="primary" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { RouteRecordRaw } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { pageList } from '/@/api/admin/menu'
import { useTable, BasicTableProps } from "/@/hooks/table";
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const menuDialogRef = ref<InstanceType<typeof MenuDialog>>();
const state: BasicTableProps = reactive<BasicTableProps>({
  pageList: pageList, // H
  queryForm: {
    menuName: ''
  },
  isPage: false
});


const {
  getDataList,
} = useTable(state)

// 打开新增菜单弹窗
const onOpenAddMenu = (type: string) => {
	menuDialogRef.value.openDialog(type);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: RouteRecordRaw) => {
	menuDialogRef.value.openDialog(type, row);
};
// 删除当前行
const onTabelRowDel = (row: RouteRecordRaw) => {
	ElMessageBox.confirm(`此操作将永久删除路由：${row.path}, 是否继续?`, '提示', {
		confirmButtonText: '删除',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then(() => {
			ElMessage.success('删除成功');
      getDataList()
		})
		.catch(() => {});
};
</script>
