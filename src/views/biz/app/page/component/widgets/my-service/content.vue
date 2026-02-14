<template>
	<div class="mx-2 mt-2 mb-2 bg-white dark:bg-gray-800/80 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700/50 overflow-hidden transition-all duration-300">
		<!-- 标题区域 -->
		<div
			v-if="content.title"
			class="relative px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-800/50"
		>
			<div class="flex items-center gap-2">
				<div class="w-1 h-4 bg-gradient-to-b from-primary to-primary/50 rounded-full"></div>
				<div class="text-base font-semibold text-gray-900 dark:text-gray-100">{{ content.title }}</div>
			</div>
		</div>

		<!-- 横排布局 (网格) -->
		<div v-if="content.style == 1" class="p-4">
			<div v-if="content.data?.length > 0" class="grid grid-cols-4 gap-3">
				<div
					v-for="(item, index) in content.data"
					:key="index"
					class="group flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
				>
					<!-- 图标容器 -->
					<div class="relative">
						<div class="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/20">
							<decoration-img
								v-if="item.image"
								width="28px"
								height="28px"
								:src="item.image"
								class="transition-transform duration-300"
							/>
							<el-icon v-else class="text-2xl text-primary/50"><Grid /></el-icon>
						</div>
					</div>

					<!-- 名称 -->
					<div class="text-xs text-center text-gray-700 dark:text-gray-300 font-medium line-clamp-2 w-full group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200">
						{{ item.name || '未命名' }}
					</div>
				</div>
			</div>

			<!-- 空状态 -->
			<div v-else class="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
				<el-icon class="text-4xl mb-2"><Grid /></el-icon>
				<div class="text-sm">暂无服务</div>
			</div>
		</div>

		<!-- 竖排布局 (列表) -->
		<div v-if="content.style == 2">
			<div v-if="content.data?.length > 0">
				<div
					v-for="(item, index) in content.data"
					:key="index"
					class="group flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-all duration-200"
				>
					<!-- 图标 -->
					<div class="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-primary/10">
						<decoration-img
							v-if="item.image"
							width="24px"
							height="24px"
							:src="item.image"
						/>
						<el-icon v-else class="text-xl text-primary/50"><List /></el-icon>
					</div>

					<!-- 名称 -->
					<div class="flex-1 ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-200">
						{{ item.name || '未命名' }}
					</div>

					<!-- 箭头 -->
					<div class="flex-shrink-0 text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:text-primary dark:group-hover:text-primary group-hover:translate-x-1">
						<el-icon class="text-base"><ArrowRight /></el-icon>
					</div>
				</div>
			</div>

			<!-- 空状态 -->
			<div v-else class="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
				<el-icon class="text-4xl mb-2"><List /></el-icon>
				<div class="text-sm">暂无服务</div>
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
