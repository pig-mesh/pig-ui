<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <div
          class="p-4 min-w-[375px] md:min-w-[700px] xl:min-w-[800px] mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <div
            class="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-blue-50 hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div class="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="h-7 w-7"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                        </svg>
                        </span>
            </div>
          </div>
          <div class="h-50 ml-4 flex w-auto flex-col justify-center">
            <p class="font-dm text-sm font-medium text-gray-600">Redis版本</p>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ baseInfo.redis_version }}</h4>
          </div>
        </div>
        <div
            class="relative flex flex-grow !flex-row flex-col items-center rounded-[10px]  border-[1px] border-gray-200 bg-blue-50 hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div class="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            class="h-6 w-6"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M298.39 248a4 4 0 002.86-6.8l-78.4-79.72a4 4 0 00-6.85 2.81V236a12 12 0 0012 12z"></path>
                            <path
                                d="M197 267a43.67 43.67 0 01-13-31v-92h-72a64.19 64.19 0 00-64 64v224a64 64 0 0064 64h144a64 64 0 0064-64V280h-92a43.61 43.61 0 01-31-13zm175-147h70.39a4 4 0 002.86-6.8l-78.4-79.72a4 4 0 00-6.85 2.81V108a12 12 0 0012 12z"></path>
                            <path
                                d="M372 152a44.34 44.34 0 01-44-44V16H220a60.07 60.07 0 00-60 60v36h42.12A40.81 40.81 0 01231 124.14l109.16 111a41.11 41.11 0 0111.83 29V400h53.05c32.51 0 58.95-26.92 58.95-60V152z"></path>
                        </svg>
                        </span>
            </div>
          </div>
          <div class="h-50 ml-4 flex w-auto flex-col justify-center">
            <p class="font-dm text-sm font-medium text-gray-600">客户端数</p>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ baseInfo.connected_clients }}</h4>
          </div>
        </div>
        <div
            class="relative flex flex-grow !flex-row flex-col items-center rounded-[10px]  border-[1px] border-gray-200 bg-blue-50 hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div class="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="h-7 w-7"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                        </svg>
                        </span>
            </div>
          </div>
          <div class="h-50 ml-4 flex w-auto flex-col justify-center">
            <p class="font-dm text-sm font-medium text-gray-600">运行时间(天)</p>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ baseInfo.uptime_in_days }}</h4>
          </div>
        </div>
        <div
            class="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-blue-50 hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div class="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="h-6 w-6"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                        </svg>
                        </span>
            </div>
          </div>
          <div class="h-50 ml-4 flex w-auto flex-col justify-center">
            <p class="font-dm text-sm font-medium text-gray-600">使用内存</p>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ baseInfo.used_memory_human }}</h4>
          </div>
        </div>
        <div
            class="relative flex flex-grow !flex-row flex-col items-center rounded-[10px]  border-[1px] border-gray-200 bg-blue-50 hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div class="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            class="h-7 w-7"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M4 9h4v11H4zM16 13h4v7h-4zM10 4h4v16h-4z"></path>
                        </svg>
                        </span>
            </div>
          </div>
          <div class="h-50 ml-4 flex w-auto flex-col justify-center">
            <p class="font-dm text-sm font-medium text-gray-600">AOF是否开启</p>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ baseInfo.aof_enabled == 0 ? '开启' : '关闭' }}</h4>
          </div>
        </div>
        <div
            class="relative flex flex-grow !flex-row items-center rounded-[10px]  border-[1px] border-gray-200 bg-blue-50 hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-navy-800 dark:text-white dark:shadow-none">
          <div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
            <div class="rounded-full bg-lightPrimary p-3 dark:bg-navy-700">
                        <span class="flex items-center text-brand-500 dark:text-white">
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 512 512"
                            class="h-6 w-6"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M208 448V320h96v128h97.6V256H464L256 64 48 256h62.4v192z"></path>
                        </svg>
                        </span>
            </div>
          </div>
          <div class="h-50 ml-4 flex w-auto flex-col justify-center">
            <p class="font-dm text-sm font-medium text-gray-600">RDB是否成功</p>
            <h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ baseInfo.aof_enabled == 'ok' ? '成功' : '失败' }}</h4>
          </div>
        </div>
      </div>

      <div class="sm:flex">
        <!-- 命令统计 -->
        <el-card class="sm:mr-4 flex-1 !border-none mt-4" shadow="never">
          <div>
            <div class="mb-10 font-semibold">命令统计</div>
            <div class="flex h-[30vh] items-center" ref="commandChartRef"></div>
          </div>
        </el-card>

        <!-- 内存信息 -->
        <el-card class="flex-1 !border-none mt-4" shadow="never">
          <div>
            <div class="mb-10 font-semibold">内存信息</div>
            <div class="flex h-[30vh] items-center" ref="memoryChartRef"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="cache">
import {systemCache} from '/@/api/admin/system';
import {markRaw} from 'vue';
import * as echarts from 'echarts';

const baseInfo = ref<any>({});
const commandChartRef = ref();
const memoryChartRef = ref();

const chartOptions = reactive({
  commandChartOption: {
    tooltip: {
      trigger: 'item',
      // formatter: '{b} : {d}%'
    },

    series: [
      {
        label: {
          show: true,
        },
        labelLine: {
          show: true,
        },
        type: 'pie',
        radius: '85%',
        color: [
          '#0D47A1',
          '#1565C0',
          '#1976D2',
          '#1E88E5',
          '#2196F3',
          '#42A5F5',
          '#64B5F6',
          '#90CAF9',
          '#BBDEFB',
          '#E3F2FD',
          '#CAF0F8',
          '#ADE8F4',
          '#90E0EF',
          '#48CAE4',
          '#00B4D8',
          '#0096C7',
          '#0077B6',
          '#023E8A',
          '#03045E',
          '#8ecae6',
          '#98c1d9',
          '#D9ED92',
          '#B5E48C',
          '#99D98C',
          '#76C893',
          '#52B69A',
          '#34A0A4',
          '#168AAD',
          '#1A759F',
          '#1E6091',
          '#184E77',
          '#457b9d',
        ],
        data: [
          {
            value: '',
            name: '',
          },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  },

  memoryChartOption: {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: 'Pressure',
        type: 'gauge',
        radius: '100%',
        detail: {
          formatter: '{value}',
        },
        data: [
          {
            value: '',
            name: '内存消耗',
          },
        ],
      },
    ],
  },
});

const getSystemCache = async () => {
  const res = await systemCache();

  baseInfo.value = res.data.info;
  baseInfo.value.dbSize = res.data.dbSize;

  chartOptions.commandChartOption.series[0].data = res.data.commandStats;

  chartOptions.memoryChartOption.series[0].data[0].value = (res.data.info.used_memory / 1024 / 1024).toFixed(2);
  chartOptions.memoryChartOption.series[0].detail.formatter = '{value}' + 'M';

  const commandChart = markRaw(echarts.init(commandChartRef.value));
  const memoryChart = markRaw(echarts.init(memoryChartRef.value));
  commandChart.setOption(chartOptions.commandChartOption);
  memoryChart.setOption(chartOptions.memoryChartOption);
};

getSystemCache();
</script>

<style scoped>
.el-table .el-table__cell {
  min-width: 120px;
}
</style>
