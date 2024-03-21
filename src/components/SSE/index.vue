<template>
	<div></div>
</template>
<script setup lang="ts" name="global-sse">
import { Session } from '/@/utils/storage';
import { useEventSource } from '@vueuse/core';
import { ElNotification } from 'element-plus';

const props = defineProps({
	uri: {
		type: String,
	},
});

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
const showSseNotification = (message) => {
	ElNotification.warning({
		title: '消息提醒',
		dangerouslyUseHTMLString: true,
		message: message + '请及时处理',
		offset: 0,
	});
};

/**
 * 初始化 SSE 连接
 * @param {string} uri - SSE 服务端 URI
 * @param {string} token - 访问令牌
 * @param {string} tenant - 租户信息
 */
const initSseConnection = (uri, token, tenant) => {
	//  baseURL
	const baseURL = import.meta.env.VITE_API_URL;
	const { eventSource, error } = useEventSource(`${baseURL}${uri}?access_token=${token}&TENANT-ID=${tenant}`);

	if (!error.value) {
		eventSource.value?.addEventListener('message', (message) => {
			if (eventSource.value?.OPEN && message.data !== 'pong') {
				showSseNotification(message.data);
			}
		});
	}
};

// 是否开启sseEnable
const sseEnable = ref(import.meta.env.VITE_SSE_ENABLE === 'true');

if (sseEnable.value) {
	initSseConnection(props.uri, token.value, tenant.value);
}
</script>
