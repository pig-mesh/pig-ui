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

use([TitleComponent, ScatterChart, CanvasRenderer, GridComponent]);
const option = reactive({
	xAxis: {},
	yAxis: {},
	series: [
		{
			symbolSize: 20,
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
});
</script>
