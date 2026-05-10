<template>
	<div class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 px-4 py-6">
		<div class="grid grid-cols-4 gap-4 max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
			<div
				v-for="(item, index) in content.data"
				:key="index"
				class="flex flex-col items-center group cursor-pointer select-none"
			>
				<!-- 图标容器 -->
				<div class="relative mb-3 p-2 rounded-2xl bg-gray-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors group-hover:scale-105">
					<span class="app-wot-icon text-[32px] text-primary" :class="`wd-icon-${item.icon || 'apps'}`" />
				</div>

				<!-- 文字标签 -->
				<div class="text-xs font-medium text-gray-700 dark:text-slate-300 text-center leading-tight max-w-full truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
					{{ item.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type options from './options';

type OptionsType = ReturnType<typeof options>;

defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
});
</script>

<style lang="scss">
@use '../../wot-icon-style.scss';
</style>
