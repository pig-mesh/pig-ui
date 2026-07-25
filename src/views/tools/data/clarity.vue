<script setup lang="ts" name="clarity">
import { Calendar, Loading, Refresh } from '@element-plus/icons-vue';
import { PieChart } from 'echarts/charts';
import { GraphicComponent, TooltipComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { systemClarity } from '/@/api/admin/system';
import { useThemeConfig } from '/@/stores/themeConfig';
import ClarityDistributionPanel from './components/clarity/ClarityDistributionPanel.vue';
import ClarityKpiStrip from './components/clarity/ClarityKpiStrip.vue';
import ClarityRankingPanel from './components/clarity/ClarityRankingPanel.vue';
import type { DistributionItem, MetricCard, RankingItem } from './components/clarity/types';

use([PieChart, TooltipComponent, GraphicComponent, CanvasRenderer]);

interface AnalyticsRankingItem {
	name: string;
	value: number;
}

interface AnalyticsData {
	provider?: string;
	loading?: boolean;
	message?: string;
	deviceData?: string;
	topUrls?: string;
	referrerUrlData?: string;
	pageTitleData?: string;
	browserData?: string;
	pageviews?: number;
	visits?: number;
	visitors?: number;
	pagesPerVisit?: number;
	bounceRate?: number;
	avgVisitDuration?: number;
	totalSessions?: number;
	distinctUsers?: number;
	pagesPerSession?: number;
	scrollDepth?: number;
	deadClickRate?: number;
	rageClickRate?: number;
}

const { t } = useI18n();
const { themeConfig } = storeToRefs(useThemeConfig());

const pageLoading = ref(true);
const clarityLoading = ref(false);
const loadingMessage = ref('');
const clarityData = ref<AnalyticsData | null>(null);
const analyticsProvider = ref<'clarity' | 'umami'>('clarity');
const deviceList = ref<AnalyticsRankingItem[]>([]);
const urlList = ref<AnalyticsRankingItem[]>([]);
const referrerList = ref<AnalyticsRankingItem[]>([]);
const pageTitleList = ref<AnalyticsRankingItem[]>([]);
const browserList = ref<AnalyticsRankingItem[]>([]);
const numOfDays = ref(1);

const isDark = computed(() => themeConfig.value.isDark);
const deviceColors = ['#155EEF', '#4D7CFE', '#84A5FF', '#D5E2FF'];
const browserColors = ['#039BE5', '#36AEEF', '#75C7F5', '#D1EEFC'];

const dayOptions = [
	{ value: 1, label: '过去 1 天' },
	{ value: 2, label: '过去 2 天' },
	{ value: 3, label: '过去 3 天' },
];

const providerLabel = computed(() => (analyticsProvider.value === 'umami' ? 'Umami' : 'Clarity'));
const listValueUnit = computed(() => (analyticsProvider.value === 'umami' ? '次访问' : '次会话'));

const parseRanking = (value?: string): AnalyticsRankingItem[] => {
	if (!value) return [];
	try {
		const parsed: unknown = JSON.parse(value);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(item): item is AnalyticsRankingItem =>
				typeof item === 'object' && item !== null && typeof item.name === 'string' && typeof item.value === 'number'
		);
	} catch {
		return [];
	}
};

const loadData = async () => {
	pageLoading.value = true;
	clarityLoading.value = false;
	try {
		const response = await systemClarity(numOfDays.value);
		const data = response.data as AnalyticsData;
		analyticsProvider.value = data?.provider === 'umami' ? 'umami' : 'clarity';
		if (data?.loading) {
			clarityLoading.value = true;
			loadingMessage.value = data.message ?? '数据获取中，请稍后手动刷新';
			return;
		}

		clarityData.value = data;
		deviceList.value = parseRanking(data?.deviceData);
		urlList.value = parseRanking(data?.topUrls);
		referrerList.value = parseRanking(data?.referrerUrlData);
		pageTitleList.value = parseRanking(data?.pageTitleData);
		browserList.value = parseRanking(data?.browserData);
	} catch {
		// 静默处理
	} finally {
		pageLoading.value = false;
	}
};

