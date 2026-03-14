<template>
	<div class="relative flex items-center justify-center min-h-screen overflow-hidden min-w-screen"
		:style="backgroundStyle">

		<!-- 右上角控制组件 -->
		<div class="absolute z-20 top-6 right-6">
			<Control />
		</div>

		<!-- 居中登录卡片 -->
		<div
			class="login-card relative z-10 w-full md:w-[560px] h-auto min-h-[690px] rounded-none md:rounded-2xl px-8 py-10 md:px-[120px] md:py-[80px] transition-all duration-600 animate-slide-in-up">
			<!-- Logo 和品牌区域 -->
			<div class="flex items-center justify-center mb-8">
				<div class="flex items-center justify-center rounded-lg logo-container w-14 h-14">
					<img class="object-contain w-9 h-9" :src="!themeConfig.logo ? logo : baseURL + themeConfig.logo"
						alt="Logo" />
				</div>
				<div class="ml-5 text-4xl font-bold text-gray-900 dark:text-white">
					{{ themeConfig.globalTitle }}
				</div>
			</div>

			<!-- 登录表单组件 -->
			<div class="w-full">
				<register v-if="loginType === LoginTypeEnum.REGISTER" @change="changeLoginType" />
				<password v-if="loginType === LoginTypeEnum.PASSWORD" @signInSuccess="signInSuccess"
					@change="changeLoginType" />
				<mobile v-if="loginType === LoginTypeEnum.MOBILE" @signInSuccess="signInSuccess"
					@change="changeLoginType" />
				<expire v-if="loginType === LoginTypeEnum.EXPIRE" :username="username" @change="changeLoginType" />
				<forget v-if="loginType === LoginTypeEnum.FORGET" @change="changeLoginType" />

				<!-- 社交登录（包含内置分割线） -->
				<social @signInSuccess="signInSuccess"
					v-if="loginType === LoginTypeEnum.PASSWORD || loginType === LoginTypeEnum.MOBILE" />
			</div>
		</div>

		<!-- 小程序二维码 -->
		<Qrcode />

		<!-- Footer 组件 -->
		<Footer />
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import logo from '/@/assets/login/logo.svg';
import loginBgLight from '/@/assets/login/login-bg.svg';
import loginBgDark from '/@/assets/login/login-bg-dark.svg';
import loginBgPhoneLight from '/@/assets/login/login-bg-phone.svg';
import loginBgPhoneDark from '/@/assets/login/login-bg-phone-dark.svg';
import { useI18n } from 'vue-i18n';
import { useWindowSize } from '@vueuse/core';
import { formatAxisI18n } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { LoginTypeEnum } from '/@/api/login';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
const Social = defineAsyncComponent(() => import('./component/social.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));
const Expire = defineAsyncComponent(() => import('./component/expire.vue'));
const Forget = defineAsyncComponent(() => import('./component/forget.vue'));
const Control = defineAsyncComponent(() => import('./component/control.vue'));
const Qrcode = defineAsyncComponent(() => import('./component/qrcode.vue'));
const Footer = defineAsyncComponent(() => import('./component/footer.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 登录方式
const loginType = ref(LoginTypeEnum.PASSWORD);
// 用户名
const username = ref('');

// 响应式窗口宽度（自动清理）
const { width: windowWidth } = useWindowSize();

/**
 * 动态背景样式
 * 根据暗黑模式和响应式断点选择对应的 SVG 背景
 */
const backgroundStyle = computed(() => {
	const isDark = themeConfig.value.isDark;
	const isMobile = windowWidth.value < 768; // md 断点
	const bgUrl = isMobile
		? (isDark ? loginBgPhoneDark : loginBgPhoneLight)
		: (isDark ? loginBgDark : loginBgLight);

	return {
		background: `url(${bgUrl}) no-repeat center/cover`,
		userSelect: 'none'
	};
});

/**
 * 切换登录类型
 * @param type - 登录类型枚举值
 * @param name - 用户名（可选）
 */
const changeLoginType = (type: LoginTypeEnum, name?: string) => {
	loginType.value = type;
	if (name) {
		username.value = name;
	}
};

/**
 * 登录成功后的跳转处理事件
 */
const signInSuccess = async () => {
	try {
		const isNoPower = await initBackEndControlRoutes();

		if (isNoPower) {
			useMessage().warning(t('errors.unauthorized'));
			Session.clear();
			return;
		}

		// 初始化登录成功时间问候语
		const currentTimeInfo = formatAxisI18n(new Date(), t);

		// 处理路由跳转
		if (route.query?.redirect) {
			await router.push({
				path: <string>route.query?.redirect
			});
		} else {
			await router.push('/');
		}

		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);

		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	} catch (error) {
		console.error('Login success handling error:', error);
		useMessage().error(t('errors.networkError'));
	}
};

/**
 * 页面加载时初始化
 */
onMounted(() => {
	NextLoading.done();
});
</script>

<style scoped>
/* 页面加载动画 */
@keyframes slide-in-up {
	from {
		opacity: 0;
		transform: translateY(30px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.animate-slide-in-up {
	animation: slide-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
