<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('sysmenu.name')" prop="menuName">
						<el-input :placeholder="$t('sysmenu.inputNameTip')" clearable style="max-width: 180px" v-model="state.queryForm.menuName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" class="ml10" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="onOpenAddMenu" class="ml10" icon="folder-add" type="primary" v-auth="'sys_menu_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button @click="handleExpand"> {{ $t('common.expandBtn') }} </el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				ref="tableRef"
				:data="state.dataList"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				row-key="path"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column :label="$t('sysmenu.name')" fixed prop="name" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.sortOrder')" prop="sortOrder" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.icon')" prop="icon" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.meta.icon" />
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.path')" prop="path" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('sysmenu.menuType')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.menuType === '0'">左菜单</el-tag>
						<el-tag v-if="scope.row.menuType === '2'">顶菜单</el-tag>
						<el-tag type="success" v-if="scope.row.menuType === '1'">按钮</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.keepAlive')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.meta.isKeepAlive">开启</el-tag>
						<el-tag type="info" v-else>关闭</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.permission')" :show-overflow-tooltip="true" prop="permission"></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="250">
					<template #default="scope">
						<el-button icon="folder-add" @click="onOpenAddMenu('add', scope.row)" text type="primary" v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button icon="edit-pen" @click="onOpenEditMenu('edit', scope.row)" text type="primary" v-auth="'sys_menu_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>

						<el-tooltip icon="delete" :content="$t('sysmenu.deleteDisabledTip')" :disabled="!deleteMenuDisabled(scope.row)" placement="top">
							<span style="margin-left: 12px">
								<el-button
									icon="delete"
									:disabled="deleteMenuDisabled(scope.row)"
									@click="handleDelete(scope.row)"
									text
									type="primary"
									v-auth="'sys_menu_del'"
								>
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
const tableRef = ref();
const menuDialogRef = ref();
const showSearch = ref(true);
const isExpand = ref(false);
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList, // H
	queryForm: {
		menuName: '',
	},
	isPage: false,
});

const { getDataList, tableStyle } = useTable(state);

// 打开新增菜单弹窗
const onOpenAddMenu = (type?: string, row?: any) => {
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

// 展开折叠树
const handleExpand = async () => {
	isExpand.value = !isExpand.value;
	const dataList = await pageList();
	toggleExpand(dataList.data, isExpand.value);
};

const toggleExpand = (children: any[], unfold = true) => {
	for (const key in children) {
		tableRef.value?.toggleRowExpansion(children[key], unfold);
		if (children[key].children) {
			toggleExpand(children[key].children!, unfold);
		}
	}
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