const selectDays = (value: number) => {
	numOfDays.value = value;
	loadData();
};

const dateRangeLabel = computed(() => {
	const today = new Date();
	const formatDate = (date: Date) =>
		`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
	if (numOfDays.value === 1) return formatDate(today);
	const start = new Date(today);
	start.setDate(today.getDate() - (numOfDays.value - 1));
	return `${formatDate(start)}  ～  ${formatDate(today)}`;
});

const formatMetricNumber = (value: number | string | null | undefined) => {
	if (value == null) return '-';
	const number = Number(value);
	return Number.isFinite(number) ? new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 2 }).format(number) : '-';
};

const formatPercent = (value: number | string | null | undefined) => {
	const text = formatMetricNumber(value);
	return text === '-' ? text : `${text}%`;
};

const formatDuration = (value: number | string | null | undefined) => {
	if (value == null) return '-';
	const seconds = Math.round(Number(value));
	if (!Number.isFinite(seconds)) return '-';
	if (seconds < 60) return `${seconds}s`;
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
	return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
};

const makeBars = (seed: number): number[] => {
	const base = [38, 52, 42, 65, 48, 80];
	return base.map((height, index) => {
		const jitter = ((seed * (index + 3)) % 23) - 11;
		return Math.min(95, Math.max(15, height + jitter));
	});
};

const statisticsCards = computed<MetricCard[]>(() => {
	const data = clarityData.value;
	if (analyticsProvider.value === 'umami') {
		return [
			{ label: '浏览量', value: data?.pageviews?.toLocaleString() ?? '-', bars: makeBars(data?.pageviews ?? 42), icon: 'sessions' },
			{ label: '访问次数', value: data?.visits?.toLocaleString() ?? '-', bars: makeBars(data?.visits ?? 31), icon: 'visitors' },
			{ label: '独立访客 UV', value: data?.visitors?.toLocaleString() ?? '-', bars: makeBars(data?.visitors ?? 27), icon: 'visitors' },
			{
				label: '每次访问浏览页数',
				value: formatMetricNumber(data?.pagesPerVisit),
				bars: makeBars(Number(data?.pagesPerVisit ?? 4.8) * 10),
				icon: 'pages',
			},
			{ label: '跳出率', value: formatPercent(data?.bounceRate), bars: makeBars(Number(data?.bounceRate ?? 38) * 2), icon: 'deadClick' },
			{
				label: '平均访问时长',
				value: formatDuration(data?.avgVisitDuration),
				bars: makeBars(Number(data?.avgVisitDuration ?? 72)),
				icon: 'scroll',
			},
		];
	}

	return [
		{
			label: t('clarity.totalSessions', '总会话数'),
			value: data?.totalSessions?.toLocaleString() ?? '-',
			bars: makeBars(data?.totalSessions ?? 42),
			icon: 'sessions',
		},
		{
			label: t('clarity.distinctUsers', '独立访客 UV'),
			value: data?.distinctUsers?.toLocaleString() ?? '-',
			bars: makeBars(data?.distinctUsers ?? 31),
			icon: 'visitors',
		},
		{
			label: t('clarity.pagesPerSession', '每会话页面数'),
			value: formatMetricNumber(data?.pagesPerSession),
			bars: makeBars((data?.pagesPerSession ?? 4.8) * 10),
			icon: 'pages',
		},
		{
			label: t('clarity.scrollDepth', '平均滚动深度'),
			value: formatPercent(data?.scrollDepth),
			bars: makeBars((data?.scrollDepth ?? 64) * 2),
			icon: 'scroll',
		},
		{
			label: t('clarity.deadClickRate', '死点击率'),
			value: formatPercent(data?.deadClickRate),
			bars: makeBars((data?.deadClickRate ?? 28) * 3),
			icon: 'deadClick',
		},
		{
			label: t('clarity.rageClickRate', '激怒点击率'),
			value: formatPercent(data?.rageClickRate),
			bars: makeBars((data?.rageClickRate ?? 0.4) * 100),
			icon: 'rageClick',
		},
	];
});

const totalDeviceVisits = computed(() => deviceList.value.reduce((sum, item) => sum + item.value, 0));
const totalBrowserVisits = computed(() => browserList.value.reduce((sum, item) => sum + item.value, 0));

const formatPercentage = (value: number, total: number) => (total ? ((value / total) * 100).toFixed(1) : '0');
const formatTotal = (value: number) => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString());

const deviceDistributionItems = computed<DistributionItem[]>(() =>
	deviceList.value.map((item) => ({ ...item, percentage: formatPercentage(item.value, totalDeviceVisits.value) }))
);

const browserDistributionItems = computed<DistributionItem[]>(() =>
	browserList.value.map((item) => ({ ...item, percentage: formatPercentage(item.value, totalBrowserVisits.value) }))
);

const createPieOption = (items: AnalyticsRankingItem[], colors: string[], total: number) => ({
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
						text: formatTotal(total),
						font: '600 26px system-ui, sans-serif',
						fill: isDark.value ? '#e2e8f0' : '#0f172a',
						textAlign: 'center',
					},
				},
				{
					type: 'text',
					z: 100,
					left: 'center',
					top: '17px',
					style: { text: '总访问', font: '12px system-ui, sans-serif', fill: '#64748b', textAlign: 'center' },
				},
			],
		},
	],
	series: [
		{
			type: 'pie',
			radius: ['54%', '78%'],
			center: ['50%', '50%'],
			data: items.map((item, index) => ({
				name: item.name,
				value: item.value,
				itemStyle: { color: colors[index % colors.length] },
			})),
			label: { show: false },
			emphasis: { scale: false, itemStyle: { opacity: 0.85 } },
			itemStyle: { borderRadius: 4, borderColor: isDark.value ? '#1e293b' : '#fff', borderWidth: 2 },
		},
	],
});

const deviceChartOption = computed(() => createPieOption(deviceList.value, deviceColors, totalDeviceVisits.value));
const browserChartOption = computed(() => createPieOption(browserList.value, browserColors, totalBrowserVisits.value));

const shortenUrl = (url: string) => {
	try {
		const parsed = new URL(url);
		return parsed.pathname || url;
	} catch {
		return url.replace(/^https?:\/\/[^/]+/, '') || url;
	}
};

const buildRankingItems = (items: AnalyticsRankingItem[], displayName: (item: AnalyticsRankingItem) => string): RankingItem[] => {
	const max = Math.max(...items.map((item) => item.value), 1);
	return items.map((item) => ({
		...item,
		displayName: displayName(item),
		progress: ((item.value / max) * 100).toFixed(1),
	}));
};

const referrerRankingItems = computed(() => buildRankingItems(referrerList.value, (item) => shortenUrl(item.name)));
const pageTitleRankingItems = computed(() => buildRankingItems(pageTitleList.value, (item) => item.name));
const popularRankingItems = computed(() => buildRankingItems(urlList.value, (item) => shortenUrl(item.name)));

const exportCsv = () => {
	const rows = [['URL', '访问次数'], ...urlList.value.map((item) => [item.name, item.value])];
	const csv = rows.map((row) => row.join(',')).join('\n');
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = `${analyticsProvider.value}-top-pages-${dateRangeLabel.value}.csv`;
	anchor.click();
	URL.revokeObjectURL(url);
};

onMounted(loadData);
</script>

<template>
	<div class="min-h-full bg-slate-50 px-4 py-5 dark:bg-slate-950 sm:px-5 xl:px-6">
		<div v-if="pageLoading" class="animate-pulse" aria-label="站点统计加载中">
			<div class="mb-4 flex items-center justify-between gap-4">
				<div class="h-9 w-72 rounded-lg bg-slate-200 dark:bg-slate-700" />
				<div class="h-9 w-48 rounded-lg bg-slate-200 dark:bg-slate-700" />
			</div>
			<div class="mb-4 grid overflow-hidden rounded-xl bg-white sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 dark:bg-slate-800">
				<div v-for="index in 6" :key="index" class="h-[144px] border-b border-slate-100 p-5 xl:border-r xl:border-b-0 dark:border-slate-700">
					<div class="h-3 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
					<div class="mt-4 h-7 w-2/5 rounded bg-slate-200 dark:bg-slate-700" />
					<div class="mt-5 h-7 rounded bg-slate-100 dark:bg-slate-700" />
				</div>
			</div>
			<div class="grid gap-4 xl:grid-cols-2">
				<div v-for="index in 4" :key="index" class="h-[300px] rounded-xl bg-white dark:bg-slate-800" />
			</div>
		</div>

		<div v-else-if="clarityLoading" class="flex min-h-[420px] flex-col items-center justify-center gap-3">
			<el-icon class="animate-spin text-4xl text-primary"><Loading /></el-icon>
			<p class="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100">正在从 {{ providerLabel }} 拉取数据</p>
			<p class="m-0 text-sm text-slate-500 dark:text-slate-400">{{ loadingMessage }}</p>
			<button type="button" class="reload-button" @click="loadData">
				<el-icon><Refresh /></el-icon>
				手动刷新
			</button>
		</div>

		<template v-else>
			<header class="toolbar-surface mb-4">
				<div class="inline-flex rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
					<button
						v-for="option in dayOptions"
						:key="option.value"
						type="button"
						class="day-button"
						:class="{ 'is-active': numOfDays === option.value }"
						:aria-pressed="numOfDays === option.value"
						@click="selectDays(option.value)"
					>
						{{ option.label }}
					</button>
				</div>

				<div
					class="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
				>
					<el-icon class="text-primary"><Calendar /></el-icon>
					<span>{{ providerLabel }} · {{ dateRangeLabel }}</span>
				</div>
			</header>

			<ClarityKpiStrip class="mb-4" :items="statisticsCards" />

			<div class="grid items-stretch gap-4 xl:grid-cols-2">
				<ClarityDistributionPanel
					:title="t('clarity.deviceDistribution', '设备分布')"
					kind="device"
					:items="deviceDistributionItems"
					:colors="deviceColors"
					:chart-option="deviceChartOption"
				/>
				<ClarityDistributionPanel
					:title="t('clarity.browserDistribution', '浏览器分布')"
					kind="browser"
					:items="browserDistributionItems"
					:colors="browserColors"
					:chart-option="browserChartOption"
				/>

				<ClarityRankingPanel :title="t('clarity.referrerUrl', '来源页面 Top5')" kind="referrer" :items="referrerRankingItems" :unit="listValueUnit" />
				<ClarityRankingPanel :title="t('clarity.pageTitle', '页面标题 Top5')" kind="title" :items="pageTitleRankingItems" :unit="listValueUnit" />

				<ClarityRankingPanel
					class="xl:col-span-2"
					:title="t('clarity.popularPages', '热门页面 Top5')"
					kind="popular"
					:items="popularRankingItems"
					unit="次访问"
					action-label="导出 CSV"
					@action="exportCsv"
				/>
			</div>
		</template>
	</div>
</template>

<style scoped>
.toolbar-surface {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.day-button {
	cursor: pointer;
	white-space: nowrap;
	border: 0;
	border-radius: 7px;
	background: transparent;
	padding: 8px 15px;
	color: var(--el-text-color-secondary);
	font-size: 13px;
	font-weight: 500;
	transition: background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.day-button:hover {
	color: var(--el-color-primary);
}

.day-button.is-active {
	background: var(--el-color-primary);
	box-shadow: 0 1px 2px rgb(21 94 239 / 0.2);
	color: white;
}

.reload-button {
	display: inline-flex;
	cursor: pointer;
	align-items: center;
	gap: 6px;
	border: 0;
	border-radius: 8px;
	background: var(--el-color-primary);
	padding: 8px 16px;
	color: white;
	font-size: 13px;
	font-weight: 500;
}

@media (max-width: 640px) {
	.toolbar-surface {
		align-items: stretch;
	}

	.toolbar-surface > * {
		width: 100%;
		justify-content: center;
	}

	.day-button {
		flex: 1;
	}
}
</style>
