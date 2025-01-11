<template>
	<div class="select-none">
		<img :src="bg" class="wave" />
		<div class="flex-c absolute right-5 top-3">
			<el-select v-model="language" @change="handleLanguageChange">
				<el-option label="简体中文" value="chinese_simplified" />
				<el-option label="日语" value="japanese" />
				<el-option label="韩语" value="korean" />
			</el-select>
		</div>
		<div class="login-container">
			<div class="img">
				<img :src="illustration" />
			</div>
			<div class="login-box">
				<div class="login-form">
					<div class="login-title">{{ getThemeConfig.globalTitle }}</div>
					<el-tabs v-model="tabsActiveName">
						<!-- 用户名密码登录 -->
						<el-tab-pane :label="$t('label.one1')" name="account">
							<Password @signInSuccess="signInSuccess" />
						</el-tab-pane>
						<!-- 手机号登录 -->
						<el-tab-pane :label="$t('label.two2')" name="mobile">
							<Mobile @signInSuccess="signInSuccess" />
						</el-tab-pane>
						<!-- 注册 -->
						<el-tab-pane :label="$t('label.register')" name="register" v-if="registerEnable">
							<Register @afterSuccess="tabsActiveName = 'account'" />
						</el-tab-pane>
					</el-tabs>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginIndex">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import illustration from '/@/assets/login/login_bg.svg';
import bg from '/@/assets/login/bg.png';
import miniQr from '/@/assets/login/mini_qr.png';
import { useI18n } from 'vue-i18n';
import { formatAxis } from '/@/utils/formatTime';
import { useMessage } from '/@/hooks/message';
import { Session } from '/@/utils/storage';
import { initBackEndControlRoutes } from '/@/router/backEnd';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

// 是否开启注册
const registerEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');

// 默认选择账号密码登录方式
const tabsActiveName = ref('account');

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 添加语言相关变量和方法
const language = ref(locale.value);

// 语言切换处理函数
import translate from 'i18n-jsautotranslate';
const handleLanguageChange = (val: string) => {
	locale.value = val;
	// 如果使用了 i18n-jsautotranslate，也可以调用它的方法
	translate.changeLanguage(val);
};

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
	const isNoPower = await initBackEndControlRoutes();
	if (isNoPower) {
		useMessage().wraning('抱歉，您没有登录权限');
		Session.clear();
	} else {
		// 初始化登录成功时间问候语
		let currentTimeInfo = formatAxis(new Date());
		if (route.query?.redirect) {
			router.push({
				path: <string>route.query?.redirect,
				query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
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

// 页面加载时
onMounted(() => {
	NextLoading.done();
});
</script>

<style scoped>
.el-select {
	width: 120px;
}
</style>
