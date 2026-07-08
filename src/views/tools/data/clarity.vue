<template>
	<div class="min-h-full bg-slate-100 p-6 dark:bg-slate-900">

		<!-- ── 骨架屏 ── -->
		<div v-if="pageLoading" class="animate-pulse">
			<div class="mb-6 flex flex-wrap items-center gap-2">
				<div v-for="i in 3" :key="i" class="h-9 w-28 rounded-full bg-slate-200 dark:bg-slate-700" />
				<div class="ml-auto h-9 w-48 rounded-xl bg-slate-200 dark:bg-slate-700" />
			</div>
			<div class="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
				<div v-for="i in 6" :key="i" class="rounded-2xl bg-white p-[18px] dark:bg-slate-800">
					<div class="mb-2 h-3 w-3/5 rounded bg-slate-200 dark:bg-slate-700" />
					<div class="mb-3 h-7 w-4/5 rounded bg-slate-200 dark:bg-slate-700" />
					<div class="flex h-8 items-end gap-1">
						<div v-for="(h, j) in [40,60,45,70,55,85]" :key="j"
							class="flex-1 rounded-t bg-slate-200 dark:bg-slate-700"
							:style="{ height: h + '%' }" />
					</div>
				</div>
			</div>
			<div class="grid gap-4" style="grid-template-columns: 340px 1fr">
				<div class="h-[340px] rounded-2xl bg-white dark:bg-slate-800" />
				<div class="h-[340px] rounded-2xl bg-white dark:bg-slate-800" />
			</div>
		</div>

		<!-- ── 数据拉取中 ── -->
		<div v-else-if="clarityLoading"
			class="flex min-h-[360px] flex-col items-center justify-center gap-3">
			<svg class="h-10 w-10 animate-spin text-primary"
				viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
				<path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
					stroke-linecap="round" />
			</svg>
			<p class="m-0 text-lg font-semibold text-slate-900 dark:text-slate-100">正在从 Clarity 拉取数据</p>
			<p class="m-0 text-sm text-slate-400">{{ loadingMessage }}</p>
			<button
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark-2"
				@click="loadData">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
					<path d="M1 4v6h6M23 20v-6h-6" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"
						stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				手动刷新
			</button>
		</div>

		<!-- ── 主内容 ── -->
		<template v-else>

			<!-- 顶部筛选栏 -->
			<div class="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div class="inline-flex gap-0.5 rounded-full border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
					<button
						v-for="opt in dayOptions"
						:key="opt.value"
						class="cursor-pointer whitespace-nowrap rounded-full border-0 px-4 py-1.5 text-[13px] font-medium transition-all"
						:class="numOfDays === opt.value
							? 'bg-primary text-white'
							: 'bg-transparent text-slate-500 hover:bg-primary-light-9 hover:text-primary dark:text-slate-400 dark:hover:bg-primary-light-9 dark:hover:text-primary'"
						@click="selectDays(opt.value)"
					>{{ opt.label }}</button>
				</div>

				<div class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
					<svg class="shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
						stroke-width="2" width="13" height="13">
						<rect x="3" y="4" width="18" height="18" rx="2" />
						<path d="M16 2v4M8 2v4M3 10h18" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
					{{ dateRangeLabel }}
				</div>
			</div>

			<!-- 统计卡片 -->
			<div class="mb-5 grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-6">
				<div
					v-for="(card, i) in statisticsCards"
					:key="i"
					class="flex flex-col rounded-2xl border border-slate-100 bg-white p-[18px] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
				>
					<span class="mb-2 text-xs font-medium leading-tight text-slate-500 dark:text-slate-400">
						{{ card.label }}
					</span>
					<div class="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
						{{ card.value }}
					</div>
					<div class="sparkline">
						<div
							v-for="(h, j) in card.bars"
							:key="j"
							class="spark-bar"
							:class="{ 'is-active': j === card.bars.length - 1 }"
							:style="{ height: h + '%' }"
						/>
					</div>
				</div>
			</div>

			<!-- 图表区域 -->
			<div class="grid items-stretch gap-4 charts-grid">

				<!-- 设备分布 -->
				<div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white pb-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
					<div class="flex items-center border-b border-slate-100 px-5 py-[18px] dark:border-slate-700">
						<span class="border-l-[3px] border-primary pl-2.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100">
							{{ $t('clarity.deviceDistribution', '设备分布') }}
						</span>
					</div>
					<div class="flex-1 px-5 pt-2">
						<v-chart class="h-[200px] w-full" :option="deviceChartOption" autoresize />
					</div>
					<div class="flex flex-col gap-2.5 px-5 pb-4 pt-3">
						<div v-for="(item, i) in deviceList.slice(0, 3)" :key="i" class="flex items-center gap-2.5 text-[13px]">
							<span class="h-2.5 w-2.5 shrink-0 rounded-full"
								:style="{ background: deviceColors[i % deviceColors.length] }" />
							<span class="flex-1 text-slate-500 dark:text-slate-400">{{ item.name }}</span>
							<span class="text-sm font-semibold text-slate-900 dark:text-slate-100">
								{{ getDevicePct(item.value) }}%
							</span>
						</div>
					</div>
				</div>

				<!-- 浏览器分布 -->
				<div class="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white pb-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
					<div class="flex items-center border-b border-slate-100 px-5 py-[18px] dark:border-slate-700">
						<span class="border-l-[3px] border-primary-light-3 pl-2.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100">
							{{ $t('clarity.browserDistribution', '浏览器分布') }}
						</span>
					</div>
					<div class="flex-1 px-5 pt-2">
						<v-chart class="h-[200px] w-full" :option="browserChartOption" autoresize />
					</div>
					<div class="flex flex-col gap-2.5 px-5 pb-4 pt-3">
						<div v-for="(item, i) in browserList.slice(0, 3)" :key="i" class="flex items-center gap-2.5 text-[13px]">
							<span class="h-2.5 w-2.5 shrink-0 rounded-full"
								:style="{ background: browserColors[i % browserColors.length] }" />
							<span class="flex-1 text-slate-500 dark:text-slate-400">{{ item.name }}</span>
							<span class="text-sm font-semibold text-slate-900 dark:text-slate-100">
								{{ getBrowserPct(item.value) }}%
							</span>
						</div>
					</div>
				</div>

				<!-- 来源页面 Top5 -->
				<div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
					<div class="flex items-center border-b border-slate-100 px-5 py-[18px] dark:border-slate-700">
						<span class="border-l-[3px] border-primary pl-2.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100">
							{{ $t('clarity.referrerUrl', '来源页面 Top5') }}
						</span>
					</div>
					<div class="py-2">
						<div
							v-for="(item, i) in referrerList"
							:key="i"
							class="px-5 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
						>
							<div class="mb-1.5 flex items-baseline justify-between gap-2">
								<span class="max-w-[65%] truncate text-[13px] font-medium text-slate-900 dark:text-slate-100"
									:title="item.name">
									{{ shortenUrl(item.name) }}
								</span>
								<span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
									{{ item.value.toLocaleString() }} 次会话
								</span>
							</div>
							<div class="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
								<div class="progress-fill"
									:style="{ width: getReferrerPct(item.value) + '%', transitionDelay: i * 0.04 + 's' }" />
							</div>
						</div>
					</div>
				</div>

				<!-- 页面标题 Top5 -->
				<div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
					<div class="flex items-center border-b border-slate-100 px-5 py-[18px] dark:border-slate-700">
						<span class="border-l-[3px] border-primary-light-3 pl-2.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100">
							{{ $t('clarity.pageTitle', '页面标题 Top5') }}
						</span>
					</div>
					<div class="py-2">
						<div
							v-for="(item, i) in pageTitleList"
							:key="i"
							class="px-5 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
						>
							<div class="mb-1.5 flex items-baseline justify-between gap-2">
								<span class="max-w-[65%] truncate text-[13px] font-medium text-slate-900 dark:text-slate-100"
									:title="item.name">
									{{ item.name }}
								</span>
								<span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
									{{ item.value.toLocaleString() }} 次会话
								</span>
							</div>
							<div class="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
								<div class="progress-fill progress-fill-sky"
									:style="{ width: getPageTitlePct(item.value) + '%', transitionDelay: i * 0.04 + 's' }" />
							</div>
						</div>
					</div>
				</div>

				<!-- 热门页面 Top5 -->
				<div class="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 charts-grid-full">
					<div class="flex items-center justify-between border-b border-slate-100 px-5 py-[18px] dark:border-slate-700">
						<span class="border-l-[3px] border-primary pl-2.5 text-[15px] font-semibold text-slate-900 dark:text-slate-100">
							{{ $t('clarity.popularPages', '热门页面 Top5') }}
						</span>
						<button
							class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-primary-light-8 bg-primary-light-9 px-3 py-1.5 text-xs font-medium text-primary transition-all hover:border-primary hover:bg-primary hover:text-white dark:border-primary-light-5 dark:bg-primary-light-9 dark:text-primary dark:hover:bg-primary dark:hover:text-white"
							@click="exportCsv"
						>
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
									stroke-linecap="round" stroke-linejoin="round" />
							</svg>
							导出 CSV
						</button>
					</div>
					<div class="py-2">
						<div
							v-for="(page, i) in urlList"
							:key="i"
							class="px-5 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
						>
							<div class="mb-1.5 flex items-baseline justify-between gap-2">
								<span class="max-w-[65%] truncate text-[13px] font-medium text-slate-900 dark:text-slate-100"
									:title="page.name">
									{{ shortenUrl(page.name) }}
								</span>
								<span class="shrink-0 text-xs text-slate-500 dark:text-slate-400">
									{{ page.value.toLocaleString() }} 次访问
								</span>
							</div>
							<div class="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
								<div class="progress-fill"
									:style="{ width: getPagePct(page.value) + '%', transitionDelay: i * 0.04 + 's' }" />
							</div>
						</div>
					</div>
				</div>

			</div>
		</template>
	</div>
