<script setup lang="ts" name="systemSysArea">
import type { SysAreaManageNode } from '/@/api/admin/sysArea';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { auth } from '/@/utils/authFunction';
import { downBlobFile } from '/@/utils/other';
import { useI18n } from 'vue-i18n';
import AreaChildrenTable from './components/AreaChildrenTable.vue';
import AreaTreePanel from './components/AreaTreePanel.vue';
import FormDialog from './form.vue';
import { useAreaManagement } from './components/useAreaManagement';

type FormRefreshMode = 'add' | 'current' | 'child';

const treePanelRef = useTemplateRef<InstanceType<typeof AreaTreePanel>>('treePanelRef');
const { t } = useI18n();
const formDialogRef = useTemplateRef<InstanceType<typeof FormDialog>>('formDialogRef');
const selectedRows = ref<SysAreaManageNode[]>([]);
const formRefreshMode = shallowRef<FormRefreshMode>('add');
const formTargetPath = ref<Array<string | number>>([]);

const {
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
} = useAreaManagement();

const tableLoading = computed(() => childLoading.value || searching.value);

const canEdit = computed(() => auth('sys_sysArea_edit'));
const canEditCurrent = computed(() => canEdit.value && Boolean(selectedNode.value) && String(selectedNode.value?.adcode) !== '100000');
const canAddChild = computed(() => Boolean(selectedNode.value) && Number(selectedNode.value?.areaType) < 4);
const canDeleteCurrent = computed(
	() => Boolean(selectedNode.value) && String(selectedNode.value?.adcode) !== '100000' && !selectedNode.value?.hasChildren
);

const refreshTreeChildren = async (adcode: string | number): Promise<void> => {
	try {
		await treePanelRef.value?.refreshChildren(adcode);
	} catch (err: any) {
		useMessage().error(err?.msg || t('area.treeRefreshFailed'));
	}
};

const refreshCurrentView = async (): Promise<void> => {
	if (searchActive.value) {
		await search(searchKeyword.value);
		return;
	}
	if (!selectedNode.value) return;
	await Promise.all([loadSelectedChildren(), refreshTreeChildren(selectedNode.value.adcode)]);
};

const handleSelect = async (node: SysAreaManageNode, path: SysAreaManageNode[]): Promise<void> => {
	selectedRows.value = [];
	await selectNode(node, path);
};

const handleSearch = async (keyword: string): Promise<void> => {
	selectedRows.value = [];
	await search(keyword);
};

const handleAdd = (): void => {
	if (!selectedNode.value || !canAddChild.value) return;
	formRefreshMode.value = 'add';
	formTargetPath.value = [...selectedNode.value.pathCodes];
	formDialogRef.value?.openDialog(undefined, {
		adcode: selectedNode.value.adcode,
		name: selectedNode.value.name,
		areaType: selectedNode.value.areaType,
	});
};

const handleEditCurrent = (): void => {
	if (!selectedNode.value || !canEditCurrent.value) return;
	formRefreshMode.value = 'current';
	formTargetPath.value = [...selectedNode.value.pathCodes];
	formDialogRef.value?.openDialog(String(selectedNode.value.id));
};

const handleEditChild = (row: SysAreaManageNode): void => {
	formRefreshMode.value = 'child';
	formTargetPath.value = [...row.pathCodes];
	formDialogRef.value?.openDialog(String(row.id));
};

const confirmDelete = async (): Promise<boolean> => {
	try {
		await useMessageBox().confirm(t('area.deleteConfirm'));
		return true;
	} catch {
		return false;
	}
};

const handleDeleteRows = async (rows: SysAreaManageNode[]): Promise<void> => {
	if (!rows.length) return;
	if (rows.some((row) => row.hasChildren || String(row.adcode) === '100000')) {
		useMessage().warning(t('area.nonLeafDeleteWarning'));
		return;
	}
	if (!(await confirmDelete())) return;

	try {
		await remove(rows.map((row) => row.id));
		selectedRows.value = [];
		if (selectedNode.value) await refreshTreeChildren(selectedNode.value.adcode);
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err?.msg || t('common.optFailText'));
	}
};

