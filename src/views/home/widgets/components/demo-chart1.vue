<script lang="ts">
export default {
  title: '示例图表1',
  icon: 'DocumentCopy',
  description: '示例图表无意义，可删除',
};
</script>
<template>
  <el-card class="relative h-full">
    <v-chart class="w-full h-80" :option="option"/>
  </el-card>
</template>
<script setup lang="ts" name="demo-chart1">
import VChart from 'vue-echarts';
import {use} from 'echarts/core';
import {PieChart} from 'echarts/charts';
import {TooltipComponent, LegendComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';


use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

const colorPalette = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const option = reactive({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textStyle: { color: '#374151', fontSize: 13 },
    padding: [8, 12],
  },
  legend: {
    data: ['Java17', 'Java8', 'Other'],
    bottom: 0,
    textStyle: { fontSize: 12, color: '#9ca3af' },
    icon: 'circle',
    itemWidth: 8,
    itemHeight: 8,
    itemGap: 16,
  },
  color: colorPalette,
  series: [
    {
      name: 'Java',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],
      label: {
        position: 'inner',
        fontSize: 12,
        color: '#fff',
      },
      labelLine: {
        show: false,
      },
      data: [
        {value: 1548, name: 'Java17'},
        {value: 775, name: 'Java8'},
        {value: 679, name: 'Other', selected: true},
      ],
    },
    {
      name: '使用率',
      type: 'pie',
      radius: ['45%', '60%'],
      labelLine: {
        length: 20,
        lineStyle: { color: '#d1d5db' },
      },
      label: {
        formatter: '{b}: {d}%',
        fontSize: 12,
        color: '#6b7280',
      },
      data: [
        {value: 1048, name: 'Java17'},
        {value: 335, name: 'Java8'},
        {value: 310, name: 'Other'},
      ],
    },
  ],
});
</script>
