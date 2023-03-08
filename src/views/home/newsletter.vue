<template>
	<el-card>
		<template #header>
			<div class="card-header">
				<span>{{ $t('home.newsletterTip') }}</span>
			</div>
		</template>
		<el-timeline v-if="newsList.length > 0">
			<el-timeline-item v-for="(item, index) in newsList.slice(0, 5)" :key="index" :timestamp="item.time">
				{{ item.label }} - {{ item.value }}
			</el-timeline-item>
		</el-timeline>
		<el-empty v-else />
	</el-card>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
import { useMsg } from '/@/stores/msg';

const mes = useMsg();

const newsList = computed(() => {
	return mes.getAllMsg();
});
</script>
