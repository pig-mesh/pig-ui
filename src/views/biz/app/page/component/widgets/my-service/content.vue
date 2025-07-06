<template>
	<div class="mx-[10px] mt-[10px] bg-white dark:bg-[--next-color-disabled] rounded-[7px] dark:[data-theme='dark']_&:bg-[--next-color-disabled]">
		<div v-if="content.title" class="px-[15px] py-[10px] border-b border-[#e5e5e5] dark:border-[--next-border-color] text-[16px] font-medium dark:[data-theme='dark']_&:border-[--next-border-color]">
			<div class="text-black dark:text-[--next-color-white] dark:[data-theme='dark']_&:text-[--next-color-white]">{{ content.title }}</div>
		</div>
		<div v-if="content.style == 1" class="flex flex-wrap pt-[20px] pb-[10px]">
			<div v-for="(item, index) in content.data" :key="index" class="flex flex-col items-center w-1/4 mb-[15px]">
				<decoration-img width="26px" height="26px" :src="item.image" alt="" />
				<div class="mt-[7px] text-black dark:text-[--next-color-white] dark:[data-theme='dark']_&:text-[--next-color-white]">{{ item.name }}</div>
			</div>
		</div>
		<div v-if="content.style == 2">
			<div v-for="(item, index) in content.data" :key="index" class="flex items-center border-b border-[#e5e5e5] dark:border-[--next-border-color] h-[50px] px-[12px] dark:[data-theme='dark']_&:border-[--next-border-color]">
				<decoration-img width="24px" height="24px" :src="item.image" alt="" />
				<div class="ml-[10px] flex-1 text-black dark:text-[--next-color-white] dark:[data-theme='dark']_&:text-[--next-color-white]">{{ item.name }}</div>
				<div class="text-black dark:text-[--next-color-white] dark:[data-theme='dark']_&:text-[--next-color-white]">
					<el-icon><ArrowRight /></el-icon>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
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
