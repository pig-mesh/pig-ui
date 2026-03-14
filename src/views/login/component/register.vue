<template>
	<!-- 注册页面标题 -->
	<div class="text-center mb-9">
		<h2 class="text-lg font-medium text-gray-900 dark:text-white">
			{{ $t('register.title') }}
		</h2>
	</div>

	<el-form size="large" class="login-content-form" :rules="dataRules" ref="dataFormRef" :model="state.ruleForm">
		<!-- 用户名 -->
		<el-form-item class="mb-6 login-animation1" prop="username">
			<el-input text :placeholder="$t('password.accountPlaceholder1')" v-model="state.ruleForm.username" clearable
				autocomplete="off" class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200">
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>

		<!-- 密码 -->
		<el-form-item class="mb-6 login-animation2" prop="password">
			<strength-meter :placeholder="$t('password.accountPlaceholder2')" v-model="state.ruleForm.password"
				autocomplete="off" class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
				:maxLength="20" :minLength="6" @score="handlePassScore">
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
						<ele-Unlock />
					</el-icon>
				</template>
			</strength-meter>
		</el-form-item>

		<!-- 手机号 -->
		<el-form-item class="mb-6 login-animation3" prop="phone">
			<el-input text type="tel" :placeholder="$t('password.phonePlaceholder4')" v-model="state.ruleForm.phone"
				clearable autocomplete="off" class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200">
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
						<ele-Position />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>

		<!-- 验证码 -->
		<el-form-item class="mb-6 login-animation3" prop="code">
			<div class="flex w-full gap-3">
				<el-input text maxlength="4" :placeholder="$t('register.codePlaceholder')" v-model="state.ruleForm.code"
					clearable autocomplete="off"
					class="flex-1 rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200">
					<template #prefix>
						<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
							<ele-Message />
						</el-icon>
					</template>
				</el-input>
				<el-button v-waves @click="handleSendCode" :loading="msgKey" :disabled="msgKey"
					class="w-[120px] h-11 text-[13px] rounded-md font-medium transition-all duration-200">
					<span class="font-semibold">{{ msgText }}</span>
				</el-button>
			</div>
		</el-form-item>

		<!-- 同意条款 -->
		<el-form-item prop="checked" class="mb-6">
			<el-checkbox v-model="state.ruleForm.checked" class="text-sm">
				<span class="text-gray-500 dark:text-slate-400">{{ $t('password.readAccept') }}</span>
				<a href="#" class="mx-1 text-blue-600 dark:text-blue-400 hover:underline">{{
					$t('password.privacyPolicy') }}</a>
			</el-checkbox>
		</el-form-item>

		<!-- 注册按钮 -->
		<el-form-item class="login-animation4">
			<el-button type="primary"
				class="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium text-base transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98]"
				v-waves @click="handleRegister" :loading="loading">
				<span class="font-semibold tracking-wide">{{ $t('password.registerBtnText') }}</span>
			</el-button>
		</el-form-item>

		<!-- 返回登录链接 -->
		<div class="flex items-center justify-center mt-3 text-sm font-medium">
			<a href="#" class="text-blue-600 cursor-pointer dark:text-blue-400 hover:underline"
				@click.prevent="emit('change', LoginTypeEnum.PASSWORD)">
				{{ $t('password.backToLogin') }}
			</a>
		</div>
	</el-form>
</template>

<script setup lang="ts" name="register">
import { registerUser, validatePhone, validateUsername } from '/@/api/admin/user';
import {sendMobileInnerCode} from "/@/api/admin/message";
import { LoginTypeEnum } from '/@/api/login';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';
import { useIntervalFn } from '@vueuse/core';
import type { FormInstance } from 'element-plus';

// 注册生命周期事件
const emit = defineEmits(['afterSuccess', 'change']);

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 使用i18n
const { t } = useI18n();

// 表单引用
const dataFormRef = ref<FormInstance>();

// 加载中状态
const loading = ref(false);

// 密码强度得分
const score = ref('0');

interface RuleForm {
	username: string;
	password: string;
	phone: string;
	code: string;
	checked: boolean;
}

