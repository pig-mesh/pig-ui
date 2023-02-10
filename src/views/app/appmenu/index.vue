<template>
	<div class="layout-padding">
		<el-card shadow="hover">
			<div class="mb15">
				<el-input :placeholder="$t('appmenu.inputNameTip')" style="max-width: 180px"
					v-model="state.queryForm.menuName"> </el-input>
				<el-button icon="search" type="primary" class="ml10" @click="getDataList">
					{{ $t('common.queryBtn') }}
				</el-button>
				<el-button icon="folder-add" type="primary" class="ml10" @click="onOpenAddMenu" v-auth="'sys_menu_add'">
					{{ $t('common.addBtn') }}
				</el-button>
			</div>
			<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" row-key="path"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
				<el-table-column prop="name" :label="$t('appmenu.name')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sortOrder" :label="$t('appmenu.sortOrder')"
					show-overflow-tooltip></el-table-column>
				<el-table-column prop="path" :label="$t('appmenu.path')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('appmenu.menuType')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.menuType === '0'" type="success">页面</el-tag>
						<el-tag v-if="scope.row.menuType === '2'" type="success">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('appmenu.visible')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.visible === '0'" type="info">关闭</el-tag>
						<el-tag v-if="scope.row.visible === '1'" type="success">开启</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="permission" :label="$t('appmenu.permission')"
					:show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button text type="primary" @click="onOpenAddMenu('add')" v-auth="'sys_menu_add'"> {{
							$t('common.addBtn')
						}}</el-button>
						<el-button text type="primary" @click="onOpenEditMenu('edit', scope.row)"
							v-auth="'sys_menu_edit'">{{ $t('common.editBtn') }}</el-button>
						<el-button text type="primary" @click="onTabelRowDel(scope.row)" v-auth="'sys_menu_del'">{{
							$t('common.delBtn')
						}}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<MenuDialog ref="menuDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { RouteRecordRaw } from 'vue-router';
import { pageList, delObj } from '/@/api/app/appmenu'
import { useTable, BasicTableProps } from "/@/hooks/table";
import { useMessage, useMessageBox } from "/@/hooks/message";
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
const onTabelRowDel = (row: any) => {
	useMessageBox().confirm(`此操作将永久删除路由：${row.name}`)
		.then(() => {
			delObj(row.id).then(() => {
				useMessage().success('删除成功');
				getDataList()
			})

		})
		.catch(() => { });
};
</script>
