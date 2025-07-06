<template>
	<div 
		class="banner relative overflow-hidden rounded-lg shadow-sm bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
		:style="styles"
	>
		<div class="banner-image w-full h-full flex items-center justify-center">
			<decoration-img 
				width="100%" 
				:height="styles.height || height" 
				:src="getImage" 
				fit="contain"
				class="transition-transform duration-300 hover:scale-105"
			/>
		</div>
		<!-- 添加装饰性渐变遮罩 -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
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
