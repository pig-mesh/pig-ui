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
					<el-button @click="onOpenMenuDialog" class="ml10" icon="folder-add" type="primary" v-auth="'sys_menu_add'">
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
				:row-class-name="getMenuRowClassName"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="menuTableCellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column type="index" width="52" align="center" fixed>
					<template #header>
						<span class="sort-header-placeholder"></span>
					</template>
					<template #default>
						<el-icon class="sort-handle" :class="{ 'is-disabled': state.queryForm.menuName }">
							<Rank />
						</el-icon>
					</template>
				</el-table-column>
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

						<el-tag v-if="scope.row.menuType === '0'">{{ $t('sysmenu.menuTypeLeft') }}</el-tag>
						<el-tag v-if="scope.row.menuType === '2'">{{ $t('sysmenu.menuTypeTop') }}</el-tag>
						<el-tag type="success" v-if="scope.row.menuType === '1'">{{ $t('sysmenu.menuTypeButton') }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.keepAlive')" show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.meta.isKeepAlive">{{ $t('sysmenu.keepAliveOn') }}</el-tag>
						<el-tag type="info" v-else>{{ $t('sysmenu.keepAliveOff') }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('sysmenu.permission')" :show-overflow-tooltip="true" prop="permission"></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="320">
					<template #default="scope">
						<el-button icon="folder-add" @click="onOpenMenuDialog('add', scope.row)" text type="primary" v-auth="'sys_menu_add'">
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button icon="edit-pen" @click="onOpenMenuDialog('edit', scope.row)" text type="primary" v-auth="'sys_menu_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>
						<template v-if="scope.row.menuType === '0' && customHomePageEnable">
							<el-button
								v-if="scope.row.isHomePage === '1'"
								icon="HomeFilled"
								@click="handleSetHomePage(scope.row)"
								text
								type="success"
								v-auth="'sys_menu_edit'"
							>
								{{ $t('sysmenu.currentHomePage') }}
							</el-button>
							<el-button
								v-else
								icon="HomeFilled"
								@click="handleSetHomePage(scope.row)"
								text
								type="primary"
								v-auth="'sys_menu_edit'"
							>
								{{ $t('sysmenu.setHomePage') }}
							</el-button>
						</template>
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
import { delObj, pageList, setHomePage, sortMenu } from '/@/api/admin/menu';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDebounceFn } from '@vueuse/core';
import { Rank } from '@element-plus/icons-vue';
import Sortable from 'sortablejs';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();

// 自定义首页功能开关
const customHomePageEnable = import.meta.env.VITE_CUSTOM_HOMEPAGE_ENABLE === 'true';

// 定义变量内容
const tableRef = ref();
const menuDialogRef = ref();
const showSearch = ref(true);
const queryRef = ref();
const sortableRef = shallowRef<Sortable | null>(null);
const blockedSortMove = shallowRef(false);

/**
 * 表格状态配置
 * @property {Function} pageList - 数据加载方法
 * @property {Object} queryForm - 查询表单数据
 * @property {string} queryForm.parentId - 父节点ID，默认为 '-1' 表示根节点
 * @property {string} queryForm.menuName - 菜单名称搜索关键词
 * @property {boolean} isPage - 是否分页，菜单树不分页
 */
const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	queryForm: {
		parentId: '-1',
		menuName: '',
	},
	isPage: false,
});

/**
 * 树节点映射表
 * @description 记录已展开的树节点信息，用于懒加载数据刷新
 * @type {Map<string, {row: any, treeNode: any, resolve: Function}>}
 */
const treeNodeMap = new Map();

/**
 * 加载状态指示集合
 * @description 用于 UI 展示加载状态
 * @type {Ref<Set<string>>}
 */
const loadingNodes = ref(new Set());

/**
 * 并发控制集合
 * @description 防止同一节点被重复加载
 * @type {Set<string>}
 */
const loadingSet = new Set();

const { getDataList, tableStyle } = useTable(state);

// 树形展开图标渲染在 name 列，保持左对齐避免列宽变化后层级缩进错位。
const menuTableCellStyle = ({ column }: { column: { property?: string } }) => {
	if (column.property === 'name') {
		return { ...tableStyle.cellStyle, textAlign: 'left' };
	}
	return tableStyle.cellStyle;
};

