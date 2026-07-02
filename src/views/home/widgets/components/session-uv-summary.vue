<script lang="ts">
export default {
	title: '会话访客',
	icon: 'DataLine',
	description: 'Clarity 总会话数与独立访客',
};
</script>
<template>
	<el-card v-loading="loading" class="box-card h-96">
		<template #header>
			<div class="flex items-center justify-between">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">会话访客</span>
			</div>
		</template>
		<template v-if="!loading && !hasData">
			<div class="flex min-h-0 flex-1 items-center justify-center">
				<el-empty description="暂无会话数据" :image-size="70" />
			</div>
		</template>
		<template v-else>
			<div class="grid min-h-0 flex-1 grid-cols-2 gap-3">
				<div v-for="item in stats" :key="item.label" class="flex flex-col justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-800/70">
					<span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ item.label }}</span>
					<div>
						<div class="truncate text-2xl font-semibold text-slate-900 dark:text-slate-100">{{ item.value }}</div>
						<div class="mt-1 text-xs text-slate-400 dark:text-slate-500">{{ item.desc }}</div>
					</div>
				</div>
			</div>
		</template>
	</el-card>
</template>
<script setup lang="ts" name="session-uv-summary">
import { systemClarity } from '/@/api/admin/system';
import { auth } from '/@/utils/authFunction';

interface ClaritySummary {
	totalSessions?: number;
	distinctUsers?: number;
}

const loading = ref(true);
const summary = ref<ClaritySummary>({});

const hasData = computed(() => summary.value.totalSessions != null || summary.value.distinctUsers != null);

const formatCount = (value?: number) => (value != null ? value.toLocaleString() : '-');

const stats = computed(() => [
	{
		label: '总会话数',
		value: formatCount(summary.value.totalSessions),
		desc: 'Sessions',
	},
	{
		label: '独立访客 UV',
		value: formatCount(summary.value.distinctUsers),
		desc: 'Unique visitors',
	},
]);

onMounted(async () => {
	if (!auth('sys_clarity_view')) {
		loading.value = false;
		return;
	}
	try {
		const { data } = await systemClarity();
		summary.value = {
			totalSessions: data?.totalSessions,
			distinctUsers: data?.distinctUsers,
		};
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
