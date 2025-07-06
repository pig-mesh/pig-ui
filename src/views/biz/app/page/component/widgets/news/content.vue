<template>
	<div class="news">
		<!-- 标题部分 - 使用 Tailwind 实现左侧蓝色条 -->
		<div class="flex items-center mx-2.5 my-4 text-lg font-medium relative">
			<div class="w-1 h-4 bg-blue-500 mr-1.5"></div>
			最新资讯
		</div>
		
		<!-- 新闻列表 -->
		<div v-for="item in newsList" :key="item.id" class="flex bg-white px-2.5 py-4 text-gray-800 border-b border-gray-100">
			<!-- 图片部分 -->
			<div class="mr-2.5 flex-shrink-0" v-if="item.image">
				<img 
					:src="item.image.includes('http') ? item.image : baseURL + item.image" 
					class="w-32 h-24 object-cover rounded-md" 
				/>
			</div>
			
			<!-- 内容部分 -->
			<div class="flex flex-col justify-between flex-1 min-w-0">
				<!-- 标题 -->
				<div class="text-base font-medium line-clamp-2 leading-tight">
					{{ item.title }}
				</div>
				
				<!-- 简介 -->
				<div class="line-clamp-1 text-sm mt-2 text-gray-600">
					{{ item.intro }}
				</div>

				<!-- 底部信息 -->
				<div class="text-gray-400 text-xs w-full flex justify-between items-center mt-2">
					<div>{{ item.createTime }}</div>
					<div class="flex items-center">
						<el-icon class="mr-1"><View /></el-icon>
						<div>{{ item.visit }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { fetchList } from '/@/api/app/appArticle';
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
const newsList = ref<any[]>([]);
const getData = async () => {
	const { data } = await fetchList();
	newsList.value = data.records;
};
getData();
</script>

<style lang="scss" scoped>
/* 移除了所有 SCSS 样式，全部使用 Tailwind CSS 内联样式 */
</style>
