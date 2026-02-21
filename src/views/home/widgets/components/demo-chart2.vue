<script lang="ts">
export default {
	title: '示例图表2',
	icon: 'DocumentCopy',
	description: '示例图表无意义，可删除',
};
</script>
<template>
	<el-card class="relative h-full">
		<v-chart class="w-full h-80" :option="option" />
	</el-card>
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { ScatterChart } from 'echarts/charts';
import { TitleComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useThemeConfig } from '/@/stores/themeConfig';

use([TitleComponent, ScatterChart, CanvasRenderer, GridComponent]);

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const isDark = computed(() => themeConfig.value.isDark);

const axisLineColor = computed(() => isDark.value ? '#374151' : '#e5e7eb');
const gridLineColor = computed(() => isDark.value ? '#1f2937' : '#f3f4f6');
const labelColor = computed(() => isDark.value ? '#9ca3af' : '#9ca3af');

const option = computed(() => ({
	xAxis: {
		axisLine: { lineStyle: { color: axisLineColor.value } },
		axisLabel: { color: labelColor.value, fontSize: 12 },
		splitLine: { lineStyle: { color: gridLineColor.value } },
	},
	yAxis: {
		axisLine: { show: false },
		axisLabel: { color: labelColor.value, fontSize: 12 },
		splitLine: { lineStyle: { color: gridLineColor.value, type: 'dashed' } },
	},
	grid: { top: 16, right: 16, bottom: 32, left: 40 },
	series: [
		{
			symbolSize: 14,
			itemStyle: {
				color: '#3b82f6',
				opacity: 0.7,
			},
			emphasis: {
				itemStyle: { opacity: 1, shadowBlur: 8, shadowColor: 'rgba(59,130,246,0.3)' },
			},
			data: [
				[10.0, 8.04],
				[8.07, 6.95],
				[13.0, 7.58],
				[9.05, 8.81],
				[11.0, 8.33],
				[14.0, 7.66],
				[13.4, 6.81],
				[10.0, 6.33],
				[14.0, 8.96],
				[12.5, 6.82],
				[9.15, 7.2],
				[11.5, 7.2],
				[3.03, 4.23],
				[12.2, 7.83],
				[2.02, 4.47],
				[1.05, 3.33],
				[4.05, 4.96],
				[6.03, 7.24],
				[12.0, 6.26],
				[12.0, 8.84],
				[7.08, 5.82],
				[5.02, 5.68],
			],
			type: 'scatter',
		},
	],
}));
</script>
