<template>
	<v-chart class="w-full h-80" :option="option" />
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from 'vue-echarts';
import { formatPast } from '/@/utils/formatTime';
import { getSum } from '/@/api/admin/log';
import { use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useI18n } from 'vue-i18n';
import { useAsyncState } from '@vueuse/core';
import { useThemeConfig } from '/@/stores/themeConfig';

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, CanvasRenderer]);

/**
 * 国际化工具
 */
const { t } = useI18n();
const { themeConfig } = storeToRefs(useThemeConfig());

/**
 * 日志统计数据项接口
 */
interface LogSumItem {
	createTime: string;
	'0'?: number;
	'9'?: number;
}

/**
 * 使用 useAsyncState 自动加载日志统计数据，消除手动 onMounted + try/catch
 */
const { state: logSumData } = useAsyncState(
	() => getSum().then(({ data }) => data as LogSumItem[]),
	[],
	{ onError: (err) => console.error('Failed to load log statistics:', err) } // eslint-disable-line no-console
);

const xAxisData = computed(() => logSumData.value.map((item) => formatPast(new Date(item.createTime), 'mm-dd')));
const successData = computed(() => logSumData.value.map((item) => item['0'] || 0));
const failureData = computed(() => logSumData.value.map((item) => item['9'] || 0));

const chartPalette = computed(() => {
	if (themeConfig.value.isDark) {
		return {
			primary: '#60a5fa',
			failure: '#9ca3af',
			textPrimary: '#f3f4f6',
			textRegular: '#d1d5db',
			textSecondary: '#9ca3af',
			tooltipBackground: '#273340',
			tooltipBorder: '#38444d',
			grid: '#38444d',
			axisPointer: '#536471',
			pointBorder: '#1e2732',
			shadow: 'rgba(0, 0, 0, 0.35)',
			primaryAreaStart: 'rgba(96, 165, 250, 0.26)',
			primaryAreaEnd: 'rgba(96, 165, 250, 0.03)',
			failureAreaStart: 'rgba(156, 163, 175, 0.18)',
			failureAreaEnd: 'rgba(156, 163, 175, 0.02)',
		};
	}

	return {
		primary: themeConfig.value.primary || '#2e5cf6',
		failure: '#6b7280',
		textPrimary: '#303133',
		textRegular: '#606266',
		textSecondary: '#6b7280',
		tooltipBackground: '#ffffff',
		tooltipBorder: '#e5e7eb',
		grid: '#e5e7eb',
		axisPointer: '#d1d5db',
		pointBorder: '#ffffff',
		shadow: 'rgba(15, 23, 42, 0.12)',
		primaryAreaStart: 'rgba(46, 92, 246, 0.22)',
		primaryAreaEnd: 'rgba(46, 92, 246, 0.02)',
		failureAreaStart: 'rgba(107, 114, 128, 0.18)',
		failureAreaEnd: 'rgba(107, 114, 128, 0.02)',
	};
});

/**
 * 图表配置选项（使用 computed 实现国际化动态更新）
 */
const option = computed(() => ({
	backgroundColor: 'transparent',
	title: {
		textStyle: {
			fontSize: 16,
			fontWeight: 500,
			color: chartPalette.value.textPrimary,
		},
		padding: [20, 0, 0, 20],
	},
	tooltip: {
		trigger: 'axis',
		backgroundColor: chartPalette.value.tooltipBackground,
		borderColor: chartPalette.value.tooltipBorder,
		borderRadius: 8,
		padding: [12, 16],
		borderWidth: 1,
		shadowColor: chartPalette.value.shadow,
		shadowBlur: 12,
		shadowOffsetY: 4,
		textStyle: {
			color: chartPalette.value.textPrimary,
		},
		axisPointer: {
			type: 'line',
			lineStyle: {
				color: chartPalette.value.axisPointer,
				width: 1,
				type: 'dashed',
			},
		},
	},
	legend: {
		data: [t('syslog.success'), t('syslog.failure')],
		icon: 'circle',
		itemWidth: 8,
		itemHeight: 8,
		textStyle: {
			color: chartPalette.value.textRegular,
			fontSize: 12,
		},
		right: '20px',
		top: '20px',
	},
	grid: {
		left: '3%',
		right: '4%',
		bottom: '3%',
		top: '15%',
		containLabel: true,
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		data: xAxisData.value,
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
		axisLabel: {
			color: chartPalette.value.textSecondary,
			fontSize: 12,
			margin: 16,
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: chartPalette.value.grid,
				type: 'dashed',
			},
		},
	},
	yAxis: {
		type: 'value',
		splitLine: {
			lineStyle: {
				color: chartPalette.value.grid,
				type: 'dashed',
			},
		},
		axisLabel: {
			color: chartPalette.value.textSecondary,
			fontSize: 12,
			margin: 16,
		},
		axisLine: {
			show: false,
		},
		axisTick: {
			show: false,
		},
	},
	series: [
		{
			name: t('syslog.success'),
			type: 'line',
			stack: 'Total',
			data: successData.value,
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			itemStyle: {
				color: chartPalette.value.primary,
				borderColor: chartPalette.value.pointBorder,
				borderWidth: 2,
			},
			lineStyle: {
				width: 3,
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: chartPalette.value.primaryAreaStart,
						},
						{
							offset: 1,
							color: chartPalette.value.primaryAreaEnd,
						},
					],
				},
			},
		},
		{
			name: t('syslog.failure'),
			type: 'line',
			stack: 'x',
			data: failureData.value,
			smooth: true,
			symbol: 'circle',
			symbolSize: 8,
			itemStyle: {
				color: chartPalette.value.failure,
				borderColor: chartPalette.value.pointBorder,
				borderWidth: 2,
			},
			lineStyle: {
				width: 3,
			},
			areaStyle: {
				color: {
					type: 'linear',
					x: 0,
					y: 0,
					x2: 0,
					y2: 1,
					colorStops: [
						{
							offset: 0,
							color: chartPalette.value.failureAreaStart,
						},
						{
							offset: 1,
							color: chartPalette.value.failureAreaEnd,
						},
					],
				},
			},
		},
	],
}));
</script>

<style scoped>
:deep(.echarts) {
	background: transparent;
}
</style>
