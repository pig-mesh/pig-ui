<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div
				class="p-4 min-w-[375px] md:min-w-[700px] xl:min-w-[800px] mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6"
			>
				<div
					v-for="(item, index) in 6"
					:key="index"
					class="relative flex flex-grow !flex-row flex-col items-center rounded-[10px] border-[1px] border-gray-200 bg-white hover:scale-105 hover:shadow-lg bg-clip-border shadow-md shadow-[#F3F3F3] dark:border-[#ffffff33] dark:!bg-[#1d1d1d] dark:text-white dark:shadow-none"
				>
					<div class="ml-[18px] flex h-[90px] w-auto flex-row items-center">
						<div class="p-3 rounded-full bg-lightPrimary dark:bg-navy-700">
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
					<div class="flex flex-col justify-center w-auto ml-4 h-50">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400 font-dm">{{ labels[index] }}</p>
						<h4 class="text-xl font-bold text-navy-700 dark:text-white">{{ values[index] }}</h4>
					</div>
				</div>
			</div>

			<div class="sm:flex">
				<el-card class="sm:mr-4 flex-1 !border-none mt-4 !bg-transparent dark:!bg-transparent" shadow="never">
					<div>
						<div class="mb-10 font-semibold dark:text-gray-200">命令统计</div>
						<div class="flex h-[30vh] items-center" ref="commandChartRef"></div>
					</div>
				</el-card>

				<el-card class="flex-1 !border-none mt-4 !bg-transparent dark:!bg-transparent" shadow="never">
					<div>
						<div class="mb-10 font-semibold dark:text-gray-200">内存信息</div>
						<div class="flex h-[30vh] items-center" ref="memoryChartRef"></div>
					</div>
				</el-card>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="cache">
import { systemCache } from '/@/api/admin/system';
import { markRaw } from 'vue';
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

const labels = computed(() => ['Redis版本', '客户端数', '运行时间(天)', '使用内存', 'AOF是否开启', 'RDB是否成功']);

const values = computed(() => [
	baseInfo.value?.redis_version,
	baseInfo.value?.connected_clients,
	baseInfo.value?.uptime_in_days,
	baseInfo.value?.used_memory_human,
	baseInfo.value?.aof_enabled == 0 ? '开启' : '关闭',
	baseInfo.value?.aof_enabled == 'ok' ? '成功' : '失败',
]);
</script>
