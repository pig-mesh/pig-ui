<script lang="ts">
export default {
	title: '请求折线图',
	icon: 'DocumentCopy',
	description: '折线图示例',
};
</script>
<template>
	<el-card class="box-card h-[340px] min-[992px]:h-96">
		<template #header>
			<div class="flex items-center justify-between">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">{{ $t('home.requestLineChartTip') }}</span>
			</div>
		</template>
		<template v-if="hasPermission">
			<div class="sys-log-line-chart flex min-h-0 flex-1 items-center">
				<log-line-chart />
			</div>
		</template>
		<template v-else>
			<div class="flex min-h-0 flex-1 items-center justify-center">
				<el-empty :image-size="120" />
			</div>
		</template>
	</el-card>
</template>
<script setup lang="ts" name="line-chart">
import LogLineChart from '/@/views/admin/log/line-chart.vue';
import { auth } from '/@/utils/authFunction';

const hasPermission = auth('sys_log_view');
</script>

<style scoped>
:deep(.el-card__body) {
	height: 100%;
	display: flex;
	flex-direction: column;
}

:deep(.sys-log-line-chart .echarts) {
	height: 240px !important;
}
</style>
