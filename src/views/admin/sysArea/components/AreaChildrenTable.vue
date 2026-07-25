<script setup lang="ts">
import type { SysAreaManageNode } from '/@/api/admin/sysArea';
import { useDict } from '/@/hooks/dict';
import { useTable } from '/@/hooks/table';
import { Rank } from '@element-plus/icons-vue';
import type { TableInstance } from 'element-plus';
import Sortable from 'sortablejs';
import { useI18n } from 'vue-i18n';
import { getAreaTypeLabel } from './areaTypes';

interface Props {
	rows: SysAreaManageNode[];
	loading: boolean;
	saving: boolean;
	searchActive: boolean;
	canEdit: boolean;
}

interface Emits {
	sort: [rows: SysAreaManageNode[]];
	selectionChange: [rows: SysAreaManageNode[]];
	edit: [row: SysAreaManageNode];
	delete: [row: SysAreaManageNode];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { t } = useI18n();
const { yes_no_type } = useDict('yes_no_type');
const { tableStyle } = useTable({ createdIsNeed: false, isPage: false });
const tableRef = useTemplateRef<TableInstance>('tableRef');
const sortableRef = shallowRef<Sortable>();

const sortDisabled = computed(() => props.loading || props.saving || props.searchActive || !props.canEdit || props.rows.length < 2);

const destroySortable = (): void => {
	sortableRef.value?.destroy();
	sortableRef.value = undefined;
};

const getSortableTbody = (): HTMLElement | undefined => {
	const handle = tableRef.value?.$el?.querySelector('.area-sort-handle');
	return handle?.closest('tbody') || tableRef.value?.$el?.querySelector('.el-table__body-wrapper tbody');
};

const handleSortEnd = (event: Sortable.SortableEvent): void => {
	const { oldIndex, newIndex } = event;
	if (sortDisabled.value || oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) {
		nextTick(initSortable);
		return;
	}

	const orderedRows = [...props.rows];
	const [movedRow] = orderedRows.splice(oldIndex, 1);
	if (!movedRow) {
		nextTick(initSortable);
		return;
	}
	orderedRows.splice(newIndex, 0, movedRow);
	emit('sort', orderedRows);
};

const initSortable = (): void => {
	destroySortable();
	const tbody = getSortableTbody();
	if (!tbody || sortDisabled.value) return;

	sortableRef.value = Sortable.create(tbody, {
		handle: '.area-sort-handle',
		animation: 180,
		ghostClass: 'area-sort-ghost',
		chosenClass: 'area-sort-chosen',
		dragClass: 'area-sort-dragging',
		onEnd: handleSortEnd,
	});
};

const deleteDisabled = (row: SysAreaManageNode): boolean => row.hasChildren || String(row.adcode) === '100000';

watch(
	() => [props.rows, props.loading, props.saving, props.searchActive, props.canEdit],
	() => nextTick(initSortable),
	{ deep: true }
);

onUnmounted(destroySortable);
</script>

<template>
	<div class="area-children-table">
		<el-table
			ref="tableRef"
			:data="rows"
			v-loading="loading"
			row-key="id"
			border
			style="width: 100%"
			height="100%"
			:cell-style="tableStyle.cellStyle"
			:header-cell-style="tableStyle.headerCellStyle"
			@selection-change="emit('selectionChange', $event)"
		>
			<el-table-column v-if="canEdit" width="44" align="center">
				<template #default>
					<el-icon class="area-sort-handle" :class="{ 'is-disabled': sortDisabled }">
						<Rank />
					</el-icon>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="40" align="center" />
			<el-table-column prop="name" :label="t('area.name')" min-width="140" show-overflow-tooltip />
			<el-table-column v-if="searchActive" prop="pathName" :label="t('area.pathName')" min-width="180" show-overflow-tooltip />
			<el-table-column prop="adcode" :label="t('area.adcode')" min-width="120" show-overflow-tooltip />
			<el-table-column prop="areaType" :label="t('area.areaType')" min-width="100" show-overflow-tooltip>
				<template #default="scope">
					{{ getAreaTypeLabel(t, scope.row.areaType) }}
				</template>
			</el-table-column>
			<el-table-column prop="hot" :label="t('area.hot')" min-width="90" show-overflow-tooltip>
				<template #default="scope">
					<dict-tag :options="yes_no_type" :value="scope.row.hot" />
				</template>
			</el-table-column>
			<el-table-column prop="areaStatus" :label="t('area.areaStatus')" min-width="90" show-overflow-tooltip>
				<template #default="scope">
					<dict-tag :options="yes_no_type" :value="scope.row.areaStatus" />
				</template>
			</el-table-column>
			<el-table-column :label="t('common.action')" width="180">
				<template #default="scope">
					<el-button v-auth="'sys_sysArea_edit'" icon="edit-pen" text type="primary" @click="emit('edit', scope.row)">
						{{ t('common.editBtn') }}
					</el-button>
					<el-tooltip :disabled="!deleteDisabled(scope.row)" :content="t('area.childDeleteDisabled')" placement="top">
						<span style="margin-left: 12px">
							<el-button
								v-auth="'sys_sysArea_del'"
								icon="delete"
								text
								type="primary"
								:disabled="deleteDisabled(scope.row)"
								@click="emit('delete', scope.row)"
							>
								{{ t('common.delBtn') }}
							</el-button>
						</span>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<style scoped>
.area-children-table {
	display: flex;
	min-height: 0;
	height: 100%;
	flex-direction: column;
}

.area-sort-handle {
	cursor: grab;
	color: var(--el-text-color-secondary);
	font-size: 16px;
	vertical-align: middle;
}

.area-sort-handle:active {
	cursor: grabbing;
}

.area-sort-handle.is-disabled {
	cursor: not-allowed;
	opacity: 0.4;
}

:deep(.area-sort-ghost) {
	opacity: 0.55;
}

:deep(.area-sort-chosen) {
	background: var(--el-color-primary-light-9);
}

:deep(.area-sort-dragging) {
	opacity: 0.9;
}
</style>
