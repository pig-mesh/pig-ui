<template>
	<div class="bg-white dark:bg-[#202e3a] rounded-xl border border-gray-200 dark:border-[#38444d] shadow-sm transition-all duration-200 overflow-hidden w-full min-w-0">
		<!-- 标题栏 -->
		<div class="relative flex items-center px-5 py-4 text-base font-semibold text-gray-900 dark:text-[#f7f9f9] border-b border-gray-200 dark:border-[#38444d] bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-[#1c2732] dark:to-[#1c2732]/50">
			<!-- 装饰线 -->
			<div class="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50"></div>

			<!-- 图标 -->
			<div class="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-primary/10 dark:bg-primary/20 flex-shrink-0">
				<el-icon class="text-primary text-lg">
					<Setting />
				</el-icon>
			</div>

			<!-- 标题 -->
			<div class="flex-1 min-w-0">
				<div class="truncate">{{ widget?.title || '属性设置' }}</div>
				<div class="text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">
					配置当前组件的展示内容和样式
				</div>
			</div>

			<!-- 装饰角标 -->
			<div class="flex-shrink-0">
				<div class="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
			</div>
		</div>

		<!-- 内容区域 -->
		<div class="p-5 overflow-x-hidden w-full">
			<keep-alive>
				<component
					class="w-full min-w-0"
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
