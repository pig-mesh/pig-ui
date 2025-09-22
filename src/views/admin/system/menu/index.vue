<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('sysmenu.name')" prop="menuName">
						<el-input :placeholder="$t('sysmenu.inputNameTip')" clearable style="max-width: 180px" v-model="state.queryForm.menuName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="query" class="ml10" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="onOpenAddMenu" class="ml10" icon="folder-add" type="primary" v-auth="'sys_menu_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="resetQuery"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				ref="tableRef"
				:data="tableList"
				lazy
				:load="load"
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				row-key="id"
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
		<MenuDialog @refresh="handleRefresh" ref="menuDialogRef" />
	</div>
</template>

<script lang="ts" name="systemMenu" setup>
import { onMounted, nextTick } from 'vue';
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
const queryRef = ref();
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList, // H
	queryForm: {
		parentId: '-1',
		menuName: '',
	},
	isPage: false,
});

// 用于记录已展开的树节点信息，实现懒加载数据刷新
const treeNodeMap = new Map();

const { getDataList, tableStyle } = useTable(state);

// 根据类型判断是否有子节点
const setHasChildren = (arr: any[]) => {
	arr.forEach((item) => {
		// 添加 hasChildren 属性
		item.hasChildren = item.menuType !== '1';
	});
};
const tableList = computed(() => {
	const list = state.dataList;
	if (Array.isArray(list)) {
		setHasChildren(list);
	}
	return list;
});

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

// 搜索事件
const query = () => {
	state.dataList = [];
	state.queryForm.parentId = state.queryForm.menuName ? undefined : '-1';
	getDataList();
};

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	state.dataList = [];
	state.queryForm.parentId = '-1';
	getDataList();
};

const load = (row: any, treeNode: unknown, resolve: (date: any[]) => void) => {
	const param = {
		parentId: row.id,
	};
	
	// 在节点展开加载数据时记录treeNode节点，用于后续刷新
	treeNodeMap.set(row.id, { row, treeNode, resolve });
	
	pageList(param)
		.then((res) => {
			const childrenList = res.data || [];
			if (Array.isArray(childrenList)) {
				setHasChildren(childrenList);
			}
			resolve(childrenList);
		})
		.catch(() => {
			// Handle API error by resolving with empty array
			resolve([]);
		});
};

// 刷新指定父节点的子数据
const refreshTreeNode = (parentId: any) => {
	if (treeNodeMap.has(parentId)) {
		const { row, treeNode, resolve } = treeNodeMap.get(parentId);
		if (row && treeNode && resolve) {
			// 清空子节点数据和状态
			if (treeNode && treeNode.childNodes) {
				treeNode.childNodes.splice(0);
			}
			if (row.children) {
				row.children.splice(0);
			}
			
			// 重置节点加载状态
			if (treeNode) {
				treeNode.loaded = false;
				treeNode.loading = false;
				treeNode.expanded = true; // 保持展开状态
			}
			
			// 清理Element Plus内部的懒加载缓存
			if (tableRef.value && tableRef.value.store) {
				const store = tableRef.value.store;
				// 清除懒加载节点映射
				if (store.states && store.states.lazyTreeNodeMap) {
					delete store.states.lazyTreeNodeMap.value[row.id];
				}
				// 清除树节点映射
				if (store.states && store.states.treeData) {
					const treeData = store.states.treeData.value;
					if (treeData[row.id]) {
						delete treeData[row.id].children;
					}
				}
			}
			
			// 延时重新加载，确保UI更新
			nextTick(() => {
				load(row, treeNode, resolve);
			});
			
			// 强制刷新表格显示（备用方案）
			nextTick(() => {
				if (tableRef.value && tableRef.value.$forceUpdate) {
					tableRef.value.$forceUpdate();
				}
			});
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

		// 如果删除的是子节点，则刷新其父节点的子数据
		if (row.parentId && row.parentId !== '-1') {
			refreshTreeNode(row.parentId);
		} else {
			// 如果删除的是根节点，则刷新整个表格
			getDataList();
		}
		
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 处理新增/编辑后的刷新回调
const handleRefresh = (refreshInfo?: any) => {
	if (!refreshInfo) {
		// 如果没有传递刷新信息，则刷新整个表格
		getDataList();
		return;
	}

	if (refreshInfo.isEdit) {
		// 编辑操作：需要考虑父节点是否发生变化
		const originalParentId = refreshInfo.originalParentId;
		const currentParentId = refreshInfo.currentParentId;
		
		if (originalParentId !== currentParentId) {
			// 父节点发生变化，需要刷新两个父节点
			if (originalParentId && originalParentId !== '-1') {
				refreshTreeNode(originalParentId);
			}
			if (currentParentId && currentParentId !== '-1') {
				refreshTreeNode(currentParentId);
			}
			// 如果移动到根节点或从根节点移出，刷新整个表格
			if (originalParentId === '-1' || currentParentId === '-1') {
				getDataList();
			}
		} else {
			// 父节点未变化，只刷新当前父节点
			if (currentParentId && currentParentId !== '-1') {
				refreshTreeNode(currentParentId);
			} else {
				// 根节点编辑，刷新整个表格
				getDataList();
			}
		}
	} else {
		// 新增操作：只需要刷新父节点
		const parentId = refreshInfo.parentId;
		if (parentId && parentId !== '-1') {
			refreshTreeNode(parentId);
		} else {
			// 新增根节点，刷新整个表格
			getDataList();
		}
	}
};

// 页面加载时获取数据
onMounted(() => {
	getDataList();
});
</script>
