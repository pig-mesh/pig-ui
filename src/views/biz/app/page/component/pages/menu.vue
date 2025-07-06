<template>
	<el-menu 
		:default-active="modelValue" 
		class="w-[160px] min-h-[668px] border-r border-gray-200 bg-white dark:bg-[#202e3a] dark:border-[#38444d] transition-colors duration-300"
		@select="handleSelect"
	>
		<el-menu-item 
			v-for="(item, key) in menus" 
			:index="key" 
			:key="item.id"
			class="!border-transparent !bg-transparent !text-gray-600 dark:!text-[#8b98a5] hover:!bg-gray-50 dark:hover:!bg-[#1e2732] hover:!text-gray-900 dark:hover:!text-[#f7f9f9] transition-all duration-300 [&.is-active]:!border-r-2 [&.is-active]:!border-blue-500 dark:[&.is-active]:!border-[#1d9bf0] [&.is-active]:!bg-blue-50 dark:[&.is-active]:!bg-[rgba(29,155,240,0.1)] [&.is-active]:!text-blue-600 dark:[&.is-active]:!text-[#1d9bf0] [&.is-active]:font-medium dark:[&.is-active:hover]:!bg-[rgba(29,155,240,0.15)]"
		>
			<span>{{ item.name }}</span>
		</el-menu-item>
	</el-menu>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';

defineProps({
	menus: {
		type: Object as PropType<Record<string, any>>,
		default: () => ({}),
	},
	modelValue: {
		type: String,
		default: '1',
	},
});
const emit = defineEmits<{
	(event: 'update:modelValue', value: string): void;
}>();
const handleSelect = (index: string) => {
	emit('update:modelValue', index);
};
</script>
