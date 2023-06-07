<template>
	<div class="layout-padding cache">
		<el-card class="!border-none" shadow="never">
			<div>
				<div class="mb-4 lg">基本信息</div>

				<div class="el-table--enable-row-transition el-table--large el-table">
					<el-scrollbar>
						<table class="el-table__body" cellspacing="0">
							<tbody>
								<tr class="el-table__row">
									<td class="el-table__cell">
										<div class="cell">Redis版本</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">{{ baseInfo.redis_version }}</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">运行模式</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">
											{{ baseInfo.redis_mode == 'standalone' ? '单机' : '集群' }}
										</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">端口</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">{{ baseInfo.tcp_port }}</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">客户端数</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">{{ baseInfo.connected_clients }}</div>
									</td>
								</tr>
								<tr class="el-table__row">
									<td class="el-table__cell">
										<div class="cell">运行时间(天)</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">{{ baseInfo.uptime_in_days }}</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">使用内存</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">
											{{ baseInfo.used_memory_human }}
										</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">使用CPU</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">
											{{ baseInfo.used_cpu_user_children }}
										</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">内存配置</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">{{ baseInfo.maxmemory_human }}</div>
									</td>
								</tr>
								<tr class="el-table__row">
									<td class="el-table__cell">
										<div class="cell">AOF是否开启</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">
											{{ baseInfo.aof_enabled == 0 ? '开启' : '关闭' }}
										</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">RDB是否成功</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">
											{{ baseInfo.aof_enabled == 'ok' ? '成功' : '失败' }}
										</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">Key数量</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">{{ baseInfo.dbSize }}</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">网络入口/出口</div>
									</td>
									<td class="el-table__cell">
										<div class="cell">
											{{ baseInfo.instantaneous_input_kbps }}
											/
											{{ baseInfo.instantaneous_output_kbps }}
										</div>
									</td>
								</tr>
							</tbody>
						</table>
					</el-scrollbar>
				</div>
			</div>
		</el-card>

		<div class="sm:flex">
			<!-- 命令统计 -->
			<el-card class="sm:mr-4 flex-1 !border-none mt-4" shadow="never">
				<div>
					<div class="mb-10">命令统计</div>
					<div class="flex h-[300px] items-center" ref="commandChartRef"></div>
				</div>
			</el-card>

			<!-- 内存信息 -->
			<el-card class="flex-1 !border-none mt-4" shadow="never">
				<div>
					<div class="mb-10">内存信息</div>
					<div class="flex h-[300px] items-center" ref="memoryChartRef"></div>
				</div>
			</el-card>
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
</script>

<style scoped>
.el-table .el-table__cell {
	min-width: 120px;
}
</style>
