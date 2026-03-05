<template>
	<div class="p-2 h-full overflow-y-auto">
		<el-input v-model="searchText" placeholder="搜索变量" clearable class="mb-2" />
		<el-collapse v-model="activeNames">
			<el-collapse-item v-for="group in filteredGroups" :key="group.category" :title="group.title" :name="group.category">
				<div
					v-for="item in group.items"
					:key="item.value"
					class="flex justify-between items-center px-2 py-1.5 cursor-pointer rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
					role="button"
					tabindex="0"
					@click="$emit('select', item)"
					@keydown.enter="$emit('select', item)"
					@keydown.space.prevent="$emit('select', item)"
				>
					<span class="text-sm text-gray-700 dark:text-gray-300">{{ item.label }}</span>
					<span class="text-xs text-gray-500 dark:text-gray-400">{{ item.value }}</span>
				</div>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core';

export interface VariableItem {
	value: string;
	label: string;
	category: string;
}

interface VariableGroup {
	category: string;
	title: string;
	items: VariableItem[];
}

const props = defineProps<{
	variables: VariableGroup[];
}>();

defineEmits<{
	(e: 'select', item: VariableItem): void;
}>();

const searchText = ref('');
const debouncedSearch = refDebounced(searchText, 300);
const activeNames = ref(['process', 'form', 'approval']);

const filteredGroups = computed(() => {
	if (!debouncedSearch.value) return props.variables;
	const keyword = debouncedSearch.value.toLowerCase();
	return props.variables
		.map((group) => ({
			...group,
			items: group.items.filter(
				(item) => item.label.toLowerCase().includes(keyword) || item.value.toLowerCase().includes(keyword)
			),
		}))
		.filter((group) => group.items.length > 0);
});
</script>
