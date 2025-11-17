<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm" @keyup.enter="handleLogin">
		<!-- 手机号输入框 -->
		<el-form-item class="login-animation1 mb-7" prop="mobile">
			<el-input
				text
				type="tel"
				:placeholder="$t('mobile.placeholder1')"
				v-model="loginForm.mobile"
				clearable
				class="h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200 rounded-md border-gray-200 dark:border-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
				autocomplete="off"
			>
				<template #prefix>
					<i class="iconfont icon-dianhua el-input__icon text-gray-400 dark:text-slate-400"></i>
				</template>
			</el-input>
		</el-form-item>

		<!-- 验证码输入框 + 获取验证码按钮 -->
		<el-form-item class="login-animation2 mb-7" prop="code">
			<div class="flex gap-2">
				<el-input
					text
					maxlength="4"
					:placeholder="$t('mobile.placeholder2')"
					v-model="loginForm.code"
					clearable
					class="flex-1 h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200 rounded-md"
					autocomplete="off"
				>
					<template #prefix>
						<el-icon class="el-input__icon text-gray-400 dark:text-slate-400">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
				<el-button
					v-waves
					@click="handleSendCode"
					:loading="msgKey"
					:disabled="msgKey"
					class="w-[120px] h-11 text-sm rounded-md font-medium border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span class="text-xs font-semibold">{{ msgText }}</span>
				</el-button>
			</div>
		</el-form-item>

		<!-- 服务协议提示 -->
		<div class="flex items-center justify-center mt-4 mb-4">
			<span class="text-xs text-gray-500 dark:text-slate-400">
				{{ $t('password.agreement') }}
				<a href="#" class="text-blue-600 dark:text-blue-400 hover:underline mx-1">{{ $t('password.serviceAgreement') }}</a>
				{{ $t('password.and') }}
				<a href="#" class="text-blue-600 dark:text-blue-400 hover:underline mx-1">{{ $t('password.privacyPolicy') }}</a>
			</span>
		</div>

		<!-- 登录按钮 -->
		<el-form-item class="login-animation4">
			<el-button
				type="primary"
				class="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium text-base transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98]"
				v-waves
				@click="handleLogin"
				:loading="loading"
			>
				<span class="font-semibold tracking-wide">{{ $t('mobile.signIn') }}</span>
			</el-button>
		</el-form-item>

		<!-- 底部链接 -->
		<div class="flex items-center justify-center mt-5 gap-3 text-sm font-medium">
			<a
				href="#"
				class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
				@click.prevent="emit('change', LoginTypeEnum.PASSWORD)"
			>
				{{ $t('mobile.backToLogin') }}
			</a>
			<div v-if="autoRegisterEnable" class="w-px h-3 bg-gray-300 dark:bg-slate-600"></div>
			<a
				href="#"
				v-if="autoRegisterEnable"
				class="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
				@click.prevent="emit('change', LoginTypeEnum.REGISTER)"
			>
				{{ $t('mobile.createAccount') }}
			</a>
		</div>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { LoginTypeEnum, sendMobileCode } from '/@/api/login';
import { useMessage } from '/@/hooks/message';
import { useUserInfo } from '/@/stores/userInfo';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';
import { useIntervalFn } from '@vueuse/core';
import type { FormInstance } from 'element-plus';

const { t } = useI18n();
const emit = defineEmits(['signInSuccess', 'change']);

// 创建一个 ref 对象，并将其初始化为 null
const autoRegisterEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');
const loginFormRef = ref<FormInstance | null>(null);
const loading = ref(false);

// 定义响应式对象
const loginForm = reactive({
	mobile: '',
	code: '',
});

// 定义校验规则
const loginRules = reactive({
	mobile: [
		{ required: true, message: t('mobile.mobileRequired'), trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
	],
	code: [
		{ required: true, message: t('mobile.codeRequired'), trigger: 'blur' },
		{ min: 4, max: 4, message: t('mobile.codeLength'), trigger: 'blur' },
	],
});

/**
 * 处理发送验证码事件
 * @description 验证手机号格式并发送验证码
 */
const handleSendCode = async () => {
	if (!loginFormRef.value) return;

	try {
		await loginFormRef.value.validateField('mobile');

		const { msg, data } = await sendMobileCode(loginForm.mobile);
		if (data !== false) {
			useMessage().success(t('mobile.sendSuccess'));
			timeCacl();
		} else {
			useMessage().error(msg);
		}
	} catch (error: any) {
		const errorMsg = error?.msg || error?.message || t('mobile.sendFailed');
		useMessage().error(errorMsg);
	}
};

/**
 * 处理登录事件
 * @description 验证表单并执行手机号登录
 */
const handleLogin = async () => {
	if (!loginFormRef.value) return;

	try {
		await loginFormRef.value.validate();
		loading.value = true;
		await useUserInfo().loginByMobile(loginForm);
		useMessage().success(t('mobile.loginSuccess'));
		emit('signInSuccess');
	} catch (error) {
		useMessage().error(t('errors.loginFailed'));
	} finally {
		loading.value = false;
	}
};

// 定义响应式对象 - 使用 ref 替代 reactive 以配合 VueUse
const msgText = ref(t('mobile.codeText'));
const msgTime = ref(60);
const msgKey = ref(false);

// 使用 VueUse 的 useIntervalFn 实现倒计时，自动处理清理
const { pause, resume } = useIntervalFn(
	() => {
		msgTime.value--;
		msgText.value = `${msgTime.value}${t('mobile.seconds')}`;

		if (msgTime.value === 0) {
			msgTime.value = 60;
			msgText.value = t('mobile.codeText');
			msgKey.value = false;
			pause();
		}
	},
	1000,
	{ immediate: false }
);

/**
 * 计算并更新倒计时
 * @description 处理验证码发送后的倒计时逻辑，使用 VueUse 自动管理定时器生命周期
 */
const timeCacl = () => {
	msgText.value = `${msgTime.value}${t('mobile.seconds')}`;
	msgKey.value = true;
	resume();
};
</script>

<style scoped>
.shadow-btn {
	box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
}
</style>
