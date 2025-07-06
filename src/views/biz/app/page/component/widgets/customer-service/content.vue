<template>
	<div class="mx-4 my-2.5 rounded-lg pt-12 px-14 pb-20 bg-white dark:bg-slate-900 flex flex-col justify-center items-center shadow-sm dark:shadow-slate-800/20 border border-gray-100 dark:border-slate-700 transition-colors duration-300">
		<decoration-img 
			width="140px" 
			height="140px" 
			:src="content.qrcode" 
			alt="" 
			class="rounded-lg shadow-md dark:shadow-slate-800/40"
		/>
		<div class="text-[15px] mt-[7px] font-medium text-gray-900 dark:text-slate-100">{{ content.title }}</div>
		<div class="text-gray-600 dark:text-slate-400 mt-[20px]">服务时间：{{ content.time }}</div>
		<div class="text-gray-600 dark:text-slate-400 mt-[7px]">客服电话：{{ content.mobile }}</div>
		<div class="text-white text-[16px] rounded-[42px] bg-[#4173FF] hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 w-full h-[42px] flex justify-center items-center mt-[50px] cursor-pointer transition-colors duration-200 font-medium shadow-sm">
			保存二维码图片
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
