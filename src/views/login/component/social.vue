<template>
	<div class="social-login-container" style="font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif">
		<!-- 优雅的分割线 -->
		<div class="flex items-center my-6">
			<div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-slate-600">
			</div>
			<span class="px-4 text-xs font-medium tracking-wider text-gray-400 uppercase dark:text-slate-500">
				{{ $t('socialLogin.orContinueWith') || 'Or continue with' }}
			</span>
			<div class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-slate-600">
			</div>
		</div>

		<!-- 社交登录图标行 -->
		<div class="flex items-center justify-center gap-4">
			<!-- 企业微信 -->
			<button @click="handleClick(SocialLoginEnum.WEIXIN_CP)"
				class="social-btn social-btn-blue flex items-center justify-center transition-all duration-200 ease-out cursor-pointer group w-14 h-14 rounded-2xl"
				:title="$t('socialLogin.wechatWork')">
				<svg class="transition-transform duration-300 w-7 h-7 group-hover:scale-110" viewBox="0 0 1229 1024"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M702.72 849.92c-76.8 30.72-158.72 35.84-240.64 30.72-35.84-5.12-71.68-10.24-107.52-20.48-5.12 0-10.24 0-15.36 5.12-46.08 20.48-92.16 46.08-133.12 66.56-15.36 10.24-30.72 10.24-46.08 0s-15.36-25.6-15.36-46.08c10.24-35.84 10.24-71.68 15.36-107.52 0-5.12-5.12-10.24-5.12-15.36-51.2-51.2-92.16-102.4-122.88-168.96-51.2-122.88-40.96-245.76 30.72-358.4C134.4 112.64 247.04 46.08 380.16 15.36S641.28 0 764.16 61.44c112.64 56.32 194.56 143.36 230.4 266.24 15.36 46.08 20.48 92.16 15.36 138.24-25.6-25.6-56.32-30.72-87.04-15.36 0-30.72 0-61.44-10.24-92.16-20.48-71.68-61.44-128-112.64-174.08-87.04-71.68-194.56-102.4-307.2-102.4-117.76 10.24-220.16 51.2-302.08 133.12-66.56 66.56-102.4 148.48-97.28 245.76 5.12 81.92 40.96 148.48 92.16 204.8l40.96 40.96c20.48 15.36 25.6 30.72 15.36 51.2-5.12 20.48-10.24 46.08-15.36 66.56 0 5.12-5.12 10.24 0 10.24 5.12 5.12 10.24 0 10.24 0 25.6-15.36 56.32-30.72 81.92-51.2 15.36-10.24 30.72-10.24 51.2-5.12 87.04 25.6 179.2 25.6 266.24 0 5.12 0 10.24-5.12 10.24 5.12 10.24 30.72 25.6 51.2 56.32 66.56z"
						fill="#0082EF"></path>
					<path
						d="M1214.72 747.52c0 35.84-25.6 61.44-56.32 66.56-51.2 10.24-92.16 30.72-128 66.56-10.24 10.24-15.36 10.24-25.6 5.12-5.12-5.12-5.12-15.36 0-25.6 35.84-35.84 56.32-81.92 66.56-128 5.12-35.84 40.96-56.32 76.8-56.32 40.96 5.12 66.56 35.84 66.56 71.68z"
						fill="#0081EE"></path>
					<path
						d="M953.6 1024c-35.84 0-66.56-25.6-71.68-56.32-5.12-51.2-30.72-92.16-66.56-122.88-5.12-5.12-10.24-10.24-5.12-20.48 5.12-15.36 15.36-15.36 25.6-10.24 10.24 5.12 15.36 15.36 20.48 20.48 30.72 25.6 66.56 40.96 102.4 46.08 35.84 5.12 61.44 40.96 56.32 76.8 5.12 35.84-25.6 66.56-61.44 66.56z"
						fill="#FA6202"></path>
					<path
						d="M682.24 757.76c0-35.84 20.48-61.44 56.32-71.68 51.2-10.24 92.16-30.72 128-66.56 10.24-10.24 20.48-10.24 25.6 0 5.12 5.12 5.12 15.36-5.12 25.6-30.72 30.72-51.2 66.56-61.44 112.64 0 5.12 0 15.36-5.12 20.48-10.24 35.84-40.96 56.32-76.8 51.2-35.84-5.12-61.44-35.84-61.44-71.68z"
						fill="#FECD00"></path>
					<path
						d="M1035.52 578.56c15.36 30.72 30.72 56.32 51.2 76.8 10.24 10.24 10.24 20.48 5.12 25.6-5.12 10.24-15.36 10.24-25.6 0-25.6-30.72-61.44-51.2-97.28-61.44-10.24-5.12-20.48-5.12-30.72-5.12-20.48-5.12-40.96-15.36-46.08-40.96-10.24-25.6-10.24-51.2 10.24-71.68 20.48-25.6 46.08-30.72 71.68-25.6 25.6 10.24 46.08 25.6 51.2 56.32 0 15.36 5.12 30.72 10.24 46.08z"
						fill="#2CBD00"></path>
				</svg>
			</button>

			<!-- 钉钉 -->
			<button @click="handleClick(SocialLoginEnum.DINGTALK)"
				class="social-btn social-btn-sky flex items-center justify-center transition-all duration-200 ease-out cursor-pointer group w-14 h-14 rounded-2xl"
				:title="$t('socialLogin.dingtalk')">
				<svg class="transition-transform duration-300 w-7 h-7 group-hover:scale-110" viewBox="0 0 1024 1024"
					xmlns="http://www.w3.org/2000/svg">
					<path
						d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m200.1 375c-0.9 3.8-3.1 9.3-6.2 16h0.1l-0.3 0.6c-18.2 38.9-65.6 115.1-65.6 115.1l-0.2-0.5-13.9 24.1h66.8L565.1 764l29-115.4h-52.6l18.3-76.3c-14.8 3.6-32.3 8.4-52.9 15.1 0 0-28 16.4-80.6-31.5 0 0-35.5-31.3-14.9-39.1 8.7-3.3 42.5-7.6 69-11.1 35.9-4.8 58-7.4 58-7.4s-110.6 1.6-136.8-2.5c-26.2-4.1-59.5-47.9-66.6-86.4 0 0-11-21.1 23.6-11.1 34.5 10 177.5 39 177.5 39s-185.9-57-198.4-70.9c-12.4-13.8-36.4-75.9-33.3-114 0 0 1.3-9.5 11.1-6.9 0 0 137.5 62.8 231.5 97.2 94 34.4 175.8 51.9 165.2 96.4z"
						fill="#3AA2EB"></path>
				</svg>
			</button>

			<!-- 微信 -->
			<button @click="handleClick(SocialLoginEnum.WECHAT)"
				class="social-btn social-btn-green flex items-center justify-center transition-all duration-200 ease-out cursor-pointer group w-14 h-14 rounded-2xl"
				:title="$t('socialLogin.wechat')">
				<svg t="1766391832175" class="transition-transform duration-300 w-7 h-7 group-hover:scale-110" viewBox="0 0 1024 1024" version="1.1"
					xmlns="http://www.w3.org/2000/svg" p-id="7334" width="256" height="256">
					<path
						d="M337.387283 341.82659c-17.757225 0-35.514451 11.83815-35.514451 29.595375s17.757225 29.595376 35.514451 29.595376 29.595376-11.83815 29.595376-29.595376c0-18.49711-11.83815-29.595376-29.595376-29.595375zM577.849711 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763zM501.641618 401.017341c17.757225 0 29.595376-12.578035 29.595376-29.595376 0-17.757225-11.83815-29.595376-29.595376-29.595375s-35.514451 11.83815-35.51445 29.595375 17.757225 29.595376 35.51445 29.595376zM706.589595 513.479769c-11.83815 0-22.936416 12.578035-22.936416 23.6763 0 12.578035 11.83815 23.676301 22.936416 23.676301 17.757225 0 29.595376-11.83815 29.595376-23.676301s-11.83815-23.676301-29.595376-23.6763z"
						fill="#28C445" p-id="7335"></path>
					<path
						d="M510.520231 2.959538C228.624277 2.959538 0 231.583815 0 513.479769s228.624277 510.520231 510.520231 510.520231 510.520231-228.624277 510.520231-510.520231-228.624277-510.520231-510.520231-510.520231zM413.595376 644.439306c-29.595376 0-53.271676-5.919075-81.387284-12.578034l-81.387283 41.433526 22.936416-71.768786c-58.450867-41.433526-93.965318-95.445087-93.965317-159.815029 0-113.202312 105.803468-201.988439 233.803468-201.98844 114.682081 0 216.046243 71.028902 236.023121 166.473989-7.398844-0.739884-14.797688-1.479769-22.196532-1.479769-110.982659 1.479769-198.289017 85.086705-198.289017 188.67052 0 17.017341 2.959538 33.294798 7.398844 49.572255-7.398844 0.739884-15.537572 1.479769-22.936416 1.479768z m346.265896 82.867052l17.757225 59.190752-63.630058-35.514451c-22.936416 5.919075-46.612717 11.83815-70.289017 11.83815-111.722543 0-199.768786-76.947977-199.768786-172.393063-0.739884-94.705202 87.306358-171.653179 198.289017-171.65318 105.803468 0 199.028902 77.687861 199.028902 172.393064 0 53.271676-34.774566 100.624277-81.387283 136.138728z"
						fill="#28C445" p-id="7336"></path>
				</svg>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginSocial">