/**
 * 根据菜单类型设置是否有子节点
 * @description 菜单类型为 '1' (按钮) 时没有子节点，其他类型可能有子节点
 * @param {any[]} arr - 菜单数据数组
 */
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

const getLazyChildrenMap = () => tableRef.value?.store?.states?.lazyTreeNodeMap?.value || {};

const getRowKey = (row: any) => String(row?.id);

const getMenuRowClassName = ({ row }: { row: any }) => `menu-sort-row menu-sort-row-${getRowKey(row)}`;

const getRowKeyFromElement = (element?: HTMLElement) => {
	const rowClass = Array.from(element?.classList || []).find((className) => className.startsWith('menu-sort-row-'));
	return rowClass?.replace('menu-sort-row-', '');
};

const getSortableTbody = () => {
	const handle = tableRef.value?.$el?.querySelector('.sort-handle');
	return handle?.closest('tbody') || tableRef.value?.$el?.querySelector('.el-table__body-wrapper tbody');
};

const collectRows = (rows: any[], rowMap = new Map<string, any>()) => {
	rows.forEach((row) => {
		rowMap.set(getRowKey(row), row);
		const lazyChildren = getLazyChildrenMap()[row.id];
		if (Array.isArray(lazyChildren)) {
			collectRows(lazyChildren, rowMap);
		}
		if (Array.isArray(row.children)) {
			collectRows(row.children, rowMap);
		}
	});
	return rowMap;
};

const findRowByKey = (key: string) => collectRows(state.dataList || []).get(key);

const getSiblingRows = (parentId: any) => {
	if (!parentId || String(parentId) === '-1') {
		return state.dataList || [];
	}
	return getLazyChildrenMap()[parentId] || treeNodeMap.get(parentId)?.row?.children || [];
};

const getOrderedSiblingRows = (parentId: any) => {
	const tbody = getSortableTbody();
	const rows = Array.from(tbody?.querySelectorAll('tr.menu-sort-row') || []) as HTMLElement[];
	const orderedRows = rows
		.map((row) => findRowByKey(getRowKeyFromElement(row) || ''))
		.filter((row) => row && String(row.parentId) === String(parentId));

	const siblingRows = getSiblingRows(parentId);
	if (orderedRows.length !== siblingRows.length) {
		return siblingRows;
	}
	return orderedRows;
};

/**
 * 打开新增/编辑菜单弹窗
 * @param {string} [type] - 操作类型
 * @param {any} [row] - 当前行数据（新增时作为父节点，编辑时为要编辑的数据）
 */
const onOpenMenuDialog = (type?: string, row?: any) => {
	menuDialogRef.value.openDialog(type, row);
};

const canMoveMenuRow = (event: Sortable.MoveEvent) => {
	if (state.queryForm.menuName) {
		return false;
	}

	const draggedKey = getRowKeyFromElement(event.dragged);
	const relatedKey = getRowKeyFromElement(event.related);
	const draggedRow = draggedKey ? findRowByKey(draggedKey) : undefined;
	const relatedRow = relatedKey ? findRowByKey(relatedKey) : undefined;
	const canMove = Boolean(draggedRow && relatedRow && String(draggedRow.parentId) === String(relatedRow.parentId));

	if (!canMove) {
		blockedSortMove.value = true;
	}
	return canMove;
};

const handleSortEnd = async (event: Sortable.SortableEvent) => {
	if (blockedSortMove.value) {
		blockedSortMove.value = false;
		useMessage().warning('仅支持同级菜单排序');
		nextTick(initMenuSortable);
		return;
	}

	if (state.queryForm.menuName) {
		return;
	}

	const rowKey = getRowKeyFromElement(event.item);
	const dragRow = rowKey ? findRowByKey(rowKey) : undefined;
	if (!dragRow) {
		return;
	}

	const parentId = dragRow.parentId || '-1';
	const siblingRows = getSiblingRows(parentId);
	const orderedRows = getOrderedSiblingRows(parentId);
	const previousIds = siblingRows.map((row) => getRowKey(row)).join(',');
	const orderedIds = orderedRows.map((row) => getRowKey(row)).join(',');

	if (previousIds === orderedIds) {
		nextTick(initMenuSortable);
		return;
	}

	try {
		await sortMenu({
			parentId,
			menuIds: orderedRows.map((row) => row.id),
		});
		useMessage().success(t('common.optSuccessText'));
		if (String(parentId) === '-1') {
			getDataList();
		} else {
			refreshTreeNodeInternal(parentId);
		}
	} catch (err: any) {
		if (String(parentId) === '-1') {
			getDataList();
		} else {
			refreshTreeNodeInternal(parentId);
		}
		useMessage().error(err?.msg || t('common.optFailText'));
	} finally {
		nextTick(initMenuSortable);
	}
};

