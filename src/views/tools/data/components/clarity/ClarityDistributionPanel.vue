<script setup lang="ts">
import { ChromeFilled, Monitor } from '@element-plus/icons-vue';
import type { Component } from 'vue';
import VChart from 'vue-echarts';
import type { DistributionItem, DistributionKind } from './types';

defineProps<{
	title: string;
	kind: DistributionKind;
	items: DistributionItem[];
	colors: string[];
	chartOption: object;
}>();

const iconMap: Record<DistributionKind, Component> = {
	device: Monitor,
	browser: ChromeFilled,
};
</script>

<template>
	<section class="panel-surface">
		<header class="panel-header">
			<el-icon class="text-base text-slate-500 dark:text-slate-400">
				<component :is="iconMap[kind]" />
			</el-icon>
			<h2 class="m-0 text-[15px] font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
		</header>

		<div class="grid min-h-[236px] items-center gap-4 px-5 py-4 sm:grid-cols-[minmax(180px,1fr)_180px]">
			<v-chart class="h-[220px] w-full min-w-0" :option="chartOption" autoresize />
			<div class="space-y-4">
				<div v-for="(item, index) in items.slice(0, 3)" :key="item.name" class="min-w-0">
					<div class="flex items-center gap-2 text-[13px]">
						<span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: colors[index % colors.length] }" />
						<span class="min-w-0 flex-1 truncate text-slate-600 dark:text-slate-300">{{ item.name }}</span>
					</div>
					<div class="mt-1.5 pl-[18px]">
						<strong class="text-lg font-semibold leading-none text-slate-900 tabular-nums dark:text-slate-100">{{ item.percentage }}%</strong>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.panel-surface {
	overflow: hidden;
	border: 1px solid var(--el-border-color-lighter);
	border-radius: 12px;
	background: var(--el-bg-color);
	box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.panel-header {
	display: flex;
	align-items: center;
	gap: 10px;
	padding: 15px 20px;
	border-bottom: 1px solid var(--el-border-color-lighter);
}
</style>
