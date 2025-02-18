<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm" @keyup.enter="handleLogin">
		<el-form-item class="login-animation1" prop="mobile">
			<el-input
				text
				:placeholder="$t('mobile.placeholder1')"
				v-model="loginForm.mobile"
				clearable
				class="h-11 dark:bg-slate-700 dark:text-slate-200"
				autocomplete="off"
			>
				<template #prefix>
					<i class="iconfont icon-dianhua el-input__icon dark:text-slate-400"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code">
			<div class="flex gap-2">
				<el-input
					text
					maxlength="4"
					:placeholder="$t('mobile.placeholder2')"
					v-model="loginForm.code"
					clearable
					class="flex-1 h-11 dark:bg-slate-700 dark:text-slate-200"
					autocomplete="off"
				>
					<template #prefix>
						<el-icon class="el-input__icon dark:text-slate-400">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
				<el-button
					v-waves
					@click="handleSendCode"
					:loading="msg.msgKey"
					:disabled="msg.msgKey"
					class="w-24 h-11 text-sm rounded-md transition-all duration-300 hover:-translate-y-[1px] hover:shadow-btn dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600"
				>
					<span class="text-xs font-semibold">{{ msg.msgText }}</span>
				</el-button>
			</div>
		</el-form-item>

		<el-form-item class="mt-4 login-animation4">
			<el-button
				type="primary"
				class="w-full h-11 text-sm font-semibold tracking-wide rounded-md transition-all duration-300 hover:-translate-y-[1px] hover:shadow-btn"
				v-waves
				@click="handleLogin"
				:loading="loading"
			>
				{{ $t('mobile.signIn') }}
			</el-button>
		</el-form-item>

		<div class="flex relative justify-between items-center">
			<div class="ml-auto text-sm">
				<a
					href="#"
					class="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
					@click="emit('change', LoginTypeEnum.PASSWORD)"
				>
					{{ $t('mobile.backToLogin') }}
				</a>
				<a
					href="#"
					v-if="autoRegisterEnable"
					class="ml-2 text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
					@click="emit('change', LoginTypeEnum.REGISTER)"
				>
					{{ $t('mobile.createAccount') }}
				</a>
			</div>
		</div>

		<div class="mt-8 text-xs leading-normal text-slate-400 login-animation4">
			{{ $t('browserMsgText') }}
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
 * 处理发送验证码事件。
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
		if (error.message) {
			useMessage().error(error.message);
		} else {
			useMessage().error(error.data || error.msg || t('mobile.sendFailed'));
		}
	}
};

/**
 * 处理登录事件。
 */
const handleLogin = async () => {
	if (!loginFormRef.value) return;

	try {
		await loginFormRef.value.validate();
		loading.value = true;
		await useUserInfo().loginByMobile(loginForm);
		useMessage().success(t('mobile.loginSuccess'));
		emit('signInSuccess');
	} finally {
		loading.value = false;
	}
};

// 定义响应式对象
const msg = reactive({
	msgText: t('mobile.codeText'),
	msgTime: 60,
	msgKey: false,
});

/**
 * 计算并更新倒计时。
 */
const timeCacl = () => {
	msg.msgText = `${msg.msgTime}${t('mobile.seconds')}`;
	msg.msgKey = true;
	const time = setInterval(() => {
		msg.msgTime--;
		msg.msgText = `${msg.msgTime}${t('mobile.seconds')}`;
		if (msg.msgTime === 0) {
			msg.msgTime = 60;
			msg.msgText = t('mobile.codeText');
			msg.msgKey = false;
			clearInterval(time);
		}
	}, 1000);
};
</script>

<style scoped>
.shadow-btn {
	box-shadow: 0 4px 12px rgba(var(--el-color-primary-rgb), 0.2);
}
</style>
