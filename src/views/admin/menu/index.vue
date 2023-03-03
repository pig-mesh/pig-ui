<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb15">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('sysmenu.name')" prop="menuName">
						<el-input :placeholder="$t('sysmenu.inputNameTip')" style="max-width: 180px" clearable
							v-model="state.queryForm.menuName" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" class="ml10" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="folder-add" type="primary" class="ml10" @click="onOpenAddMenu"
							v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table :data="state.dataList" v-loading="state.loading" style="width: 100%" row-key="path"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
				<el-table-column prop="name" :label="$t('sysmenu.name')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="sortOrder" :label="$t('sysmenu.sortOrder')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="icon" :label="$t('sysmenu.icon')" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.icon" />
					</template>
				</el-table-column>
				<el-table-column prop="path" :label="$t('sysmenu.path')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.menuType')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.menuType === '0'" type="success">左菜单</el-tag>
						<el-tag v-if="scope.row.menuType === '2'" type="success">顶菜单</el-tag>
						<el-tag v-if="scope.row.menuType === '1'" type="info">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.keepAlive')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.keepAlive === '0'" type="info">关闭</el-tag>
						<el-tag v-if="scope.row.keepAlive === '1'" type="success">开启</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="permission" :label="$t('sysmenu.permission')"
					:show-overflow-tooltip="true"></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button text type="primary" @click="onOpenAddMenu('add', scope.row)" v-auth="'sys_menu_add'"> {{
							$t('common.addBtn')
						}}</el-button>
						<el-button text type="primary" @click="onOpenEditMenu('edit', scope.row)"
							v-auth="'sys_menu_edit'">{{ $t('common.editBtn') }}</el-button>

						<el-tooltip :content="$t('sysmenu.deleteDisabledTip')" :disabled="!deleteMenuDisabled(scope.row)"
							placement="top">
							<span style="margin-left: 12px">
								<el-button text type="primary" :disabled="deleteMenuDisabled(scope.row)"
									@click="onTabelRowDel(scope.row)" v-auth="'sys_menu_del'">
									{{ $t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<MenuDialog ref="menuDialogRef" @refresh="getDataList()" />
	</div>
</template>

<script setup lang="ts" name="systemMenu">
import { pageList, delObj } from '/@/api/admin/menu'
import { useTable, BasicTableProps } from "/@/hooks/table";
import { useMessage, useMessageBox } from "/@/hooks/message";
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));

// 定义变量内容
const menuDialogRef = ref();
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
const onOpenAddMenu = (type: string, row?: any) => {
	menuDialogRef.value.openDialog(type, row);
};
// 打开编辑菜单弹窗
const onOpenEditMenu = (type: string, row: any) => {
	menuDialogRef.value.openDialog(type, row);
};

//是否禁用删除
const deleteMenuDisabled = (row: any) => {
	return (row.children || []).length > 0
}

// 删除当前菜单
const onTabelRowDel = (row: any) => {
	useMessageBox().confirm(`此操作将永久删除：${row.name}`)
		.then(() => {
			delObj(row.id).then(() => {
				useMessage().success('删除成功');
				getDataList()
			}).catch((err: any) => {
				useMessage().error(err.msg)
			});
		})
};
</script>
