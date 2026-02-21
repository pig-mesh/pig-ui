<template>
	<div
		class="banner relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-750 dark:to-gray-700"
		:style="styles"
	>
		<!-- 图片区域 -->
		<div class="banner-image relative w-full h-full flex items-center justify-center">
			<decoration-img
				width="100%"
				:height="styles.height || height"
				:src="getImage"
				fit="cover"
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

	</div>
</template>
<script lang="ts" setup>
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
	return props.content.data?.[0]?.image ?? '';
});
</script>
