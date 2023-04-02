<template>
	<div class="social-container">
		<div @click="handleClick('cas')">
			<SvgIcon name="local-cas" :size="35" />
			<p class="title">CAS</p>
		</div>
		<div @click="handleClick('wechat')">
			<SvgIcon name="local-wechat" :size="35" />
			<p class="title">微信</p>
		</div>
		<div @click="handleClick('tencent')">
			<SvgIcon name="local-qq" :size="35" />
			<p class="title">QQ</p>
		</div>
		<div @click="handleClick('gitee')">
			<SvgIcon name="local-gitee" :size="30" />
			<p class="title">Gitee</p>
		</div>
		<div @click="handleClick('osc')">
			<SvgIcon name="local-oschina" :size="30" />
			<p class="title">开源中国</p>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginSocial">
import Cookies from 'js-cookie';
import other from '/@/utils/other';

/**
 * 执行跳转事件的函数。
 * @event signInSuccess
 */
const emit = defineEmits(['signInSuccess']);

/**
 * 存储弹出窗口实例的 Ref 对象。
 */
const winOpen = ref();

/**
 * 计时器对象，用于检查弹出窗口是否关闭。
 */
const timer = ref();

/**
 * 点击按钮触发事件的回调函数，用于打开第三方登录授权页面。
 * @param thirdpart - 第三方平台名称。
 */
const handleClick = (thirdpart: string) => {
	let url: string = '';

	// 获取授权地址
	const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');
	if (thirdpart === 'wechat') {
		const appid = 'wxd1678d3f83b1d83a';
		url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&state=WX-LOGIN&response_type=code&scope=snsapi_login#wechat_redirect`;
	} else if (thirdpart === 'tencent') {
		const client_id = '101322838';
		url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ-LOGIN&client_id=${client_id}&redirect_uri=${redirect_uri}`;
	} else if (thirdpart === 'gitee') {
		const client_id = '0c29cfd9cb1e0037fc837521bc08c1a7483d8fd9b3e123d46beec59a5544a881';
		url = `https://gitee.com/oauth/authorize?response_type=code&client_id=${client_id}&state=GITEE-LOGIN&redirect_uri=${redirect_uri}`;
	} else if (thirdpart === 'osc') {
		const client_id = 'uLJ41IGu7qAGmzSVHwF4';
		url = `https://www.oschina.net/action/oauth2/authorize?response_type=code&client_id=${client_id}'&state=OSC-LOGIN&redirect_uri=${redirect_uri}`;
	} else if (thirdpart === 'cas') {
		let returnUrl = encodeURIComponent(window.location.origin + '?state=CAS-LOGIN/#/authredirect');
		url = `http://127.0.0.1:8080/cas/login?service=${returnUrl}`;
	}

	// 打开授权窗口并存储实例
	winOpen.value = other.openWindow(url, thirdpart, 540, 540);
};

/**
 * 页面加载后执行的函数，用于检查窗口是否关闭。
 */
onMounted(() => {
	timer.value = window.setInterval(() => {
		// 检查弹出窗口是否已关闭
		if (winOpen.value && winOpen.value.closed == true) {
			// 停止计时器
			window.clearInterval(timer.value);
			// 如果已获取到 token，则触发跳转事件
			if (Cookies.get('token')) {
				emit('signInSuccess');
			}
		}
	}, 500);
});
</script>