</template>

<script setup lang="ts" name="clarity">
import { systemClarity } from '/@/api/admin/system';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TooltipComponent, GraphicComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useI18n } from 'vue-i18n';

use([PieChart, TooltipComponent, GraphicComponent, CanvasRenderer]);

const { t } = useI18n();

const pageLoading = ref(true);
const clarityLoading = ref(false);
const loadingMessage = ref('');
const clarityData = ref<any>(null);
const deviceList = ref<{ name: string; value: number }[]>([]);
const urlList = ref<{ name: string; value: number }[]>([]);
const referrerList = ref<{ name: string; value: number }[]>([]);
const pageTitleList = ref<{ name: string; value: number }[]>([]);
const browserList = ref<{ name: string; value: number }[]>([]);
const numOfDays = ref(1);

const deviceColors = ['#2E5CF6', '#5B7CFA', '#8EA7FF', '#D8E1FF'];

const dayOptions = [
	{ value: 1, label: '过去 1 天' },
	{ value: 2, label: '过去 2 天' },
	{ value: 3, label: '过去 3 天' },
];

const loadData = async () => {
	pageLoading.value = true;
	clarityLoading.value = false;
	try {
		const { data } = await systemClarity(numOfDays.value);
		if (data?.loading) {
			clarityLoading.value = true;
			loadingMessage.value = data.message ?? '数据获取中，请稍后手动刷新';
		} else {
			clarityData.value = data;
			deviceList.value = data?.deviceData ? JSON.parse(data.deviceData) : [];
			urlList.value = data?.topUrls ? JSON.parse(data.topUrls) : [];
			referrerList.value = data?.referrerUrlData ? JSON.parse(data.referrerUrlData) : [];
			pageTitleList.value = data?.pageTitleData ? JSON.parse(data.pageTitleData) : [];
			browserList.value = data?.browserData ? JSON.parse(data.browserData) : [];
		}
	} catch {
		// 静默处理
	} finally {
		pageLoading.value = false;
	}
};

