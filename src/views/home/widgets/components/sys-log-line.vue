<script lang="ts">
export default {
	title: '请求折线图',
	icon: 'DocumentCopy',
	description: '折线图示例',
};
</script>
<template>
	<el-card class="relative h-full">
		<log-line-chart />
	</el-card>
</template>
<script setup lang="ts" name="line-chart">
import LogLineChart from '/@/views/admin/log/line-chart.vue';
</script>