const handleDeleteCurrent = async (): Promise<void> => {
	if (!selectedNode.value || !canDeleteCurrent.value || !(await confirmDelete())) return;
	const parent = selectedPath.value.at(-2);
	try {
		await remove([selectedNode.value.id]);
		useMessage().success(t('common.delSuccessText'));
		if (!parent) {
			await initialize();
			return;
		}
		await refreshTreeChildren(parent.adcode);
		await treePanelRef.value?.focusPath(parent.pathCodes);
	} catch (err: any) {
		useMessage().error(err?.msg || t('common.optFailText'));
	}
};

const handleDeleteAction = async (): Promise<void> => {
	if (selectedRows.value.length) {
		await handleDeleteRows(selectedRows.value);
		return;
	}
	await handleDeleteCurrent();
};

const handleSort = async (rows: SysAreaManageNode[]): Promise<void> => {
	await saveOrder(rows);
	if (selectedNode.value) await refreshTreeChildren(selectedNode.value.adcode);
};

const handleFormRefresh = async (): Promise<void> => {
	if (formRefreshMode.value !== 'current') {
		await refreshCurrentView();
		return;
	}

	const parent = selectedPath.value.at(-2);
	if (parent) {
		await refreshTreeChildren(parent.adcode);
		await treePanelRef.value?.focusPath(formTargetPath.value);
		return;
	}

	await initialize();
	await nextTick();
	await treePanelRef.value?.focusPath(formTargetPath.value);
};

const exportExcel = (): void => {
	downBlobFile(
		'/admin/sysArea/export',
		{
			pid: selectedNode.value?.adcode,
			ids: selectedRows.value.map((row) => row.id),
		},
		'sysArea.xlsx'
	);
};

onMounted(async () => {
	await initialize();
	await nextTick();
	if (selectedNode.value) await treePanelRef.value?.focusPath(selectedNode.value.pathCodes);
});
</script>

<template>
	<div class="layout-padding h-full">
		<div class="layout-padding-auto layout-padding-view !flex min-h-[620px] !flex-row !overflow-hidden !p-0">
			<AreaTreePanel
				ref="treePanelRef"
				:root-nodes="rootNodes"
				:loading="rootLoading"
				:selected-code="selectedNode?.adcode"
				:search-active="searchActive"
				:load-children="loadChildren"
				@select="handleSelect"
				@search="handleSearch"
			/>

			<main class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
				<div class="min-w-0 px-4 pt-5 pb-1">
					<el-breadcrumb v-if="!searchActive" separator-icon="ArrowRight">
						<el-breadcrumb-item v-for="item in selectedPath" :key="item.id">
							{{ item.name }}
						</el-breadcrumb-item>
					</el-breadcrumb>
					<p v-else class="text-sm font-medium">{{ t('area.searchTitle') }}</p>
				</div>

				<el-row class="mt-2">
					<div class="mb8" style="width: 100%">
						<el-button v-auth="'sys_sysArea_add'" class="ml10" type="primary" icon="folder-add" :disabled="!canAddChild" @click="handleAdd">
							{{ t('area.addChild') }}
						</el-button>
						<el-button v-auth="'sys_sysArea_edit'" class="ml10" icon="edit-pen" :disabled="!canEditCurrent" @click="handleEditCurrent">
							{{ t('area.editCurrent') }}
						</el-button>
						<el-tooltip :disabled="selectedRows.length > 0 || canDeleteCurrent" :content="t('area.deleteDisabled')" placement="top">
							<span class="ml10 inline-flex">
								<el-button
									v-auth="'sys_sysArea_del'"
									plain
									type="primary"
									icon="Delete"
									:disabled="selectedRows.length === 0 && !canDeleteCurrent"
									@click="handleDeleteAction"
								>
									{{ selectedRows.length ? t('area.batchDelete') : t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>

						<right-toolbar
							:search="false"
							:export="'sys_sysArea_export'"
							class="ml10"
							style="float: right; margin-right: 20px"
							@queryTable="refreshCurrentView"
							@exportExcel="exportExcel"
						/>
					</div>
				</el-row>

				<div class="min-h-0 flex-1 overflow-hidden px-2 pb-3">
					<AreaChildrenTable
						:rows="childRows"
						:loading="tableLoading"
						:saving="sortSaving"
						:search-active="searchActive"
						:can-edit="canEdit"
						@sort="handleSort"
						@selection-change="selectedRows = $event"
						@edit="handleEditChild"
						@delete="handleDeleteRows([$event])"
					/>
				</div>
			</main>
		</div>

		<FormDialog ref="formDialogRef" @refresh="handleFormRefresh" />
	</div>
</template>
