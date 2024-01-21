<script lang="ts">
export default {
	title: '工作流信息',
	icon: 'PieChart',
	description: '获取工作流信息展示',
};
</script>
<template>
	<el-card class="flex items-center justify-center h-[191px]">
		<div class="relative flex items-center justify-center">
			<!-- 待办任务 -->
			<div class="flex-row items-center w-auto">
				<div class="p-3 rounded-full bg-lightPrimary dark:bg-navy-700">
					<span class="flex items-center text-brand-500 dark:text-white">
						<svg
							t="1697994355915"
							class="icon"
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="8441"
							width="32"
							height="32"
						>
							<path
								d="M404.266667 85.333333v78.933334h236.8V85.333333h78.933333v78.933334h157.866667A39.466667 39.466667 0 0 1 917.333333 203.733333v631.466667A39.466667 39.466667 0 0 1 877.866667 874.666667H167.466667A39.466667 39.466667 0 0 1 128 835.2V203.733333A39.466667 39.466667 0 0 1 167.466667 164.266667h157.866666V85.333333h78.933334zM838.4 361.6H206.933333V795.733333h631.466667V361.6z m-195.904 84.309333l55.808 55.786667-195.370667 195.370667-139.562666-139.562667 55.893333-55.808 83.712 83.754667 139.541333-139.541334h-0.021333z"
								fill="#8a8a8a"
								p-id="8442"
							></path>
						</svg>
					</span>
				</div>
			</div>
			<router-link to="/flow/task/pending">
				<div class="flex flex-col justify-center w-auto ml-4 h-50">
					<p class="text-sm font-medium text-gray-600 font-dm">{{ $t('home.pendingTask') }}</p>
					<h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ state.pendingNum }}</h4>
				</div>
			</router-link>
			<!-- 抄送任务 -->
			<div class="flex-row items-center w-auto ml-8">
				<div class="p-3 rounded-full bg-lightPrimary dark:bg-navy-700">
					<span class="flex items-center text-brand-500 dark:text-white">
						<svg
							t="1697994410210"
							class="icon"
							viewBox="0 0 1024 1024"
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							p-id="9746"
							width="32"
							height="32"
						>
							<path
								d="M382.293 692.497a37.956 37.956 0 0 1-32.29 7.373v0.205l-278.118-84.31a39.39 39.39 0 0 1-5.803-73.113l862.14-420.045a39.39 39.39 0 0 1 55.432 45.056L823.228 800.358a39.39 39.39 0 0 1-49.63 27.99l-295.595-89.566a15.428 15.428 0 0 1-12.083-14.814c0-4.437 1.98-8.397 5.12-11.196l356.762-401.135-445.44 380.792h-0.069z m98.031 93.867l54 17.886a15.428 15.428 0 0 1 7.986 23.142l-53.93 81.92a15.428 15.428 0 0 1-28.33-8.533v-99.806a15.428 15.428 0 0 1 20.274-14.61z"
								p-id="9747"
								fill="#8a8a8a"
							></path>
						</svg>
					</span>
				</div>
			</div>
			<router-link to="/flow/task/cc">
				<div class="flex flex-col justify-center w-auto ml-4 h-50">
					<p class="text-sm font-medium text-gray-600 font-dm">{{ $t('home.copyTask') }}</p>
					<h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ state.copyNum }}</h4>
				</div>
			</router-link>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="flowData">
import { queryTaskData } from '/@/api/flow/task';

const state = reactive({
	pendingNum: 0,
	copyNum: 0,
});

onMounted(async () => {
	try {
		const { data } = await queryTaskData();
		state.pendingNum = Number.parseInt(data?.pendingNum || 0);
		state.copyNum = Number.parseInt(data?.copyNum || 0);
	} catch (error) {
		// 避免没有启动 flow模块 vue 组件渲染 warning
	}
});
</script>
<style scoped>
.el-col {
	text-align: center;
}
</style>
