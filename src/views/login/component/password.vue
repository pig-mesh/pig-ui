<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm" @keyup.enter="handleVerify" style="font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;">
		<!-- 用户名输入框 -->
		<el-form-item class="mb-6 login-animation1" prop="username">
			<el-input
				text
				:placeholder="$t('password.accountPlaceholder1')"
				v-model="state.ruleForm.username"
				clearable
				autocomplete="off"
				class="transition-all duration-200 rounded-md login-input h-11"
			>
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>

		<!-- 密码输入框 -->
		<el-form-item class="mb-6 login-animation2" prop="password">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('password.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				class="transition-all duration-200 rounded-md login-input h-11"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
						<ele-Unlock />
					</el-icon>
				</template>
				<template #suffix>
					<i
						class="text-gray-400 transition-colors duration-200 cursor-pointer iconfont el-input__icon login-content-password dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>

		<!-- 验证码输入框（条件渲染） -->
		<el-form-item class="mb-6 login-animation2" prop="code" v-if="verifyImageEnable">
			<div class="flex gap-3">
				<el-input
					text
					maxlength="4"
					:placeholder="$t('mobile.placeholder2')"
					v-model="state.ruleForm.code"
					clearable
					autocomplete="off"
					class="flex-1 transition-all duration-200 rounded-md login-input h-11"
				>
					<template #prefix>
						<el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
				<img
					:src="imgSrc"
					@click="getVerifyImageCode"
					class="captcha-img w-[120px] h-11 rounded-md cursor-pointer object-cover transition-all duration-200"
					alt="验证码"
				/>
			</div>
		</el-form-item>

		<!-- 登录按钮 -->
		<el-form-item class="mb-6 login-animation4">
			<el-button
				type="primary"
				class="login-btn w-full h-11 rounded-md font-medium text-[15px] transition-all duration-200"
				v-waves
				@click="handleVerify"
				:loading="loading"
			>
				<span class="font-semibold tracking-wide">{{ $t('password.accountBtnText') }}</span>
			</el-button>
		</el-form-item>

		<!-- 底部链接：找回密码 | 验证码登录 | 注册账号 -->
		<div class="flex items-center justify-center gap-3 mb-3 text-[13px]">
			<a
				href="#"
				class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400"
				@click.prevent="emit('change',LoginTypeEnum.FORGET)"
			>
				{{ $t('password.forgetPassword') }}
			</a>
			<span class="text-gray-300 dark:text-slate-600">|</span>
			<a
				href="#"
				class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400"
				@click.prevent="emit('change', LoginTypeEnum.MOBILE)"
			>
				{{ $t('password.mobileLogin') }}
			</a>
			<template v-if="autoRegisterEnable">
				<span class="text-gray-300 dark:text-slate-600">|</span>
				<a
					href="#"
					class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400"
					@click.prevent="emit('change', LoginTypeEnum.REGISTER)"
				>
					{{ $t('password.createAccount') }}
				</a>
			</template>
		</div>

		<!-- 服务协议提示 -->
		<div class="flex items-center justify-center">
			<span class="text-xs leading-relaxed text-center text-gray-400 dark:text-slate-500">
				{{ $t('password.agreement') }}
				<a href="#" class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400">{{ $t('password.serviceAgreement') }}</a>
				{{ $t('password.and') }}
				<a href="#" class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400">{{ $t('password.privacyPolicy') }}</a>
			</span>
		</div>
	</el-form>
	<Verify
		@success="verifySuccess"
		:mode="'pop'"
		:captchaType="captchaType"
		v-if="verifyEnable"
		:imgSize="{ width: '330px', height: '155px' }"
		ref="verifyref"
	/>
</template>

<script setup lang="ts" name="password">
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from 'vue-i18n';
import { generateUUID } from '/@/utils/other';
import { LoginErrorEnum, LoginTypeEnum } from '/@/api/login';

// 使用国际化插件
const { t } = useI18n();

// 动态加载滑块验证码组件
const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));
const captchaType = import.meta.env.VITE_CAPTCHA_TYPE || 'clickWord';

// 定义变量内容
const autoRegisterEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');
const emit = defineEmits(['signInSuccess', 'change']); // 声明事件名称
const loginFormRef = ref(); // 定义LoginForm表单引用
const loading = ref(false); // 定义是否正在登录中

const previewUserName = import.meta.env.VITE_PREVIEW_USERNAME; // 演示环境用户名
const previewPassword = import.meta.env.VITE_PREVIEW_PASSWORD; // 演示环境密码

const state = reactive({
	isShowPassword: false, // 是否显示密码
	ruleForm: {
		// 表单数据
		username: previewUserName, // 用户名
		password: previewPassword, // 密码
		code: '', // 验证码
		randomStr: captchaType, // 验证码随机数
	},
});

const loginRules = reactive({
	username: [{ required: true, trigger: 'blur', message: t('password.accountPlaceholder1') }], // 用户名校验规则
	password: [{ required: true, trigger: 'blur', message: t('password.accountPlaceholder2') }], // 密码校验规则
	code: [{ required: true, trigger: 'blur', message: t('password.imageCodeTip') }],
});

const verifyref = ref<InstanceType<typeof Verify>>(null); // 定义verify组件引用
// 是否开启验证码
const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true');
const verifyImageEnable = ref(import.meta.env.VITE_VERIFY_IMAGE_ENABLE === 'true');
const imgSrc = ref('');

/**
 * 获取图形验证码
 * @description 生成随机字符串并获取图形验证码图片
 */
const getVerifyImageCode = () => {
	state.ruleForm.randomStr = generateUUID();
	imgSrc.value = `${baseURL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${
		state.ruleForm.randomStr
	}`;
};

/**
 * 处理验证流程
 * @description 先进行表单验证，然后根据配置决定是否显示滑块验证码
 */
const handleVerify = async () => {
	try {
		const valid = await loginFormRef.value.validate();

		if (valid && verifyEnable.value) {
			verifyref.value.show(); // 显示验证组件
		} else if (valid) {
			await onSignIn(); // 调用登录方法
		}
	} catch (error) {
		// 表单验证失败，无需额外处理
		console.debug('Form validation failed:', error);
	}
};

/**
 * 滑块验证码校验成功回调
 * @param params - 验证码参数
 * @description 获取验证码并调用登录方法
 */
const verifySuccess = async (params: any) => {
	state.ruleForm.code = params.captchaVerification; // 获取验证码
	await onSignIn(); // 调用登录方法
};

/**
 * 账号密码登录
 * @description 处理账号密码登录逻辑，包括错误处理和状态管理
 */
const onSignIn = async () => {
	loading.value = true; // 正在登录中
	try {
		await useUserInfo().login(state.ruleForm); // 调用登录方法
		emit('signInSuccess'); // 触发事件
	} catch (err: any) {
		if (err?.data === LoginErrorEnum.CREDENTIALS_EXPIRED) {
			emit('change', LoginTypeEnum.EXPIRE, state.ruleForm.username); // 触发修改密码
		}
	} finally {
		loading.value = false; // 登录结束
		if (verifyImageEnable.value) {
			getVerifyImageCode();
		}
	}
};

/**
 * 组件挂载时初始化
 */
onMounted(() => {
	if (verifyImageEnable.value) {
		getVerifyImageCode();
	}
});
</script>