import Cookies from 'js-cookie';
import other from '/@/utils/other';
import { getLoginAppList } from '/@/api/admin/social';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { validateNull } from '/@/utils/validate';
import { SocialLoginEnum } from '/@/api/login';
import { useEventListener, useIntervalFn } from '@vueuse/core';

// 使用i18n
const { t } = useI18n();

/**
 * 执行跳转事件的函数。
 * @event signInSuccess
 */
const emit = defineEmits(['signInSuccess']);

/**
 * 存储弹出窗口实例的 Ref 对象。
 */
const winOpen = ref<Window | null>(null);

/**
 * 处理来自子窗口的消息事件
 */
const handleMessage = (event: MessageEvent) => {
	// 验证消息来源
	if (event.origin !== window.location.origin) {
		return;
	}

	// 处理登录成功消息
	if (event.data?.type === 'social-login-success') {
		cleanup();
		emit('signInSuccess');
	}
};

/**
 * 清理资源
 */
const cleanup = () => {
	// 停止轮询
	pause();

	// 关闭弹出窗口
	if (winOpen.value && !winOpen.value.closed) {
		winOpen.value.close();
		winOpen.value = null;
	}
};

/**
 * 点击按钮触发事件的回调函数,用于打开第三方登录授权页面。
 * @param thirdpart - 第三方平台类型
 */
