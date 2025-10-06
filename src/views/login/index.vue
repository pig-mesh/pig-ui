<template>
	<div class="flex items-center justify-center min-h-screen px-5 py-5 bg-gray-100 dark:bg-slate-900 min-w-screen">
		<!-- 右上角控制组件 -->
		<Control />

		<div
			class="w-full overflow-hidden bg-white border border-gray-200 shadow-lg dark:bg-slate-800 rounded-3xl dark:border-slate-700"
			style="max-width: 1000px"
		>
			<div class="w-full md:flex">
				<!-- 左侧插图区域 -->
				<div
					class="hidden w-[55%] bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-900/95 md:flex md:items-center md:justify-center"
				>
					<img
						class="w-[85%] h-auto max-h-[650px] object-contain opacity-100 dark:opacity-75 transition-opacity duration-300 hover:opacity-90"
						:src="!themeConfig.background ? illustration : baseURL + themeConfig.background"
						alt="Login illustration"
					/>
				</div>

				<!-- 右侧登录表单区域 -->
				<div class="w-full px-5 py-16 md:w-[45%] md:px-12">
					<div class="mb-16 text-center">
						<h1 class="text-4xl font-bold text-gray-900 dark:text-white tracking-wide font-['Inter']">{{ getThemeConfig.globalTitle }}</h1>
						<!-- 租户选择 -->
						<div class="mt-6" v-if="tenantEnable">
							<tenant class="shadow-sm" />
						</div>
					</div>

					<div class="w-full px-5">
						<!-- 登录表单组件 -->
						<register v-if="loginType === LoginTypeEnum.REGISTER" @change="changeLoginType" />
						<password v-if="loginType === LoginTypeEnum.PASSWORD" @signInSuccess="signInSuccess" @change="changeLoginType" />
						<mobile v-if="loginType === LoginTypeEnum.MOBILE" @signInSuccess="signInSuccess" @change="changeLoginType" />
						<expire v-if="loginType === LoginTypeEnum.EXPIRE" :username="username" @change="changeLoginType" />
            <forget v-if="loginType === LoginTypeEnum.FORGET" @change="changeLoginType"/>

						<!-- 分割线 -->
						<div class="flex items-center justify-center my-6 space-x-3">
							<span class="w-20 h-[1.5px] bg-gray-200 dark:bg-slate-600"></span>
							<span class="text-gray-600 dark:text-slate-400">{{ $t('divider.or') }}</span>
							<span class="w-20 h-[1.5px] bg-gray-200 dark:bg-slate-600"></span>
						</div>

						<!-- 社交登录 -->
						<social @signInSuccess="signInSuccess" />
					</div>
				</div>
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
import illustration from '/@/assets/login/login_bg.svg';
import { useI18n } from 'vue-i18n';
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
const Tenant = defineAsyncComponent(() => import('./component/tenant.vue'));
const Control = defineAsyncComponent(() => import('./component/control.vue'));
const Qrcode = defineAsyncComponent(() => import('./component/qrcode.vue'));
const Footer = defineAsyncComponent(() => import('./component/footer.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

// 是否启用租户下拉框显示
const tenantEnable = ref(import.meta.env.VITE_TENANT_LIST_ENABLE === 'true');

// 登录方式
const loginType = ref(LoginTypeEnum.PASSWORD);
// 用户名
const username = ref('');

// 修改登录类型
const changeLoginType = (type: LoginTypeEnum, name?: string) => {
	loginType.value = type;
	if (name) {
		username.value = name;
	}
};

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().warning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxisI18n(new Date(), t);
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect
			});
		} else {
			router.push('/');
		}
		// 登录成功提示
		const signInText = t('signInText');
		useMessage().success(`${currentTimeInfo}，${signInText}`);
		// 添加 loading，防止第一次进入界面时出现短暂空白
		NextLoading.start();
	}
};

// 页面加载时初始化语言
onMounted(() => {
	NextLoading.done();
});
</script>
