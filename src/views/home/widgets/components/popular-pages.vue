<script lang="ts">
export default {
	title: '热门页面',
	icon: 'TrendCharts',
	description: 'Clarity 热门页面访问排行',
};
</script>
<template>
	<el-card v-loading="loading" class="box-card h-96">
		<template #header>
			<div class="flex items-center justify-between">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">热门页面</span>
			</div>
		</template>
		<template v-if="!loading && pageList.length === 0">
			<div class="flex min-h-0 flex-1 items-center justify-center">
				<el-empty description="暂无页面数据" :image-size="80" />
			</div>
		</template>
		<template v-else-if="pageList.length > 0">
			<div class="flex min-h-0 flex-1 items-center">
				<div class="h-[220px] w-full">
					<v-chart class="h-full w-full" :option="chartOption" autoresize />
				</div>
			</div>
		</template>
	</el-card>
</template>
<script setup lang="ts" name="popular-pages">
import { systemClarity } from '/@/api/admin/system';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useThemeConfig } from '/@/stores/themeConfig';
import { auth } from '/@/utils/authFunction';

use([BarChart, TooltipComponent, GridComponent, CanvasRenderer]);

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const isDark = computed(() => themeConfig.value.isDark);

const loading = ref(true);
const pageList = ref<{ name: string; value: number }[]>([]);

const shortenUrl = (url: string) => {
	try {
		const u = new URL(url);
		return u.pathname || url;
	} catch {
		return url.replace(/^https?:\/\/[^/]+/, '') || url;
	}
};

const darkColors = computed(() => ({
	axisLine: isDark.value ? '#374151' : '#e5e7eb',
	gridLine: isDark.value ? '#1f2937' : '#f3f4f6',
	label: isDark.value ? '#d1d5db' : '#6b7280',
}));

const chartOption = computed(() => {
	const top5 = pageList.value.slice(0, 5).reverse();
	const { axisLine, gridLine, label } = darkColors.value;
	return {
		tooltip: {
			trigger: 'axis',
			axisPointer: { type: 'shadow' },
			formatter: (params: any) => {
				const item = params[0];
				return `${top5[item.dataIndex]?.name ?? item.name}<br/>访问次数: <b>${item.value.toLocaleString()}</b>`;
			},
		},
		grid: { top: 12, right: 24, bottom: 12, left: 8, containLabel: true },
		xAxis: {
			type: 'value',
			axisLine: { lineStyle: { color: axisLine } },
			axisLabel: { color: label, fontSize: 12 },
			splitLine: { lineStyle: { color: gridLine, type: 'dashed' } },
		},
		yAxis: {
			type: 'category',
			data: top5.map((p) => shortenUrl(p.name)),
			axisLine: { show: false },
			axisTick: { show: false },
			axisLabel: {
				color: label,
				fontSize: 12,
				width: 120,
				overflow: 'truncate',
			},
		},
		series: [
			{
				type: 'bar',
				data: top5.map((p) => p.value),
				barWidth: 16,
				itemStyle: {
					borderRadius: [0, 4, 4, 0],
					color: {
						type: 'linear',
						x: 0,
						y: 0,
						x2: 1,
						y2: 0,
						colorStops: [
							{ offset: 0, color: '#4338ca' },
							{ offset: 1, color: '#818cf8' },
						],
					},
				},
				emphasis: {
					itemStyle: { opacity: 0.85 },
				},
			},
		],
	};
});

onMounted(async () => {
	if (!auth('sys_clarity_view')) {
		loading.value = false;
		return;
	}
	try {
		const { data } = await systemClarity();
		if (data?.topUrls) {
			pageList.value = JSON.parse(data.topUrls);
		}
	} catch {
		// 静默处理
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
:deep(.el-card__body) {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
