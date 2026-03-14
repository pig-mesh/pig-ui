<template>
	<div></div>
</template>

<!--
  全局 WebSocket 组件
  功能：与后端建立 WebSocket 长连接，支持心跳保活、断线自动重连、消息通知。
  用法：<Websocket uri="/ws/endpoint" @rollback="handleMessage" />
  流程：
    1. 组件挂载时，携带 token 和租户信息建立 WebSocket 连接
    2. 连接成功后启动心跳机制，每 30s 发送 ping，等待 10s 内收到 pong
    3. 若心跳超时或连接异常，自动重连（最多 6 次，间隔 5s）
    4. 收到业务消息时弹出 ElNotification 通知，并通过 rollback 事件传递给父组件
-->
<script setup lang="ts" name="global-websocket">
import { ElNotification } from 'element-plus';
import { Session } from '/@/utils/storage';
import other from '/@/utils/other';

const emit = defineEmits(['rollback']);

const props = defineProps({
	uri: {
		type: String,
	},
});

const state = reactive({
	webSocket: null as WebSocket | null,
	lockReconnect: false, // 重连锁，防止多个重连任务并发执行
	maxReconnect: 6, // 最大重连次数，-1 表示无限重连
	reconnectTime: 0, // 已重连次数
	heartbeat: {
		interval: 30 * 1000, // 心跳发送间隔（30s）
		timeout: 10 * 1000, // 等待 pong 响应的超时时间（10s）
		pingTimeoutObj: null as ReturnType<typeof setTimeout> | null, // 下一次发送 ping 的定时器
		pongTimeoutObj: null as ReturnType<typeof setTimeout> | null, // 等待 pong 响应的超时定时器
		pingMessage: JSON.stringify({ type: 'ping' }),
	},
});

onMounted(() => {
	initWebSocket();
});

onUnmounted(() => {
	state.webSocket?.close();
	clearTimeoutObj(state.heartbeat);
});

/**
 * 初始化 WebSocket 连接
 * 根据当前页面协议自动选择 ws/wss，URL 中携带 access_token 进行鉴权
 */
const initWebSocket = () => {
	const { host, protocol: pageProtocol } = window.location;
	const protocol = pageProtocol === 'https:' ? 'wss' : 'ws';
	const wsUri = `${protocol}://${host}${baseURL}${other.adaptationUrl(props.uri)}?access_token=${Session.getToken()}`;

	state.webSocket = new WebSocket(wsUri);
	state.webSocket.onopen = onOpen;
	state.webSocket.onerror = onError;
	state.webSocket.onmessage = onMessage;
	state.webSocket.onclose = onClose;
};

/**
 * 断线重连
 * 加锁防止并发重连，每次间隔 5s，超过最大重连次数后停止
 */
const reconnect = () => {
	// token 不存在说明已登出，无需重连
	if (!Session.getToken()) {
		return;
	}
	if (state.lockReconnect || (state.maxReconnect !== -1 && state.reconnectTime > state.maxReconnect)) {
		return;
	}
	state.lockReconnect = true;
	setTimeout(() => {
		state.reconnectTime++;
		initWebSocket();
		state.lockReconnect = false;
	}, 5000);
};

/** 清除心跳相关的所有定时器 */
const clearTimeoutObj = (heartbeat: typeof state.heartbeat) => {
	if (heartbeat.pingTimeoutObj) clearTimeout(heartbeat.pingTimeoutObj);
	if (heartbeat.pongTimeoutObj) clearTimeout(heartbeat.pongTimeoutObj);
};

/**
 * 启动心跳检测
 * 每次收到消息或连接成功时调用，重置心跳周期：
 *   - 等待 interval 后发送 ping
 *   - 发送后启动 timeout 计时，若超时未收到 pong 则主动断开触发重连
 */
const startHeartbeat = () => {
	const { webSocket, heartbeat } = state;
	clearTimeoutObj(heartbeat);

	heartbeat.pingTimeoutObj = setTimeout(() => {
		if (webSocket?.readyState === WebSocket.OPEN) {
			webSocket.send(heartbeat.pingMessage);
			heartbeat.pongTimeoutObj = setTimeout(() => {
				webSocket.close();
			}, heartbeat.timeout);
		} else {
			reconnect();
		}
	}, heartbeat.interval);
};

/** 连接成功：启动心跳，重置重连计数 */
const onOpen = () => {
	startHeartbeat();
	state.reconnectTime = 0;
};

/** 连接异常：触发重连 */
const onError = () => {
	reconnect();
};

/** 连接关闭：触发重连 */
const onClose = () => {
	reconnect();
};

/**
 * 接收服务器消息
 * 收到任意消息都会重置心跳计时；pong 为心跳响应直接忽略，
 * 业务消息则弹出通知并通过 rollback 事件传递给父组件
 */
const onMessage = (msgEvent: MessageEvent) => {
	startHeartbeat();
	const text = msgEvent.data;

	if (text.includes('pong')) {
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
