<template>
	<div style="height: 100%">
		<vue3-tree-org
			ref="treeOrgRef"
			:props="props"
			:data="data"
			:label-style="style"
			:define-menus="defineMenus"
			:default-expand-level="expandLevel"
			center
			:horizontal="horizontal"
			:collapsable="collapsable"
			:only-one-node="onlyOneNode"
			:filter-node-method="filterNodeMethod"
			:clone-node-drag="cloneNodeDrag"
			:node-add="addNode"
			:node-delete="delNode"
			:node-edit="editNode"
			@on-node-click="onNodeClick"
		/>
	</div>
	<dept-form ref="deptDialogRef" @refresh="getOrgData()" />
</template>

<script lang="ts" name="treeView" setup>
import { useMessage, useMessageBox } from '/@/hooks/message';
import { delObj, deptTree } from '/@/api/admin/dept';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';

const DeptForm = defineAsyncComponent(() => import('./form.vue'));

const { t } = useI18n();

/** 组织树组件属性映射配置 */
const props = reactive({ id: 'id', pid: 'parentId', label: 'name', expand: 'expand', children: 'children' });

/** 组织树数据 */
const data = reactive<Record<string, any>>({});

/** 右键菜单定义 */
const defineMenus = reactive([
	{ name: t('sysdept.addNodeText'), command: 'add' },
	{ name: t('sysdept.editNodeText'), command: 'edit' },
	{ name: t('sysdept.delNodeText'), command: 'delete' },
]);

/** 是否允许克隆节点拖拽 */
const cloneNodeDrag = ref(true);

/** 是否可折叠 */
const collapsable = ref(false);

/** 默认展开层级（2层） */
const expandLevel = ref(2);

/** 是否水平布局 */
const horizontal = ref(false);

/** 是否只展开一个节点 */
const onlyOneNode = ref(false);

/** 组织树组件引用 */
const treeOrgRef = ref();

/** 部门表单组件引用 */
const deptDialogRef = ref();

// 主题配置
const themeConfig = useThemeConfig();
const { themeConfig: theme } = storeToRefs(themeConfig);

/** 节点标签样式（支持暗黑模式） */
const style = computed(() => ({
	background: theme.value.isDark ? 'var(--el-bg-color-overlay)' : 'var(--el-bg-color-page)',
	color: theme.value.isDark ? 'var(--el-text-color-primary)' : '#5e6d82',
}));

/**
 * 过滤节点
 * @param {string} deptName - 部门名称
 */
const filter = (deptName: string) => {
	treeOrgRef.value.filter(deptName);
};

/**
 * 节点过滤方法
 * @param {string} value - 过滤条件
 * @param {Object} data - 节点数据
 * @returns {boolean} 是否匹配过滤条件
 */
const filterNodeMethod = (value: string, data: any): boolean => {
	if (!value) return true;
	return data.label.includes(value);
};

/**
 * 切换展开/折叠状态
 */
const handleExpand = async () => {
	collapsable.value = !collapsable.value;
};

/**
 * 检查节点是否可操作
 * @param {Object} node - 节点对象
 * @returns {boolean} 根节点（id='0'）不可编辑删除
 */
const checkNode = (node: any): boolean => {
	if (node?.id === '0') {
		useMessage().error(t('sysdept.tenantNodeErrorText'));
		return false;
	}
	return true;
};

/**
 * 节点点击事件处理
 * @param {MouseEvent} e - 鼠标事件对象
 * @description 左键点击时模拟右键菜单事件
 */
const onNodeClick = (e: any) => {
	const { clientX, clientY } = e;
	const rightFun = new MouseEvent('contextmenu', {
		bubbles: true,
		cancelable: false,
		view: window,
		button: 2,
		buttons: 0,
		clientX,
		clientY,
	});
	e.target.dispatchEvent(rightFun);
};

/**
 * 添加部门
 * @param {Object} node - 节点对象
 */
const addNode = (node: any) => {
	deptDialogRef.value.openDialog('add', node?.id);
};

/**
 * 编辑部门
 * @param {Object} node - 节点对象
 */
const editNode = (node: any) => {
	if (!checkNode(node)) {
		return;
	}
	deptDialogRef.value.openDialog('edit', node?.id);
};

/**
 * 删除部门
 * @param {Object} node - 节点对象
 */
const delNode = async (node: any) => {
	if (!checkNode(node)) {
		return;
	}

	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(node.id);
		await getOrgData();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 获取组织架构数据
 * @description 加载部门树作为子节点，根节点使用静态名称
 */
const getOrgData = async () => {
	try {
		const { data: deptData } = await deptTree();
		Object.assign(data, { id: '0', name: t('sysdept.rootDept') });
		data.children = deptData;
	} catch (err: any) {
		useMessage().error(err.msg || t('common.getDataFailed'));
	}
};

onMounted(() => {
	getOrgData();
});

// 暴露变量
defineExpose({
	getOrgData,
	handleExpand,
	filter,
});
</script>

<style lang="scss" scoped>
:deep(.zm-tree-org) {
	height: 100%;
	padding: 15px;
	position: relative;
	background: var(--el-bg-color);
	box-sizing: border-box;
}
</style>
