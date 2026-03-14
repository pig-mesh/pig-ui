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

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, CanvasRenderer]);

/**
 * 国际化工具
 */
const { t } = useI18n();

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

/**
 * 图表配置选项（使用 computed 实现国际化动态更新）
 */
const option = computed(() => ({
	title: {
		textStyle: {
			fontSize: 16,
			fontWeight: 500,
			color: '#303133',
		},
		padding: [20, 0, 0, 20],
	},
	tooltip: {
		trigger: 'axis',
		backgroundColor: '#ffffff',
		borderRadius: 8,
		padding: [12, 16],
		borderWidth: 0,
		shadowColor: 'rgba(0, 0, 0, 0.1)',
		shadowBlur: 12,
		shadowOffsetY: 4,
		textStyle: {
			color: '#303133',
		},
		axisPointer: {
			type: 'line',
			lineStyle: {
				color: '#ebeef5',
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
			color: '#606266',
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
			color: '#909399',
			fontSize: 12,
			margin: 16,
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: '#ebeef5',
				type: 'dashed',
			},
		},
	},
	yAxis: {
		type: 'value',
		splitLine: {
			lineStyle: {
				color: '#ebeef5',
				type: 'dashed',
			},
		},
		axisLabel: {
			color: '#909399',
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
				color: '#79bbff',
				borderColor: '#fff',
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
							color: 'rgba(121, 187, 255, 0.2)',
						},
						{
							offset: 1,
							color: 'rgba(121, 187, 255, 0.02)',
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
				color: '#909399',
				borderColor: '#fff',
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
							color: 'rgba(144, 147, 153, 0.2)',
						},
						{
							offset: 1,
							color: 'rgba(144, 147, 153, 0.02)',
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
