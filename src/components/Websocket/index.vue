<template>
	<div></div>
</template>
<script setup lang="ts" name="global-websocket">
import { ElNotification } from 'element-plus';
import { Session } from '/@/utils/storage';
import other from "/@/utils/other";

const emit = defineEmits(['rollback']);

const props = defineProps({
	uri: {
		type: String,
	},
});

const state = reactive({
	webSocket: ref(), // webSocket实例
	lockReconnect: false, // 重连锁，避免多次重连
	maxReconnect: 6, // 最大重连次数， -1 标识无限重连
	reconnectTime: 0, // 重连尝试次数
	heartbeat: {
		interval: 30 * 1000, // 心跳间隔时间
		timeout: 10 * 1000, // 响应超时时间
		pingTimeoutObj: ref(), // 延时发送心跳的定时器
		pongTimeoutObj: ref(), // 接收心跳响应的定时器
		pingMessage: JSON.stringify({ type: 'ping' }), // 心跳请求信息
	},
});

const token = computed(() => {
	return Session.getToken();
});

const tenant = computed(() => {
	return Session.getTenant();
});

onMounted(() => {
	initWebSocket();
});

onUnmounted(() => {
	state.webSocket.close();
	clearTimeoutObj(state.heartbeat);
});

const initWebSocket = () => {
	// ws地址
	let host = window.location.host;
	//  baseURL
	let baseURL = import.meta.env.VITE_API_URL;
	let wsUri = `ws://${host}${baseURL}${other.adaptationUrl(props.uri)}?access_token=${token.value}&TENANT-ID=${tenant.value}`;
	// 建立连接
	state.webSocket = new WebSocket(wsUri);
	// 连接成功
	state.webSocket.onopen = onOpen;
	// 连接错误
	state.webSocket.onerror = onError;
	// 接收信息
	state.webSocket.onmessage = onMessage;
	// 连接关闭
	state.webSocket.onclose = onClose;
};

const reconnect = () => {
	if (!token) {
		return;
	}
	if (state.lockReconnect || (state.maxReconnect !== -1 && state.reconnectTime > state.maxReconnect)) {
		return;
	}
	state.lockReconnect = true;
	setTimeout(() => {
		state.reconnectTime++;
		// 建立新连接
		initWebSocket();
		state.lockReconnect = false;
	}, 5000);
};
/**
 * 清空定时器
 */
const clearTimeoutObj = (heartbeat: any) => {
	heartbeat.pingTimeoutObj && clearTimeout(heartbeat.pingTimeoutObj);
	heartbeat.pongTimeoutObj && clearTimeout(heartbeat.pongTimeoutObj);
};
/**
 * 开启心跳
 */
const startHeartbeat = () => {
	const webSocket = state.webSocket;
	const heartbeat = state.heartbeat;
	// 清空定时器
	clearTimeoutObj(heartbeat);
	// 延时发送下一次心跳
	heartbeat.pingTimeoutObj = setTimeout(() => {
		// 如果连接正常
		if (webSocket.readyState === 1) {
			//这里发送一个心跳，后端收到后，返回一个心跳消息，
			webSocket.send(heartbeat.pingMessage);
			// 心跳发送后，如果服务器超时未响应则断开，如果响应了会被重置心跳定时器
			heartbeat.pongTimeoutObj = setTimeout(() => {
				webSocket.close();
			}, heartbeat.timeout);
		} else {
			// 否则重连
			reconnect();
		}
	}, heartbeat.interval);
};

/**
 * 连接成功事件
 */
const onOpen = () => {
	//开启心跳
	startHeartbeat();
	state.reconnectTime = 0;
};
/**
 * 连接失败事件
 * @param e
 */
const onError = () => {
	//重连
	reconnect();
};

/**
 * 连接关闭事件
 * @param e
 */
const onClose = () => {
	//重连
	reconnect();
};
/**
 * 接收服务器推送的信息
 * @param msgEvent
 */
const onMessage = (msgEvent: any) => {
	//收到服务器信息，心跳重置并发送
	startHeartbeat();
	const text = msgEvent.data;

	if (text.indexOf('pong') > 0) {
		return;
	}

	ElNotification.warning({
		title: '消息提醒',
		dangerouslyUseHTMLString: true,
		message: text + '请及时处理',
		offset: 60,
	});

	emit('rollback', text);
};
</script>
