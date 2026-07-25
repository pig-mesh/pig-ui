<script setup lang="ts">
import { Document, Download, Link, TrendCharts } from '@element-plus/icons-vue';
import type { Component } from 'vue';
import type { RankingItem, RankingKind } from './types';

withDefaults(
	defineProps<{
		title: string;
		kind: RankingKind;
		items: RankingItem[];
		unit: string;
		actionLabel?: string;
	}>(),
	{
		actionLabel: '',
	}
);

const emit = defineEmits<{
	action: [];
}>();

const iconMap: Record<RankingKind, Component> = {
	referrer: Link,
	title: Document,
	popular: TrendCharts,
};
</script>

<template>
	<section class="panel-surface">
		<header class="panel-header">
			<div class="flex min-w-0 items-center gap-2.5">
				<el-icon class="text-base text-slate-500 dark:text-slate-400">
					<component :is="iconMap[kind]" />
				</el-icon>
				<h2 class="m-0 truncate text-[15px] font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
			</div>
			<button v-if="actionLabel" type="button" class="action-button" @click="emit('action')">
				<el-icon><Download /></el-icon>
				{{ actionLabel }}
			</button>
		</header>

		<div class="px-5 py-2">
			<div
				class="grid grid-cols-[32px_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 py-2 text-xs font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400"
			>
				<span>排名</span>
				<span>{{ kind === 'title' ? '页面标题' : '来源页面' }}</span>
				<span class="text-right">{{ unit }}</span>
			</div>

			<div class="divide-y divide-slate-100 dark:divide-slate-700">
				<div v-for="(item, index) in items" :key="`${item.name}-${index}`" class="ranking-row">
					<span class="rank-badge">{{ index + 1 }}</span>
					<div class="min-w-0">
						<div class="truncate text-[13px] font-medium text-slate-800 dark:text-slate-100" :title="item.name">
							{{ item.displayName }}
						</div>
						<div class="mt-2 h-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
							<span class="progress-fill" :class="{ 'is-cyan': kind === 'title' }" :style="{ width: `${item.progress}%` }" />
						</div>
					</div>
					<span class="text-right text-xs text-slate-500 tabular-nums dark:text-slate-400"> {{ item.value.toLocaleString() }} {{ unit }} </span>
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
	min-height: 54px;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 12px 20px;
	border-bottom: 1px solid var(--el-border-color-lighter);
}

.ranking-row {
	display: grid;
	grid-template-columns: 32px minmax(0, 1fr) auto;
	align-items: center;
	gap: 12px;
	padding: 12px 0;
}

.rank-badge {
	display: inline-flex;
	height: 22px;
	width: 22px;
	align-items: center;
	justify-content: center;
	border-radius: 6px;
	background: var(--el-color-primary);
	color: white;
	font-size: 12px;
	font-weight: 600;
}

.progress-fill {
	display: block;
	height: 100%;
	border-radius: inherit;
	background: var(--el-color-primary);
	transition: width 0.5s ease;
}

.progress-fill.is-cyan {
	background: #1d9bf0;
}

.action-button {
	display: inline-flex;
	flex: none;
	cursor: pointer;
	align-items: center;
	gap: 6px;
	border: 0;
	border-radius: 8px;
	background: var(--el-color-primary-light-9);
	padding: 7px 10px;
	color: var(--el-color-primary);
	font-size: 12px;
	font-weight: 500;
	transition: background-color 0.2s ease, color 0.2s ease;
}

.action-button:hover {
	background: var(--el-color-primary);
	color: white;
}
</style>
