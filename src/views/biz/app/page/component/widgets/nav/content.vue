<template>
	<div class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700 px-4 py-6 transition-all duration-300">
		<div class="grid grid-cols-5 gap-4 max-w-sm mx-auto sm:max-w-md md:max-w-lg lg:max-w-xl">
			<div 
				v-for="(item, index) in content.data" 
				:key="index" 
				class="flex flex-col items-center group cursor-pointer select-none"
			>
				<!-- 图标容器 -->
				<div class="relative mb-3 p-2 rounded-2xl bg-gray-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg dark:group-hover:shadow-blue-900/20">
					<decoration-img 
						width="32px" 
						height="32px" 
						:src="item.image" 
						alt="" 
						class="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
					/>
					<!-- 悬停光晕效果 -->
					<div class="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
				</div>
				
				<!-- 文字标签 -->
				<div class="text-xs font-medium text-gray-700 dark:text-slate-300 text-center leading-tight max-w-full truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
					{{ item.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type options from './options';
import DecorationImg from '../../decoration-img.vue';

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
