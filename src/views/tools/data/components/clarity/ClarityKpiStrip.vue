<script setup lang="ts">
import { Aim, Document, Pointer, TrendCharts, User } from '@element-plus/icons-vue';
import type { Component } from 'vue';
import type { MetricCard, MetricIconName } from './types';

defineProps<{
	items: MetricCard[];
}>();

const iconMap: Record<MetricIconName, Component> = {
	sessions: User,
	visitors: User,
	pages: Document,
	scroll: TrendCharts,
	deadClick: Aim,
	rageClick: Pointer,
};
</script>

<template>
	<section class="kpi-strip" aria-label="站点核心指标">
		<article v-for="item in items" :key="item.label" class="kpi-item">
			<div class="flex min-w-0 items-center gap-2.5">
				<span class="kpi-icon" aria-hidden="true">
					<el-icon><component :is="iconMap[item.icon]" /></el-icon>
				</span>
				<span class="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{{ item.label }}</span>
			</div>
			<p class="mt-3 mb-0 text-[28px] font-semibold leading-none tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
				{{ item.value }}
			</p>
			<div class="sparkline" aria-hidden="true">
				<span
					v-for="(height, index) in item.bars"
					:key="index"
					class="spark-bar"
					:class="{ 'is-active': index === item.bars.length - 1 }"
					:style="{ height: `${height}%` }"
				/>
			</div>
		</article>
	</section>
</template>

<style scoped>
.kpi-strip {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	overflow: hidden;
	border: 1px solid var(--el-border-color-lighter);
	border-radius: 12px;
	background: var(--el-bg-color);
	box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
}

.kpi-item {
	min-width: 0;
	padding: 18px 20px 16px;
	border-bottom: 1px solid var(--el-border-color-lighter);
}

.kpi-item:nth-child(odd) {
	border-right: 1px solid var(--el-border-color-lighter);
}

.kpi-icon {
	display: inline-flex;
	height: 24px;
	width: 24px;
	flex: none;
	align-items: center;
	justify-content: center;
	color: var(--el-color-primary);
	font-size: 18px;
}

.sparkline {
	display: flex;
	height: 30px;
	align-items: flex-end;
	gap: 5px;
	margin-top: 16px;
}

.spark-bar {
	min-width: 4px;
	flex: 1;
	border-radius: 3px 3px 1px 1px;
	background: var(--el-color-primary-light-8);
	transition: height 0.3s ease;
}

.spark-bar.is-active {
	background: var(--el-color-primary);
}

@media (min-width: 768px) {
	.kpi-strip {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.kpi-item:nth-child(odd) {
		border-right: 0;
	}

	.kpi-item:not(:nth-child(3n)) {
		border-right: 1px solid var(--el-border-color-lighter);
	}
}

@media (min-width: 1280px) {
	.kpi-strip {
		grid-template-columns: repeat(6, minmax(0, 1fr));
	}

	.kpi-item {
		border-bottom: 0;
	}

	.kpi-item:not(:last-child) {
		border-right: 1px solid var(--el-border-color-lighter);
	}
}

[data-theme='dark'] .spark-bar {
	background: var(--el-color-primary-light-9);
}

[data-theme='dark'] .spark-bar.is-active {
	background: var(--el-color-primary-light-3);
}
</style>
