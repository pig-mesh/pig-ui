<template>
	<div></div>
</template>
<script setup lang="ts" name="check-token">
import { checkToken } from '/@/api/login';
import { useIntervalFn } from '@vueuse/core';

// 使用 VueUse 的 useIntervalFn 自动管理定时器生命周期
const { pause } = useIntervalFn(
	async () => {
		try {
			// 检查 token 并根据返回值决定是否停止定时器
			const shouldStop = await checkToken();
			if (shouldStop) {
				pause(); // 停止定时器
			}
		} catch (err) {
			// Token 检查失败时停止定时器，避免持续错误
			console.error('Token check failed:', err);
			pause();
		}
	},
	60000, // 60秒检查一次
	{ immediate: true } // 立即执行第一次检查
);

// 组件卸载时自动清理，VueUse 会自动处理
</script>
