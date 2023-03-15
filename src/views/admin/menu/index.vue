<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb15">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('sysmenu.name')" prop="menuName">
						<el-input :placeholder="$t('sysmenu.inputNameTip')" clearable style="max-width: 180px" v-model="state.queryForm.menuName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" class="ml10" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="onOpenAddMenu" class="ml10" icon="folder-add" type="primary" v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table
				:data="state.dataList"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				row-key="path"
				style="width: 100%"
				v-loading="state.loading"
			>
				<el-table-column :label="$t('sysmenu.name')" fixed prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.sortOrder')" prop="sortOrder" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.icon')" prop="icon" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.icon" />
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.path')" prop="path" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.menuType')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.menuType === '0'">左菜单</el-tag>
						<el-tag type="success" v-if="scope.row.menuType === '2'">顶菜单</el-tag>
						<el-tag type="info" v-if="scope.row.menuType === '1'">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.keepAlive')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="info" v-if="scope.row.keepAlive === '0'">关闭</el-tag>
						<el-tag type="success" v-if="scope.row.keepAlive === '1'">开启</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.permission')" :show-overflow-tooltip="true" prop="permission"></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button @click="onOpenAddMenu('add', scope.row)" text type="primary" v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button @click="onOpenEditMenu('edit', scope.row)" text type="primary" v-auth="'sys_menu_edit'">{{ $t('common.editBtn') }} </el-button>

						<el-tooltip :content="$t('sysmenu.deleteDisabledTip')" :disabled="!deleteMenuDisabled(scope.row)" placement="top">
							<span style="margin-left: 12px">
								<el-button :disabled="deleteMenuDisabled(scope.row)" @click="handleDelete(scope.row)" text type="primary" v-auth="'sys_menu_del'">
									{{ $t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<MenuDialog @refresh="getDataList()" ref="menuDialogRef" />
	</div>
</template>

<script lang="ts" name="systemMenu" setup>
import { delObj, pageList } from '/@/api/admin/menu';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义变量内容
const menuDialogRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList, // H
	queryForm: {
		menuName: '',
	},
	isPage: false,
});

const { getDataList } = useTable(state);

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
	return (row.children || []).length > 0;
};

// 删除操作
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(row.id);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
