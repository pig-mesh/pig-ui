<template>
	<div></div>
</template>
<script setup lang="ts" name="global-sse">
import { Session } from '/@/utils/storage';
import { ElNotification } from 'element-plus';
import { fetchEventSource, EventSourceMessage } from '@microsoft/fetch-event-source';
import { onUnmounted } from 'vue';

interface SseProps {
	uri?: string;
}

const props = defineProps<SseProps>();

/**
 * 从会话存储中获取访问令牌
 * @returns {string} 访问令牌
 */
const token = computed(() => {
	return Session.getToken();
});
/**
 * 从会话存储中获取访问租户
 * @returns {string} 租户
 */
const tenant = computed(() => {
	return Session.getTenant();
});

/**
 * SSE 消息提醒
 * @param {string} message - 收到的消息内容
 */
const showSseNotification = (message: string) => {
	ElNotification.warning({
		title: '消息提醒',
		dangerouslyUseHTMLString: true,
		message: message + '请及时处理',
		offset: 0,
	});
};

let abortController: AbortController | null = null;

/**
 * 初始化 SSE 连接
 * @param {string} uri - SSE 服务端 URI
 */
const initSseConnection = async (uri: string) => {
	const baseURL = import.meta.env.VITE_API_URL;
	abortController = new AbortController();

	try {
		const options = {
			method: 'GET',
			headers: {
				Accept: 'text/event-stream',
				'TENANT-ID': tenant.value,
				Authorization: `Bearer ${token.value}`,
			},
			signal: abortController.signal,
			onmessage(event: EventSourceMessage) {
				if (event.data !== 'pong') {
					showSseNotification(event.data);
				}
			},
			async onopen(response: Response) {
				if (response.ok && response.status === 200) {
					console.log('[SSE] connection established');
				} else {
					throw new Error(`Failed to establish SSE connection: ${response.status}`);
				}
			},
			onclose() {
				console.log('[SSE] connection closed');
			},
			onerror(err: Error) {
				console.error('[SSE] connection error:', err);
				throw err; // 重试连接
			},
			// 重试策略
			openWhenHidden: true,
			retry: {
				initialRetryDelayMs: 1000,
				maxRetryDelayMs: 10000,
				retryBackoff: 1.5,
			},
		};

		await fetchEventSource(`${baseURL}${uri}`, options);
	} catch (e) {
		console.error('[SSE] connection failed:', e);
	}
};

// 是否开启sseEnable
const sseEnable = ref(import.meta.env.VITE_SSE_ENABLE === 'true');

if (sseEnable.value && props.uri) {
	initSseConnection(props.uri);
}

// 组件卸载时清理连接
onUnmounted(() => {
	if (abortController) {
		abortController.abort();
		abortController = null;
	}
});
</script>
