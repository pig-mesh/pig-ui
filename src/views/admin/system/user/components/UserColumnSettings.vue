<script setup lang="ts" name="UserColumnSettings">
import { Operation, Rank } from '@element-plus/icons-vue';
import Draggable from 'vuedraggable';
import type { UserTableColumn, UserTableColumnKey } from './useUserTableColumns';

defineProps<{
	columns: UserTableColumn[];
}>();

const emit = defineEmits<{
	reorder: [columns: UserTableColumn[]];
	visibilityChange: [key: UserTableColumnKey, visible: boolean];
	reset: [];
}>();

const handleVisibilityChange = (key: UserTableColumnKey, value: unknown) => {
	emit('visibilityChange', key, value === true);
};
</script>

<template>
	<el-popover placement="bottom-end" trigger="click" :width="240">
		<template #reference>
			<el-button circle :icon="Operation" :title="$t('sysuser.columnSettings')" :aria-label="$t('sysuser.columnSettings')" />
		</template>

		<div class="flex items-center justify-between border-b border-[var(--el-border-color-lighter)] px-1 pb-2">
			<span class="font-semibold text-[var(--el-text-color-primary)]">{{ $t('sysuser.columnSettings') }}</span>
			<el-button link type="primary" @click="emit('reset')">{{ $t('sysuser.restoreDefaultColumns') }}</el-button>
		</div>

		<Draggable
			class="mt-1"
			:model-value="columns"
			item-key="key"
			handle="[data-drag-handle]"
			ghost-class="!bg-primary-light-9"
			:force-fallback="true"
			:animation="150"
			@update:model-value="emit('reorder', $event)"
		>
			<template #item="{ element }">
				<div class="flex min-h-9 items-center gap-1 rounded-[var(--el-border-radius-base)] px-1 py-1 hover:bg-fill-light">
					<el-button
						data-drag-handle
						class="shrink-0 !cursor-grab !p-1 !text-[var(--el-text-color-secondary)] active:!cursor-grabbing [&_*]:pointer-events-none"
						text
						:icon="Rank"
						:title="$t('sysuser.dragColumn')"
						:aria-label="$t('sysuser.dragColumn')"
					/>
					<el-checkbox class="min-w-0 flex-1" :model-value="element.visible" @change="handleVisibilityChange(element.key, $event)">
						{{ $t(element.labelKey) }}
					</el-checkbox>
				</div>
			</template>
		</Draggable>
	</el-popover>
</template>
