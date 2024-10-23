<template>
  <v-chart class="h-80 w-full" :option="option"/>
</template>
<script setup lang="ts" name="log-line-chart">
import VChart from "vue-echarts";
import {formatPast} from '/@/utils/formatTime';
import {getSum} from '/@/api/admin/log';
import {use} from 'echarts/core'
import {LineChart} from 'echarts/charts'
import {GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent} from 'echarts/components'
import {CanvasRenderer} from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer
])


const option = reactive(
    {
      title: {
        text: '近30天请求汇总'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['成功', '失败'],
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: []
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '成功',
          type: 'line',
          stack: 'Total',
          data: [],
        },
        {
          name: '失败',
          type: 'line',
          stack: 'x',
          data: [],
          itemStyle: {
            color: '#a90000'
          }
        }
      ]
    }
)

onMounted(() => {
  getSum().then(res => {
    option.xAxis.data = res.data.map(item => formatPast(new Date(item.createTime), 'mm-dd'))
    option.series[0].data = res.data.map(item => item["0"] || 0)
    option.series[1].data = res.data.map(item => item["9"] || 0)
  })
})
</script>
