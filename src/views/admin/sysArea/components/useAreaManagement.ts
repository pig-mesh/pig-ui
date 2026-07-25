import { delObjs, fetchManageChildren, searchManageAreas, sortAreas, type SysAreaKey, type SysAreaManageNode } from '/@/api/admin/sysArea';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

export function useAreaManagement() {
	const { t } = useI18n();
	const rootNodes = ref<SysAreaManageNode[]>([]);
	const childRows = ref<SysAreaManageNode[]>([]);
	const selectedNode = shallowRef<SysAreaManageNode>();
	const selectedPath = ref<SysAreaManageNode[]>([]);
	const rootLoading = shallowRef(false);
	const childLoading = shallowRef(false);
	const searching = shallowRef(false);
	const sortSaving = shallowRef(false);
	const searchActive = shallowRef(false);
	const searchKeyword = shallowRef('');
	let childRequestId = 0;
	let searchRequestId = 0;

	const loadChildren = async (pid: SysAreaKey): Promise<SysAreaManageNode[]> => {
		const { data } = await fetchManageChildren(pid);
		return Array.isArray(data) ? data : [];
	};

	const loadSelectedChildren = async (): Promise<void> => {
		const requestId = ++childRequestId;
		if (!selectedNode.value) {
			childLoading.value = false;
			childRows.value = [];
			return;
		}
		const selectedAdcode = selectedNode.value.adcode;
		childLoading.value = true;
		try {
			const rows = await loadChildren(selectedAdcode);
			if (requestId === childRequestId && selectedNode.value?.adcode === selectedAdcode && !searchActive.value) {
				childRows.value = rows;
			}
		} catch (err: any) {
			if (requestId === childRequestId && !searchActive.value) {
				childRows.value = [];
				useMessage().error(err?.msg || t('area.loadFailed'));
			}
		} finally {
			if (requestId === childRequestId) childLoading.value = false;
		}
	};

	const selectNode = async (node: SysAreaManageNode, path: SysAreaManageNode[]): Promise<void> => {
		// 点树节点时退出搜索态，右侧恢复直属下级
		searchRequestId += 1;
		searchActive.value = false;
		searchKeyword.value = '';
		searching.value = false;
		selectedNode.value = node;
		selectedPath.value = path;
		await loadSelectedChildren();
	};

	const initialize = async (): Promise<void> => {
		rootLoading.value = true;
		try {
			rootNodes.value = await loadChildren(0);
			const root = rootNodes.value.find((node) => String(node.adcode) === '100000') || rootNodes.value[0];
			if (root) {
				await selectNode(root, [root]);
			}
		} catch (err: any) {
			rootNodes.value = [];
			useMessage().error(err?.msg || t('area.treeLoadFailed'));
		} finally {
			rootLoading.value = false;
		}
	};

	const search = async (keyword: string): Promise<void> => {
		const requestId = ++searchRequestId;
		const normalizedKeyword = keyword.trim();
		searchKeyword.value = normalizedKeyword;
		searchActive.value = Boolean(normalizedKeyword);

		if (!normalizedKeyword) {
			searching.value = false;
			await loadSelectedChildren();
			return;
		}

		// 作废进行中的直属下级加载，避免覆盖搜索结果
		childRequestId += 1;
		searching.value = true;
		childLoading.value = true;
		try {
			const { data } = await searchManageAreas(normalizedKeyword);
			if (requestId === searchRequestId) {
				childRows.value = Array.isArray(data) ? data : [];
			}
		} catch (err: any) {
			if (requestId === searchRequestId) {
				childRows.value = [];
				useMessage().error(err?.msg || t('area.searchFailed'));
			}
		} finally {
			if (requestId === searchRequestId) {
				searching.value = false;
				childLoading.value = false;
			}
		}
	};

	const saveOrder = async (rows: SysAreaManageNode[]): Promise<void> => {
		if (!selectedNode.value || sortSaving.value || searchActive.value) return;
		sortSaving.value = true;
		try {
			await sortAreas({
				pid: selectedNode.value.adcode,
				areaIds: rows.map((row) => row.id),
			});
			useMessage().success(t('area.sortSuccess'));
		} catch (err: any) {
			useMessage().error(err?.msg || t('common.optFailText'));
		} finally {
			await loadSelectedChildren();
			sortSaving.value = false;
		}
	};

	const remove = async (ids: SysAreaKey[]): Promise<void> => {
		await delObjs(ids);
		if (searchActive.value) {
			await search(searchKeyword.value);
			return;
		}
		await loadSelectedChildren();
	};

	return {
		rootNodes,
		childRows,
		selectedNode,
		selectedPath,
		rootLoading,
		childLoading,
		searching,
		sortSaving,
		searchActive,
		searchKeyword,
		initialize,
		loadChildren,
		loadSelectedChildren,
		selectNode,
		search,
		saveOrder,
		remove,
	};
}
