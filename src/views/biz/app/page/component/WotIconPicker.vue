<script lang="ts" setup>
import { computed, shallowRef } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { WOT_ICON_NAMES } from './wot-icon-options';

const modelValue = defineModel<string>({ default: '' });

const props = defineProps({
	compact: {
		type: Boolean,
		default: false,
	},
});

const visible = shallowRef(false);
const keyword = shallowRef('');

const filteredIcons = computed(() => {
	const value = keyword.value.trim().toLowerCase();
	if (!value) {
		return WOT_ICON_NAMES;
	}

	return WOT_ICON_NAMES.filter((name) => name.toLowerCase().includes(value));
});

const previewIcon = computed(() => modelValue.value || 'apps');

const handleSelect = (name: string) => {
	modelValue.value = name;
	visible.value = false;
};
</script>

<template>
	<div class="w-full min-w-0">
		<el-popover
			v-model:visible="visible"
			width="420px"
			trigger="click"
			:teleported="true"
			popper-class="wot-icon-picker-popper"
		>
			<template #reference>
				<button
					type="button"
					class="flex items-center w-full text-left transition-colors border border-gray-200 rounded-lg bg-gray-50 hover:border-primary dark:border-gray-600 dark:bg-gray-900/40 dark:hover:border-primary"
					:class="props.compact ? 'h-10 gap-2 px-2' : 'h-16 gap-3 px-3'"
				>
					<span class="app-wot-icon text-primary" :class="[props.compact ? 'text-lg' : 'text-2xl', `wd-icon-${previewIcon}`]" />
					<span class="flex-1 min-w-0">
						<span class="block text-sm font-medium text-gray-800 truncate dark:text-gray-100">{{ modelValue || '请选择图标' }}</span>
						<span v-if="!props.compact" class="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">Wot UI 内置图标</span>
					</span>
				</button>
			</template>

			<div class="wot-icon-picker">
				<el-input v-model="keyword" clearable placeholder="搜索 Wot 图标名" :prefix-icon="Search" class="mb-3" />

				<div v-if="filteredIcons.length" class="grid max-h-[320px] grid-cols-4 gap-2 overflow-y-auto pr-1">
					<button
						v-for="icon in filteredIcons"
						:key="icon"
						type="button"
						class="flex h-[76px] min-w-0 flex-col items-center justify-center gap-2 rounded-lg border px-2 transition-colors"
						:class="
							modelValue === icon
								? 'border-primary bg-primary/10 text-primary'
								: 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200'
						"
						@click="handleSelect(icon)"
					>
						<span class="app-wot-icon text-[22px]" :class="`wd-icon-${icon}`" />
						<span class="w-full text-xs text-center truncate">{{ icon }}</span>
					</button>
				</div>

				<el-empty v-else description="未找到图标" :image-size="72" />
			</div>
		</el-popover>
	</div>
</template>

<style lang="scss">
@use './wot-icon-style.scss';

.wot-icon-picker-popper {
	.wot-icon-picker {
		width: 100%;
	}
}
</style>
