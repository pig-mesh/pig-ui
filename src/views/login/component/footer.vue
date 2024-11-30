<template>
	<div class="fixed bottom-0 left-0 right-0 z-0 py-6 bg-gradient-to-t from-gray-50 to-transparent dark:from-slate-900/50">
		<p class="text-sm font-light tracking-wide text-center text-gray-400 dark:text-slate-500">
			<a target="_blank" rel="noopener noreferrer" class="transition-colors duration-300 hover:text-gray-600 dark:hover:text-slate-300">
				{{ getThemeConfig.footerAuthor }}
			</a>
		</p>
	</div>
</template>

<script setup lang="ts">
import { useThemeConfig } from '/@/stores/themeConfig';
import { storeToRefs } from 'pinia';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);

const getThemeConfig = computed(() => {
	return themeConfig.value;
});
</script>
