<template>
	<div
		class="banner relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 transition-all duration-300"
		:style="styles"
	>
		<!-- 背景装饰 -->
		<div class="absolute inset-0 opacity-30 dark:opacity-20">
			<div class="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
			<div class="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
		</div>

		<!-- 图片区域 -->
		<div class="banner-image relative w-full h-full flex items-center justify-center">
			<decoration-img
				width="100%"
				:height="styles.height || height"
				:src="getImage"
				fit="cover"
				class="transition-all duration-300 hover:scale-[1.02]"
			/>

			<!-- 图片未上传时的占位符 -->
			<div
				v-if="!getImage"
				class="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500"
			>
				<el-icon class="text-5xl mb-2"><Picture /></el-icon>
				<div class="text-sm">暂无图片</div>
			</div>
		</div>

		<!-- 底部渐变遮罩 -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
	</div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import type options from './options';
import DecorationImg from '../../decoration-img.vue';

type OptionsType = ReturnType<typeof options>;

const props = defineProps({
	content: {
		type: Object as PropType<OptionsType['content']>,
		default: () => ({}),
	},
	styles: {
		type: Object as PropType<OptionsType['styles']>,
		default: () => ({}),
	},
	height: {
		type: String,
		default: '170px',
	},
});

const getImage = computed(() => {
	const { data } = props.content;
	if (Array.isArray(data)) {
		return data[0] ? data[0].image : '';
	}
	return '';
});
</script>

<style lang="scss" scoped>
// 保留 SCSS 部分用于复杂的自定义样式（如果需要）
</style>