const initMenuSortable = () => {
	sortableRef.value?.destroy();
	sortableRef.value = null;

	const tbody = getSortableTbody();
	if (!tbody) return;

	sortableRef.value = Sortable.create(tbody, {
		handle: '.sort-handle',
		animation: 300,
		disabled: Boolean(state.queryForm.menuName),
		onMove: canMoveMenuRow,
		onEnd: handleSortEnd,
	});
};

/**
 * 保护菜单ID（防误删）
 */
const protectedDeleteMenuIds = ['1000', '2000'];

/**
 * 判断删除按钮是否禁用
 * @description 有子节点的菜单不允许删除；内置菜单（1000/2000）不允许删除
 * @param {any} row - 菜单行数据
 * @returns {boolean} true-禁用删除，false-允许删除
 */
const deleteMenuDisabled = (row: any) => {
	const menuId = String(row?.id);
	return (row.children || []).length > 0 || protectedDeleteMenuIds.includes(menuId);
};

/**
 * 搜索菜单
 * @description 如果有搜索关键词，则搜索所有层级；否则只加载根节点
 */
const query = () => {
	state.dataList = [];
	state.queryForm.parentId = state.queryForm.menuName ? undefined : '-1';
	getDataList();
};

/**
 * 重置搜索条件
 * @description 清空搜索表单并重新加载根节点数据
 */
const resetQuery = () => {
	queryRef.value.resetFields();
	state.dataList = [];
	state.queryForm.parentId = '-1';
	getDataList();
};

/**
 * 懒加载树节点的子数据
 * @description Element Plus 树表格的懒加载方法，支持缓存、并发控制和错误重试
 * @param {any} row - 当前行数据
 * @param {any} treeNode - Element Plus 内部树节点对象
 * @param {Function} resolve - 回调函数，用于返回子节点数据
 */
const load = async (row: any, treeNode: any, resolve: (date: any[]) => void) => {
	// 如果节点已加载，直接返回缓存的子节点
	if (treeNode.loaded) {
		return resolve(row.children || []);
	}

	// 并发控制：防止重复加载同一节点
	if (loadingSet.has(row.id)) {
		return resolve([]);
	}

	const param = {
		parentId: row.id,
	};

	// 在节点展开加载数据时记录treeNode节点，用于后续刷新
	treeNodeMap.set(row.id, { row, treeNode, resolve });

	// 标记节点为加载中
	loadingSet.add(row.id);
	loadingNodes.value.add(row.id);

	try {
		const res = await pageList(param);
		const childrenList = res.data || [];
		if (Array.isArray(childrenList)) {
			setHasChildren(childrenList);
		}
		resolve(childrenList);
	} catch (error) {
		// 清除缓存，允许用户重新展开重试
		treeNodeMap.delete(row.id);
		treeNode.loaded = false;
		treeNode.loading = false;

		// 错误提示
		useMessage().error(t('common.loadFailedText') || '加载失败，点击可重试');

		// 返回空数组，避免节点卡住
		resolve([]);
	} finally {
		// 清除加载状态
		loadingSet.delete(row.id);
		loadingNodes.value.delete(row.id);
	}
};

/**
 * 刷新指定父节点的子数据（立即执行版本）
 * @description 清空节点缓存并重新加载子数据，用于新增/编辑后刷新
 * @param {any} parentId - 父节点ID
 */
const refreshTreeNodeInternal = (parentId: any) => {
	if (!treeNodeMap.has(parentId)) return;

	const { row, treeNode, resolve } = treeNodeMap.get(parentId);
	if (!row || !treeNode || !resolve) return;

	// 清理节点数据
	treeNode.childNodes?.splice(0);
	row.children?.splice(0);
	treeNode.loaded = false;
	treeNode.loading = false;

	// 清理Element Plus缓存（合并操作）
	const store = tableRef.value?.store;
	if (store?.states) {
		const { lazyTreeNodeMap, treeData } = store.states;
		delete lazyTreeNodeMap?.value?.[row.id];
		delete treeData?.value?.[row.id]?.children;
	}

	// 单次nextTick重新加载
	nextTick(() => {
		treeNode.expanded = true;
		load(row, treeNode, resolve);
	});
};

