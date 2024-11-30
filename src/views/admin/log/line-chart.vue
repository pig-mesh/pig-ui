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

use([TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent, GridComponent, LineChart, CanvasRenderer]);

const option = reactive({
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
		data: ['成功', '失败'],
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
		data: [],
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
			name: '成功',
			type: 'line',
			stack: 'Total',
			data: [],
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
			name: '失败',
			type: 'line',
			stack: 'x',
			data: [],
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
});

interface LogSumItem {
	createTime: string;
	'0'?: number;
	'9'?: number;
}

onMounted(() => {
	getSum().then((res) => {
		option.xAxis.data = res.data.map((item: LogSumItem) => formatPast(new Date(item.createTime), 'mm-dd'));
		option.series[0].data = res.data.map((item: LogSumItem) => item['0'] || 0);
		option.series[1].data = res.data.map((item: LogSumItem) => item['9'] || 0);
	});
});
</script>

<style scoped>
:deep(.echarts) {
	background: transparent;
}
</style>