const handleClick = async (thirdpart: SocialLoginEnum) => {
	// 获取租户配置的账号信息
	const { data } = await getLoginAppList();
	const result = data.find((item: any) => item.type === thirdpart);
	if (validateNull(result)) {
		useMessage().error(t('scan.appErrorTip'));
		return;
	}

	// 拼接授权回调地址
	let url: string = '';
	const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');

	// 企业微信登录
	if (thirdpart === SocialLoginEnum.WEIXIN_CP) {
		url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${result.appId}&agentid=${result.ext}&redirect_uri=${redirect_uri}&state=${SocialLoginEnum.WEIXIN_CP}-LOGIN`;
	}

	// 钉钉登录
	if (thirdpart === SocialLoginEnum.DINGTALK) {
		url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${result.appId}&scope=openid&state=${SocialLoginEnum.DINGTALK}-LOGIN&prompt=consent`;
	}

	// 微信扫码
	if (thirdpart === SocialLoginEnum.WECHAT) {
		url = `https://open.weixin.qq.com/connect/qrconnect?appid=${result.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_login&state=${SocialLoginEnum.WECHAT}-LOGIN#wechat_redirect`;
	}

	resume(); // 启动轮询
	// 打开授权窗口并存储实例
	winOpen.value = other.openWindow(url, thirdpart, 540, 540);
};

// 使用 VueUse 的 useEventListener 自动管理消息监听
useEventListener(window, 'message', handleMessage);

// 使用 VueUse 的 useIntervalFn 作为降级方案检查窗口状态
const { pause, resume } = useIntervalFn(
	() => {
		// 检查弹出窗口是否已关闭
		if (winOpen.value && winOpen.value.closed) {
			cleanup();
			if (Cookies.get('token')) {
				emit('signInSuccess');
			}
		}
	},
	1000, // 1秒检查一次
	{ immediate: false } // 不立即执行
);

// 组件卸载时自动清理
onUnmounted(() => {
	cleanup();
});
</script>

