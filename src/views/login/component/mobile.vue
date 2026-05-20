<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm"
		@keyup.enter="handleLogin" style="font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;">
		<!-- 手机号输入框 -->
		<el-form-item class="mb-6 login-animation1" prop="mobile">
			<el-input text type="tel" :placeholder="$t('mobile.placeholder1')" v-model="loginForm.mobile" clearable
				class="transition-all duration-200 rounded-md login-input h-11" autocomplete="off">
				<template #prefix>
					<i class="text-gray-400 iconfont icon-dianhua el-input__icon dark:text-slate-500"></i>
				</template>
			</el-input>
		</el-form-item>

		<!-- 验证码输入框 + 获取验证码按钮 -->
		<el-form-item class="mb-6 login-animation2" prop="code">
			<div class="flex gap-3">
				<el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="loginForm.code" clearable
					class="flex-1 transition-all duration-200 rounded-md login-input h-11" autocomplete="off">
					<template #prefix>
						<el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
				<SmsCodeButton
					:mobile="loginForm.mobile"
					:validate="() => loginFormRef?.validateField('mobile')"
					class="send-code-btn w-[120px] h-11 text-[13px] rounded-md font-medium transition-all duration-200">
				</SmsCodeButton>
			</div>
		</el-form-item>

		<!-- 登录按钮 -->
		<el-form-item class="mb-6 login-animation4">
			<el-button type="primary"
				class="login-btn w-full h-11 rounded-md font-medium text-[15px] transition-all duration-200" v-waves
				@click="handleLogin" :loading="loading">
				<span class="font-semibold tracking-wide">{{ $t('mobile.signIn') }}</span>
			</el-button>
		</el-form-item>

		<!-- 服务协议提示 -->
		<div class="flex items-center justify-center mb-3">
			<span class="text-xs leading-relaxed text-center text-gray-400 dark:text-slate-500">
				{{ $t('password.agreement') }}
				<a href="#" class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400">{{
					$t('password.serviceAgreement') }}</a>
				{{ $t('password.and') }}
				<a href="#" class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400">{{
					$t('password.privacyPolicy') }}</a>
			</span>
		</div>

		<!-- 返回登录链接 -->
		<div class="flex items-center justify-center mt-3 text-sm font-medium">
			<a href="#" class="text-blue-600 cursor-pointer dark:text-blue-400 hover:underline"
				@click.prevent="emit('change', LoginTypeEnum.PASSWORD)">
				{{ $t('mobile.backToLogin') }}
			</a>
		</div>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { LoginTypeEnum } from '/@/api/login';
import SmsCodeButton from '/@/components/Verifition/SmsCodeButton.vue';
import { useMessage } from '/@/hooks/message';
import { useUserInfo } from '/@/stores/userInfo';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';
import type { FormInstance } from 'element-plus';

const { t } = useI18n();
const emit = defineEmits(['signInSuccess', 'change']);

// 创建一个 ref 对象，并将其初始化为 null
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
 * 处理登录事件
 * @description 验证表单并执行手机号登录
 */
const handleLogin = async () => {
	if (!loginFormRef.value) return;

	const valid = await loginFormRef.value.validate().catch(() => false);
	if (!valid) return;

	try {
		loading.value = true;
		await useUserInfo().loginByMobile(loginForm);
		useMessage().success(t('mobile.loginSuccess'));
		emit('signInSuccess');
	} catch {
		useMessage().error(t('errors.loginFailed'));
	} finally {
		loading.value = false;
	}
};

</script>
