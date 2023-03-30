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

<script setup lang="ts" name="newsLetter">
import { useMsg } from '/@/stores/msg';

/**
 * 获取消息列表 store 对象的实例。
 */
const mes = useMsg();

/**
 * 消息列表的计算属性。
 */
const newsList = computed(() => {
	return mes.getAllMsg(); // 从 store 中获取所有消息
});
</script>