const selectDays = (v: number) => {
	numOfDays.value = v;
	loadData();
};

const dateRangeLabel = computed(() => {
	const today = new Date();
	const fmt = (d: Date) =>
		`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	if (numOfDays.value === 1) return fmt(today);
	const start = new Date(today);
	start.setDate(today.getDate() - (numOfDays.value - 1));
	return `${fmt(start)}  ～  ${fmt(today)}`;
});

const formatMetricNumber = (val: number | string | null | undefined) => {
	if (val == null) return '-';
	const num = Number(val);
	return Number.isFinite(num) ? new Intl.NumberFormat('zh-CN', { maximumSignificantDigits: 2 }).format(num) : '-';
};

const formatPercent = (val: number | string | null | undefined) => {
	const text = formatMetricNumber(val);
	return text === '-' ? text : `${text}%`;
};

function makeBars(seed: number): number[] {
	const base = [38, 52, 42, 65, 48, 80];
	return base.map((h, i) => {
		const jitter = ((seed * (i + 3)) % 23) - 11;
		return Math.min(95, Math.max(15, h + jitter));
	});
}

const statisticsCards = computed(() => {
	const d = clarityData.value;
	return [
		{ label: t('clarity.totalSessions', '总会话数'), value: d?.totalSessions?.toLocaleString() ?? '-', bars: makeBars(d?.totalSessions ?? 42) },
		{ label: t('clarity.distinctUsers', '独立访客 UV'), value: d?.distinctUsers?.toLocaleString() ?? '-', bars: makeBars(d?.distinctUsers ?? 31) },
		{ label: t('clarity.pagesPerSession', '每会话页面数'), value: formatMetricNumber(d?.pagesPerSession), bars: makeBars((d?.pagesPerSession ?? 4.8) * 10) },
		{ label: t('clarity.scrollDepth', '平均滚动深度'), value: formatPercent(d?.scrollDepth), bars: makeBars((d?.scrollDepth ?? 64) * 2) },
		{ label: t('clarity.deadClickRate', '死点击率'), value: formatPercent(d?.deadClickRate), bars: makeBars((d?.deadClickRate ?? 28) * 3) },
		{ label: t('clarity.rageClickRate', '激怒点击率'), value: formatPercent(d?.rageClickRate), bars: makeBars((d?.rageClickRate ?? 0.4) * 100) },
	];
});

const totalDeviceVisits = computed(() => deviceList.value.reduce((s, i) => s + i.value, 0));

const getDevicePct = (val: number) => {
	const total = totalDeviceVisits.value;
	return total ? ((val / total) * 100).toFixed(1) : '0';
};

const fmtTotal = (n: number) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toString());

const deviceChartOption = computed(() => ({
	tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
	color: deviceColors,
	graphic: [{
		type: 'group',
		left: 'center',
		top: 'center',
		children: [
			{
				type: 'text',
				z: 100,
				left: 'center',
				top: '-14px',
				style: { text: fmtTotal(totalDeviceVisits.value), font: 'bold 26px system-ui, sans-serif', fill: '#0f172a', textAlign: 'center' },
			},
			{
				type: 'text',
				z: 100,
				left: 'center',
				top: '16px',
				style: { text: '总访问', font: '11px system-ui, sans-serif', fill: '#94a3b8', textAlign: 'center' },
			},
		],
	}],
	series: [{
		type: 'pie',
		radius: ['52%', '78%'],
		center: ['50%', '50%'],
		data: deviceList.value.map((d, i) => ({
			name: d.name,
			value: d.value,
			itemStyle: { color: deviceColors[i % deviceColors.length] },
		})),
		label: { show: false },
		emphasis: { scale: false, itemStyle: { opacity: 0.85 } },
		itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
	}],
}));

const maxPageViews = computed(() => Math.max(...urlList.value.map((u) => u.value), 1));

const getPagePct = (val: number) => ((val / maxPageViews.value) * 100).toFixed(1);

const browserColors = ['#1D9BF0', '#48AEF7', '#84C9FF', '#D6EFFF'];

const totalBrowserVisits = computed(() => browserList.value.reduce((s, i) => s + i.value, 0));

const getBrowserPct = (val: number) => {
	const total = totalBrowserVisits.value;
	return total ? ((val / total) * 100).toFixed(1) : '0';
};

const browserChartOption = computed(() => ({
	tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
	color: browserColors,
	graphic: [{
		type: 'group',
		left: 'center',
		top: 'center',
		children: [
			{
				type: 'text',
				z: 100,
				left: 'center',
				top: '-14px',
				style: { text: fmtTotal(totalBrowserVisits.value), font: 'bold 26px system-ui, sans-serif', fill: '#0f172a', textAlign: 'center' },
			},
			{
				type: 'text',
				z: 100,
				left: 'center',
				top: '16px',
				style: { text: '总访问', font: '11px system-ui, sans-serif', fill: '#94a3b8', textAlign: 'center' },
			},
		],
	}],
	series: [{
		type: 'pie',
		radius: ['52%', '78%'],
		center: ['50%', '50%'],
		data: browserList.value.map((d, i) => ({
			name: d.name,
			value: d.value,
			itemStyle: { color: browserColors[i % browserColors.length] },
		})),
		label: { show: false },
		emphasis: { scale: false, itemStyle: { opacity: 0.85 } },
		itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
	}],
}));

const maxReferrerViews = computed(() => Math.max(...referrerList.value.map((u) => u.value), 1));
const getReferrerPct = (val: number) => ((val / maxReferrerViews.value) * 100).toFixed(1);

const maxPageTitleViews = computed(() => Math.max(...pageTitleList.value.map((u) => u.value), 1));
const getPageTitlePct = (val: number) => ((val / maxPageTitleViews.value) * 100).toFixed(1);

const shortenUrl = (url: string) => {
	try {
		const u = new URL(url);
		return u.pathname || url;
	} catch {
		return url.replace(/^https?:\/\/[^/]+/, '') || url;
	}
};

const exportCsv = () => {
	const rows = [['URL', '访问次数'], ...urlList.value.map((u) => [u.name, u.value])];
	const csv = rows.map((r) => r.join(',')).join('\n');
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `clarity-top-pages-${dateRangeLabel.value}.csv`;
	a.click();
	URL.revokeObjectURL(url);
};

onMounted(() => { loadData(); });
</script>

<style scoped>
/* 图表区域布局 */
.charts-grid {
	grid-template-columns: repeat(2, 1fr);
}

.charts-grid-full {
	grid-column: span 2;
}

@media (max-width: 1100px) {
	.charts-grid {
		grid-template-columns: 1fr;
	}
	.charts-grid-full {
		grid-column: span 1;
	}
}

/* sparkline — 动态高度必须 scoped */
.sparkline {
	display: flex;
	align-items: flex-end;
	gap: 3px;
	height: 32px;
	margin-top: auto;
}

.spark-bar {
	flex: 1;
	border-radius: 3px 3px 0 0;
	background: var(--el-color-primary-light-8);
	transition: height 0.3s ease;
}

.spark-bar.is-active {
	background: var(--el-color-primary);
}

[data-theme='dark'] .spark-bar {
	background: var(--el-color-primary-light-9);
}

[data-theme='dark'] .spark-bar.is-active {
	background: var(--el-color-primary-light-3);
}

/* 进度条填充 — 渐变 + cubic-bezier 入场动画 */
.progress-fill {
	height: 100%;
	border-radius: 99px;
	background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
	width: 0;
	transition: width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.progress-fill-sky {
	background: linear-gradient(90deg, #1D9BF0, var(--el-color-primary-light-5));
}
</style>
