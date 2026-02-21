<template>
	<el-menu
		:default-active="modelValue"
		class="page-menu"
		@select="handleSelect"
	>
		<el-menu-item
			v-for="(item, key) in menus"
			:index="key"
			:key="item.id"
		>
			<span>{{ item.name }}</span>
		</el-menu-item>
	</el-menu>
</template>
<script lang="ts" setup>
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

<style scoped>
.page-menu {
	@apply w-40 min-h-[668px] border-r border-gray-200 bg-white transition-colors;
}

:deep(.page-menu) {
	--el-menu-bg-color: transparent;
	--el-menu-hover-bg-color: transparent;
}

.page-menu :deep(.el-menu-item) {
	@apply border-transparent bg-transparent text-gray-600 transition-colors;
}

.page-menu :deep(.el-menu-item:hover) {
	@apply bg-gray-50 text-gray-900;
}

.page-menu :deep(.el-menu-item.is-active) {
	@apply border-r-2 border-blue-500 bg-blue-50 text-blue-600 font-medium;
}

[data-theme='dark'] .page-menu {
	@apply bg-gray-800 border-gray-700;
}

[data-theme='dark'] .page-menu :deep(.el-menu-item) {
	@apply text-gray-400;
}

[data-theme='dark'] .page-menu :deep(.el-menu-item:hover) {
	@apply bg-gray-700 text-gray-200;
}

[data-theme='dark'] .page-menu :deep(.el-menu-item.is-active) {
	@apply border-blue-400 bg-blue-900/20 text-blue-400;
}
</style>
