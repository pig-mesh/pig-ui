<template>
	<div class="bg-white dark:bg-[#202e3a] rounded-lg border border-gray-200 dark:border-[#38444d] transition-colors duration-200">
		<!-- 标题栏 -->
		<div class="flex items-center px-4 py-3 text-base font-medium text-gray-900 dark:text-[#f7f9f9] border-b border-gray-100 dark:border-[#38444d] bg-gray-50/50 dark:bg-[#1c2732]/50">
			<div class="w-1 h-4 bg-primary rounded-full mr-3 flex-shrink-0"></div>
			<span class="truncate">{{ widget?.title || '属性设置' }}</span>
		</div>
		
		<!-- 内容区域 -->
		<div class="p-4">
			<keep-alive>
				<component 
					class="w-full" 
					:is="widgets[widget?.name]?.attr" 
					:content="widget?.content" 
					:styles="widget?.styles" 
					:type="type" 
				/>
			</keep-alive>
		</div>
	</div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import widgets from '../widgets';

defineProps({
	widget: {
		type: Object as PropType<Record<string, any>>,
		default: () => ({}),
	},
	type: {
		type: String as PropType<'mobile' | 'pc'>,
		default: 'mobile',
	},
});
</script>
