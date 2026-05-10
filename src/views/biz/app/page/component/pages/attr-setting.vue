<template>
	<div class="h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden w-full min-w-0">
		<!-- 标题栏 -->
		<div class="flex-shrink-0 flex items-center px-5 py-4 text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800">
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
		</div>

		<!-- 内容区域 -->
		<div class="flex-1 min-h-0 overflow-y-auto p-5 overflow-x-hidden w-full">
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
