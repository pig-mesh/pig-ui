<script lang="ts">
export default {
	title: '工作流信息',
	icon: 'PieChart',
	description: '获取工作流信息展示',
};
</script>
<template>
	<el-card class="flow-card h-[191px]">
		<div class="flex h-full">
			<!-- 待办任务 -->
			<router-link to="/flow/task/pending" class="stat-card flex-1 flex flex-col items-center justify-center">
				<p class="text-4xl font-bold tabular-nums text-gray-800 dark:text-gray-100">{{ state.pendingNum }}</p>
				<p class="text-sm text-gray-400 mt-2">{{ $t('home.pendingTask') }}</p>
			</router-link>
			<div class="w-px self-center h-12 bg-gray-200 dark:bg-gray-700"></div>
			<!-- 抄送任务 -->
			<router-link to="/flow/task/cc" class="stat-card flex-1 flex flex-col items-center justify-center">
				<p class="text-4xl font-bold tabular-nums text-gray-800 dark:text-gray-100">{{ state.copyNum }}</p>
				<p class="text-sm text-gray-400 mt-2">{{ $t('home.copyTask') }}</p>
			</router-link>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="flowData">
const state = reactive({
	pendingNum: 0,
	copyNum: 0,
});
</script>
<style scoped>
.stat-card {
	text-decoration: none;
}

.flow-card :deep(.el-card__body) {
	padding: 0;
	height: 100%;
}
</style>