/**
 * 刷新指定父节点的子数据（防抖版本）
 * @description 300ms 防抖，用于删除操作避免频繁刷新
 * @param {any} parentId - 父节点ID
 */
const refreshTreeNode = useDebounceFn((parentId: any) => {
	refreshTreeNodeInternal(parentId);
}, 300);

/**
 * 递归清理子节点缓存
 * @description 删除节点时，需要同时清理其所有子节点的缓存
 * @param {any} nodeId - 要清理的节点ID
 */
const clearChildCache = (nodeId: any) => {
	treeNodeMap.forEach((value, key) => {
		if (value.row.parentId === nodeId) {
			treeNodeMap.delete(key);
			clearChildCache(key);
		}
	});
};

/**
 * 设置首页
 * @description 将指定菜单设置为首页
 * @param {any} row - 要设置为首页的菜单行数据
 */
const handleSetHomePage = async (row: any) => {
	try {
		await useMessageBox().confirm(t('sysmenu.setHomePageConfirm'));
	} catch {
		return;
	}

	try {
		const { msg } = await setHomePage(row.id);
		useMessage().success(msg);
		// 刷新菜单树
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg || t('sysmenu.setHomePageFailed'));
	}
};

/**
 * 删除菜单
 * @description 删除菜单节点，并清理缓存，刷新父节点或整个表格
 * @param {any} row - 要删除的菜单行数据
 */
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(row.id);

		// 清理被删除节点及其子节点的缓存
		treeNodeMap.delete(row.id);
		clearChildCache(row.id);

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

/**
 * 处理新增/编辑后的刷新回调
 * @description 根据操作类型和父节点变化情况，精确刷新受影响的节点
 * @param {Object} [refreshInfo] - 刷新信息对象
 * @param {boolean} refreshInfo.isEdit - 是否为编辑操作
 * @param {string} refreshInfo.originalParentId - 编辑前的父节点ID
 * @param {string} refreshInfo.currentParentId - 编辑后的父节点ID
 * @param {string} refreshInfo.parentId - 新增时的父节点ID
 */
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
			// 父节点发生变化，需要同时刷新两个父节点（使用立即执行，避免防抖导致只刷新一个）
			if (originalParentId && originalParentId !== '-1') {
				refreshTreeNodeInternal(originalParentId);
			}
			if (currentParentId && currentParentId !== '-1') {
				refreshTreeNodeInternal(currentParentId);
			}
			// 如果移动到根节点或从根节点移出，刷新整个表格
			if (originalParentId === '-1' || currentParentId === '-1') {
				getDataList();
			}
		} else {
			// 父节点未变化，只刷新当前父节点（编辑操作使用立即刷新）
			if (currentParentId && currentParentId !== '-1') {
				refreshTreeNodeInternal(currentParentId);
			} else {
				// 根节点编辑，刷新整个表格
				getDataList();
			}
		}
	} else {
		// 新增操作：只需要刷新父节点（新增操作使用立即刷新）
		const parentId = refreshInfo.parentId;
		if (parentId && parentId !== '-1') {
			refreshTreeNodeInternal(parentId);
		} else {
			// 新增根节点，刷新整个表格
			getDataList();
		}
	}
};

watch(
	() => [state.dataList, state.queryForm.menuName, state.loading],
	() => {
		if (!state.loading) {
			nextTick(initMenuSortable);
		}
	},
	{ deep: true }
);

// 页面加载时获取数据
onMounted(() => {
	getDataList();
});

// 组件卸载时清理内存
onUnmounted(() => {
	sortableRef.value?.destroy();
	treeNodeMap.clear();
});
</script>

<style scoped>
.sort-handle {
	cursor: move;
	color: var(--el-text-color-secondary);
}

.sort-handle.is-disabled {
	cursor: not-allowed;
	opacity: 0.45;
}

.sort-header-placeholder {
	display: inline-block;
	width: 1px;
}
</style>
