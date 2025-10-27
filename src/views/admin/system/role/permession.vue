<template>
	<div class="system-role-dialog-container">
		<el-dialog width="30%" v-model="state.dialog.isShowDialog" :close-on-click-modal="false" draggable>
			<template #header>
				<div class="flex justify-between items-center">
					<div>{{ state.dialog.title }}</div>
					<div class="flex mr-16">
						<el-checkbox :label="$t('common.expand')" @change="handleExpand" />
						<el-checkbox :label="$t('common.selectAll')" @change="handleSelectAll" />
					</div>
				</div>
			</template>
			<el-scrollbar class="h-[400px] sm:h-[600px]">
				<el-tree
					v-loading="loading"
					ref="menuTree"
					:data="state.treeData"
					:default-checked-keys="state.checkedKeys"
					:check-strictly="!checkStrictly"
					:props="state.defaultProps"
					class="filter-tree"
					node-key="id"
					highlight-current
					show-checkbox
				/>
			</el-scrollbar>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="state.dialog.isShowDialog = false">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button type="primary" @click="onSubmit">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="role-permession">
import { fetchRoleTree, permissionUpd } from '/@/api/admin/role';
import { pageList } from '/@/api/admin/menu';
import { useMessage } from '/@/hooks/message';
import { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import other from '/@/utils/other';
import { CheckboxValueType } from 'element-plus';

const { t } = useI18n();

/** 菜单树组件引用 */
const menuTree = ref();

/** 是否启用父子节点关联选择(true=不关联, false=关联) */
const checkStrictly = ref(true);

/** 加载状态 */
const loading = ref(false);

/**
 * 组件状态
 * @property {string[]} checkedKeys - 选中的菜单节点ID数组
 * @property {any[]} treeData - 菜单树数据
 * @property {object} defaultProps - 树组件属性配置
 * @property {string} roleId - 当前编辑的角色ID
 * @property {object} dialog - 弹窗配置
 */
const state = reactive({
	checkedKeys: [] as any[],
	treeData: [] as any[],
	defaultProps: {
		label: 'name',
		value: 'id',
	},
	roleId: '',
	dialog: {
		isShowDialog: false,
		title: t('sysrole.assignPermission'),
		submitTxt: t('common.editBtn'),
	},
});

/** 临时存储角色原始选中的菜单ID(用于叶子节点解析) */
const checkedKeys: Ref<any[]> = ref([]);

/**
 * 打开权限分配弹窗
 * @param {object} row - 角色数据对象
 * @param {string} row.roleId - 角色ID
 *
 * 业务逻辑:
 * 1. 重置所有状态数据
 * 2. 获取角色已授权的菜单ID列表
 * 3. 获取系统所有菜单树数据
 * 4. 过滤父节点,只保留叶子节点选中状态(避免父子节点关联导致的选中异常)
 */
const openDialog = async (row: any) => {
	// 重置状态
	state.checkedKeys = [];
	state.treeData = [];
	checkedKeys.value = [];
	state.roleId = row.roleId;

	loading.value = true;
	state.dialog.isShowDialog = true;

	try {
		// 获取角色已授权的菜单树
		const { data: roleTreeData } = await fetchRoleTree(row.roleId);
		checkedKeys.value = roleTreeData;

		// 获取所有菜单列表
		const { data: menuList } = await pageList();
		state.treeData = menuList;

		// 解析并设置选中的节点(过滤掉父节点,只保留叶子节点)
		state.checkedKeys = other.resolveAllEunuchNodeId(state.treeData, checkedKeys.value, []);
	} catch (err: any) {
		useMessage().error(err.msg || t('sysrole.fetchPermissionDataError'));
	} finally {
		loading.value = false;
	}
};

/**
 * 展开/折叠所有树节点
 * @param {CheckboxValueType} check - 复选框状态(true=展开, false=折叠)
 */
const handleExpand = (check: CheckboxValueType) => {
	state.treeData.forEach((node) => {
		const treeNode = menuTree.value?.store?.nodesMap?.[node.id];
		if (treeNode) {
			treeNode.expanded = check;
		}
	});
};

/**
 * 全选/取消全选所有菜单
 * @param {CheckboxValueType} check - 复选框状态(true=全选, false=取消全选)
 */
const handleSelectAll = (check: CheckboxValueType) => {
	const keys = check ? state.treeData.map((item) => item.id) : [];
	menuTree.value?.setCheckedKeys(keys);
};

/**
 * 超级管理员角色ID常量
 * @description 系统预设的超级管理员角色，拥有所有权限且必须包含【分配权限】菜单
 */
const SUPER_ADMIN_ROLE_ID = '1';

/**
 * 提交权限分配数据
 *
 * 业务规则:
 * 1. 超级管理员(roleId=1)必须保留【分配权限】菜单,防止权限丢失
 * 2. 提交时需要同时包含:选中的节点 + 半选中的父节点
 *
 * 技术说明:
 * - getCheckedKeys(): 获取完全选中的节点ID
 * - getHalfCheckedKeys(): 获取半选中状态的父节点ID(子节点部分选中时,父节点为半选中)
 */
const onSubmit = async () => {
	// 超级管理员角色必须包含【分配权限】菜单
	if (state.roleId === SUPER_ADMIN_ROLE_ID) {
		const checkedMenuNames = menuTree.value
			.getCheckedNodes()
			.map((item: { name: string }) => item.name);

		if (!checkedMenuNames.includes(t('sysrole.assignPermissionMenu'))) {
			useMessage().error(t('sysrole.mustCheckOneTip'));
			return;
		}
	}

	// 获取选中的菜单ID(包含半选中的父节点)
	const checkedKeys = menuTree.value.getCheckedKeys();
	const halfCheckedKeys = menuTree.value.getHalfCheckedKeys();
	const menuIds = [...checkedKeys, ...halfCheckedKeys].filter(Boolean).join(',');

	loading.value = true;
	try {
		await permissionUpd(state.roleId, menuIds);
		state.dialog.isShowDialog = false;
		useMessage().success(t('common.editSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg || t('sysrole.permissionUpdateError'));
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
