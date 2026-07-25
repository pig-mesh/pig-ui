<script lang="ts">
export default {
	title: '设备分布',
	icon: 'Monitor',
	description: 'Clarity 设备分布统计',
};
</script>
<template>
	<el-card v-loading="loading" class="box-card h-[340px] min-[992px]:h-96">
		<template #header>
			<div class="flex items-center justify-between">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">设备分布</span>
			</div>
		</template>
		<template v-if="!loading && deviceList.length === 0">
			<div class="flex items-center justify-center flex-1 min-h-0">
				<el-empty description="暂无设备数据" :image-size="80" />
			</div>
		</template>
		<template v-else-if="deviceList.length > 0">
			<div class="flex items-start flex-1 min-h-0 gap-4">
				<div class="flex items-center justify-center flex-1 min-w-0">
					<div class="h-[220px] w-full max-w-[220px]">
						<v-chart class="w-full h-full" :option="chartOption" autoresize />
					</div>
				</div>
				<div class="flex w-[140px] shrink-0 flex-col items-start justify-start gap-3 pt-1">
					<div v-for="(item, i) in deviceList.slice(0, 3)" :key="i" class="w-full px-1 py-1">
						<div class="flex items-center gap-2 text-[13px]">
							<span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: colors[i % colors.length] }" />
							<span class="truncate text-gray-500 dark:text-gray-400">{{ item.name }}</span>
						</div>
						<div class="flex items-end justify-between gap-2 mt-1">
							<span class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ getPct(item.value) }}%</span>
							<span class="text-xs text-gray-500 dark:text-gray-400">{{ item.value }}</span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</el-card>
</template>
<script setup lang="ts" name="device-distribution">
import { systemClarity } from '/@/api/admin/system';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useThemeConfig } from '/@/stores/themeConfig';
import { auth } from '/@/utils/authFunction';

use([PieChart, TooltipComponent, GraphicComponent, CanvasRenderer]);

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const isDark = computed(() => themeConfig.value.isDark);

const loading = ref(true);
const deviceList = ref<{ name: string; value: number }[]>([]);
const colors = ['#312e81', '#6366f1', '#c7d2fe', '#a5b4fc'];

const totalVisits = computed(() => deviceList.value.reduce((s, i) => s + i.value, 0));

const getPct = (val: number) => {
	return totalVisits.value ? ((val / totalVisits.value) * 100).toFixed(1) : '0';
};

const fmtTotal = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString());

const chartOption = computed(() => ({
	tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
	color: colors,
	graphic: [
		{
			type: 'group',
			left: 'center',
			top: 'center',
			children: [
				{
					type: 'text',
					z: 100,
					left: 'center',
					top: '-14px',
					style: {
						text: fmtTotal(totalVisits.value),
						font: 'bold 26px system-ui, sans-serif',
						fill: isDark.value ? '#e2e8f0' : '#0f172a',
						textAlign: 'center',
					},
				},
				{
					type: 'text',
					z: 100,
					left: 'center',
					top: '16px',
					style: {
						text: '总访问',
						font: '11px system-ui, sans-serif',
						fill: '#94a3b8',
						textAlign: 'center',
					},
				},
			],
		},
	],
	series: [
		{
			type: 'pie',
			radius: ['52%', '78%'],
			center: ['50%', '50%'],
			data: deviceList.value.map((d, i) => ({
				name: d.name,
				value: d.value,
				itemStyle: { color: colors[i % colors.length] },
			})),
			label: { show: false },
			emphasis: { scale: false, itemStyle: { opacity: 0.85 } },
			itemStyle: { borderRadius: 4, borderColor: isDark.value ? '#1e293b' : '#fff', borderWidth: 2 },
		},
	],
}));

onMounted(async () => {
	if (!auth('sys_clarity_view')) {
		loading.value = false;
		return;
	}
	try {
		const { data } = await systemClarity();
		if (data?.deviceData) {
			deviceList.value = JSON.parse(data.deviceData);
		}
	} catch {
		// 静默处理
	} finally {
		loading.value = false;
	}
});
</script>

<style scoped>
:deep(.el-card__body) {
	height: 100%;
	display: flex;
	flex-direction: column;
}
</style>