// 组件内部状态
const state = reactive({
	// 是否显示密码
	isShowPassword: false,
	// 表单内容
	ruleForm: {
		username: '', // 用户名
		password: '', // 密码
		phone: '', // 手机号
		code: '', // 验证码
		checked: false, // 是否同意条款
	} as RuleForm,
});

type ValidateCallback = (error?: string) => void;
type ValidateRule = {
	field: string;
	fullField: string;
};

// 表单验证规则
const dataRules = reactive({
	username: [
		{ required: true, message: t('register.usernameEmpty'), trigger: 'blur' },
		{
			min: 5,
			max: 20,
			message: t('register.usernameLength'),
			trigger: 'blur',
		},
		{
			validator: (rule: ValidateRule, value: string, callback: ValidateCallback) => {
				validateUsername(rule, value, callback, false, t);
			},
			trigger: 'blur',
		},
	],
	phone: [
		{ required: true, message: t('register.phoneEmpty'), trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
		{
			validator: (rule: ValidateRule, value: string, callback: ValidateCallback) => {
				validatePhone(rule, value, callback, false, undefined, t);
			},
			trigger: 'blur',
		},
	],
	code: [
		{ required: true, message: t('register.codeRequired'), trigger: 'blur' },
		{ min: 4, max: 4, message: t('register.codeLength'), trigger: 'blur' },
	],
	password: [
		{ required: true, message: t('register.passwordEmpty'), trigger: 'blur' },
		{
			min: 6,
			max: 20,
			message: t('register.passwordLength'),
			trigger: 'blur',
		},
		{
			validator: (_rule: ValidateRule, _value: string, callback: ValidateCallback) => {
				if (Number(score.value) < 2) {
					callback(t('register.passwordStrength'));
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	checked: [
		{ required: true, message: t('register.termsRequired'), trigger: 'change' },
		{
			validator: (_rule: ValidateRule, value: boolean, callback: ValidateCallback) => {
				if (!value) {
					callback(t('register.termsRequired'));
				} else {
					callback();
				}
			},
			trigger: ['change', 'blur'],
		}
	],
});

// 验证码倒计时相关
const msgText = ref(t('register.codeText'));
const msgTime = ref(60);
const msgKey = ref(false);

// 使用 VueUse 的 useIntervalFn 实现倒计时
const { pause, resume } = useIntervalFn(
	() => {
		msgTime.value--;
		msgText.value = `${msgTime.value}${t('register.seconds')}`;
		if (msgTime.value === 0) {
			msgTime.value = 60;
			msgText.value = t('register.codeText');
			msgKey.value = false;
			pause();
		}
	},
	1000,
	{ immediate: false }
);

/**
 * 启动倒计时
 */
const timeCacl = () => {
	msgText.value = `${msgTime.value}${t('register.seconds')}`;
	msgKey.value = true;
	resume();
};

/**
 * 处理发送验证码事件
 * @description 验证手机号格式并发送验证码
 */
const handleSendCode = async () => {
	// 验证表单是否符合规则
	const valid = await dataFormRef.value?.validateField('phone').catch(() => { });
	if (!valid) {
		return false;
	}

	try {
		const { msg, ok } = await sendMobileInnerCode(state.ruleForm.phone);
		if (ok) {
			useMessage().success(t('register.sendSuccess'));
			timeCacl();
		} else {
			useMessage().error(msg);
		}
	} catch (err: any) {
		useMessage().error(err.msg || t('errors.networkError'));
		return false;
	}
};

/**
 * 处理密码强度得分变化事件
 * @param e - 密码强度得分
 */
const handlePassScore = (e: string) => {
	score.value = e;
};

/**
 * 处理注册事件
 * @description 包括表单验证、注册、成功后的钩子函数触发
 * @returns 注册是否成功
 */
const handleRegister = async () => {
	// 验证表单是否符合规则
	const valid = await dataFormRef.value?.validate().catch(() => { });
	if (!valid) {
		return false;
	}

	try {
		loading.value = true;
		await registerUser(state.ruleForm);
		useMessage().success(t('register.registerSuccess'));
		emit('afterSuccess');
		return true;
	} catch (err: any) {
		useMessage().error(err.msg || t('errors.networkError'));
		return false;
	} finally {
		loading.value = false;
	}
};
</script>
