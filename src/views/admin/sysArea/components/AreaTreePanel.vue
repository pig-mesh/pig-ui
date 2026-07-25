<script setup lang="ts">
import type { SysAreaKey, SysAreaManageNode } from '/@/api/admin/sysArea';
import { useMessage } from '/@/hooks/message';
import { Search } from '@element-plus/icons-vue';
import { ElTree } from 'element-plus';
import { useI18n } from 'vue-i18n';

interface Props {
	rootNodes: SysAreaManageNode[];
	loading: boolean;
	selectedCode?: SysAreaKey;
	/** 外部搜索态清空时同步清空输入框 */
	searchActive?: boolean;
	loadChildren: (pid: SysAreaKey) => Promise<SysAreaManageNode[]>;
}

interface Emits {
	select: [node: SysAreaManageNode, path: SysAreaManageNode[]];
	search: [keyword: string];
}

interface AreaTreeNodeContext {
	level: number;
	data: SysAreaManageNode;
	parent?: AreaTreeNodeContext;
	expand: (callback?: () => void) => void;
	loaded?: boolean;
	isLeafByUser?: boolean;
	updateLeafState?: () => void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();
const treeRef = useTemplateRef<InstanceType<typeof ElTree>>('treeRef');
const searchKeyword = shallowRef('');

const treeProps = {
	label: 'name',
	isLeaf: (data: SysAreaManageNode) => !data.hasChildren,
};

watch(
	() => props.searchActive,
	(active) => {
		if (!active) searchKeyword.value = '';
	}
);

const buildNodePath = (node: AreaTreeNodeContext): SysAreaManageNode[] => {
	const path: SysAreaManageNode[] = [];
	let current: AreaTreeNodeContext | undefined = node;
	while (current && current.level > 0) {
		path.unshift(current.data);
		current = current.parent;
	}
	return path;
};

const handleNodeClick = (data: SysAreaManageNode, node: AreaTreeNodeContext): void => {
	searchKeyword.value = '';
	emit('select', data, buildNodePath(node));
};

const handleSearch = (): void => {
	emit('search', searchKeyword.value);
};

const clearSearch = (): void => {
	searchKeyword.value = '';
	emit('search', '');
};

const loadNode = async (node: AreaTreeNodeContext, resolve: (children: SysAreaManageNode[]) => void): Promise<void> => {
	if (node.level === 0) {
		resolve(props.rootNodes);
		return;
	}
	try {
		resolve(await props.loadChildren(node.data.adcode));
	} catch (err: any) {
		resolve([]);
		useMessage().error(err?.msg || t('area.expandLoadFailed'));
	}
};

const expandNode = (node?: AreaTreeNodeContext): Promise<void> =>
	new Promise((resolve) => {
		if (!node) {
			resolve();
			return;
		}
		node.expand(resolve);
	});

const focusPath = async (pathCodes: SysAreaKey[]): Promise<void> => {
	searchKeyword.value = '';
	await nextTick();
	let targetNode: AreaTreeNodeContext | undefined;
	for (const code of pathCodes) {
		targetNode = treeRef.value?.getNode(code) as AreaTreeNodeContext | undefined;
		if (!targetNode) break;
		await expandNode(targetNode);
	}
	if (!targetNode) return;
	treeRef.value?.setCurrentKey(targetNode.data.adcode);
	emit('select', targetNode.data, buildNodePath(targetNode));
};

const refreshChildren = async (adcode: SysAreaKey): Promise<void> => {
	const children = await props.loadChildren(adcode);
	const node = treeRef.value?.getNode(adcode) as AreaTreeNodeContext | undefined;
	if (node) {
		node.data.childCount = children.length;
		node.data.hasChildren = children.length > 0;
		node.isLeafByUser = children.length === 0;
		node.loaded = true;
	}
	treeRef.value?.updateKeyChildren(adcode, children);
	node?.updateLeafState?.();
};

defineExpose({
	focusPath,
	refreshChildren,
});
</script>

<template>
	<aside class="flex w-[280px] min-w-[280px] min-h-0 flex-col border-r border-solid border-[var(--el-border-color-lighter)] bg-[var(--el-bg-color)]">
		<div class="px-4 pb-3 pt-4">
			<el-input
				v-model="searchKeyword"
				:prefix-icon="Search"
				clearable
				:placeholder="t('area.searchPlaceholder')"
				@clear="clearSearch"
				@keyup.enter="handleSearch"
			/>
		</div>

		<div v-loading="loading" class="min-h-0 flex-1 overflow-auto px-2 pb-4">
			<el-tree
				ref="treeRef"
				:data="rootNodes"
				:props="treeProps"
				:current-node-key="selectedCode"
				node-key="adcode"
				lazy
				highlight-current
				:load="loadNode"
				:expand-on-click-node="false"
				class="area-tree"
				@node-click="handleNodeClick"
			>
				<template #default="{ data }">
					<div class="flex min-w-0 flex-1 items-center justify-between gap-2 pr-2">
						<span class="truncate text-sm">{{ data.name }}</span>
						<span class="inline-flex shrink-0 items-center gap-1.5">
							<el-tag v-if="data.areaStatus === '0'" type="info" size="small" effect="plain">{{ t('area.disabled') }}</el-tag>
							<span
								v-if="Number(data.childCount) > 0"
								class="inline-flex h-5 min-w-[22px] items-center justify-center rounded px-1 text-[11px] tabular-nums text-[var(--el-text-color-secondary)] bg-[var(--el-fill-color)]"
							>
								{{ data.childCount }}
							</span>
						</span>
					</div>
				</template>
			</el-tree>
		</div>
	</aside>
</template>

<style scoped>
.area-tree {
	--el-tree-node-hover-bg-color: var(--el-fill-color-light);
}

:deep(.el-tree-node__content) {
	height: 38px;
	border-radius: 6px;
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
	background: var(--el-color-primary-light-9);
	color: var(--el-color-primary);
	font-weight: 500;
}
</style>
