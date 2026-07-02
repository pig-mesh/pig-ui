<script lang="ts">
export default {
	title: '浏览器分布',
	icon: 'ChromeFilled',
	description: 'Clarity 浏览器访问分布',
};
</script>
<template>
	<el-card v-loading="loading" class="box-card h-96">
		<template #header>
			<div class="flex items-center justify-between">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">浏览器分布</span>
			</div>
		</template>
		<template v-if="!loading && browserList.length === 0">
			<div class="flex min-h-0 flex-1 items-center justify-center">
				<el-empty description="暂无浏览器数据" :image-size="80" />
			</div>
		</template>
		<template v-else-if="browserList.length > 0">
			<div class="flex min-h-0 flex-1 items-start gap-4">
				<div class="flex min-w-0 flex-1 items-center justify-center">
					<div class="h-[220px] w-full max-w-[220px]">
						<v-chart class="h-full w-full" :option="chartOption" autoresize />
					</div>
				</div>
				<div class="flex w-[140px] shrink-0 flex-col items-start justify-start gap-3 pt-1">
					<div v-for="(item, i) in browserList.slice(0, 3)" :key="item.name" class="w-full px-1 py-1">
						<div class="flex items-center gap-2 text-[13px]">
							<span class="h-2.5 w-2.5 shrink-0 rounded-full" :style="{ background: colors[i % colors.length] }" />
							<span class="truncate text-slate-500 dark:text-slate-400">{{ item.name }}</span>
						</div>
						<div class="mt-1 flex items-end justify-between gap-2">
							<span class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ getPct(item.value) }}%</span>
							<span class="text-xs text-slate-400 dark:text-slate-500">{{ item.value }}</span>
						</div>
					</div>
				</div>
			</div>
		</template>
	</el-card>
</template>
<script setup lang="ts" name="browser-distribution">
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
const browserList = ref<{ name: string; value: number }[]>([]);
const colors = ['#0369a1', '#0ea5e9', '#7dd3fc', '#bae6fd'];

const totalVisits = computed(() => browserList.value.reduce((sum, item) => sum + item.value, 0));

const getPct = (value: number) => {
	return totalVisits.value ? ((value / totalVisits.value) * 100).toFixed(1) : '0';
};

const fmtTotal = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString());

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
			data: browserList.value.map((item, index) => ({
				name: item.name,
				value: item.value,
				itemStyle: { color: colors[index % colors.length] },
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
		if (data?.browserData) {
			browserList.value = JSON.parse(data.browserData);
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
