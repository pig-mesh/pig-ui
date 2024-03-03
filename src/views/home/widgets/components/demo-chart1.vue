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
import {useTagsViewRoutes} from "/@/stores/tagsViewRoutes";
import {useMessage} from "/@/hooks/message";


use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

const option = reactive({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
  },
  legend: {
    data: ['Java17', 'Java8', 'Other'],
  },
  series: [
    {
      name: 'Java',
      type: 'pie',
      selectedMode: 'single',
      radius: [0, '30%'],
      label: {
        position: 'inner',
        fontSize: 14,
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
        length: 30,
      },
      label: {
        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
        backgroundColor: '#F6F8FC',
        borderColor: '#8C8D8E',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
          a: {
            color: '#6E7079',
            lineHeight: 22,
            align: 'center',
          },
          hr: {
            borderColor: '#8C8D8E',
            width: '100%',
            borderWidth: 1,
            height: 0,
          },
          b: {
            color: '#4C5058',
            fontSize: 14,
            fontWeight: 'bold',
            lineHeight: 33,
          },
          per: {
            color: '#fff',
            backgroundColor: '#4C5058',
            padding: [3, 4],
            borderRadius: 4,
          },
        },
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
