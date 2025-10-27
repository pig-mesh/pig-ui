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
import { delObj, pageList } from '/@/api/admin/menu';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDebounceFn } from '@vueuse/core';

// 引入组件
const MenuDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义变量内容
const tableRef = ref();
const menuDialogRef = ref();
const showSearch = ref(true);
const queryRef = ref();

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

/**
 * 打开新增菜单弹窗
 * @param {string} [type] - 操作类型
 * @param {any} [row] - 当前行数据（作为新增菜单的父节点）
 */
const onOpenAddMenu = (type?: string, row?: any) => {
	menuDialogRef.value.openDialog(type, row);
};

/**
 * 打开编辑菜单弹窗
 * @param {string} type - 操作类型
 * @param {any} row - 要编辑的菜单数据
 */
const onOpenEditMenu = (type: string, row: any) => {
	menuDialogRef.value.openDialog(type, row);
};

/**
 * 判断删除按钮是否禁用
 * @description 有子节点的菜单不允许删除
 * @param {any} row - 菜单行数据
 * @returns {boolean} true-禁用删除，false-允许删除
 */
const deleteMenuDisabled = (row: any) => {
	return (row.children || []).length > 0;
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
		console.warn(`节点 ${row.id} 正在加载中，跳过重复请求`);
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

// 页面加载时获取数据
onMounted(() => {
	getDataList();
});

// 组件卸载时清理内存
onUnmounted(() => {
	treeNodeMap.clear();
});
</script>
