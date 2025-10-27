<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm" @keyup.enter="handleVerify">
		<el-form-item class="login-animation1" prop="username">
			<el-input
				text
				:placeholder="$t('password.accountPlaceholder1')"
				v-model="state.ruleForm.username"
				clearable
				autocomplete="off"
				class="dark:bg-slate-700 dark:text-slate-200"
			>
				<template #prefix>
					<el-icon class="el-input__icon dark:text-slate-400">
						<ele-User />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="password">
			<el-input
				:type="state.isShowPassword ? 'text' : 'password'"
				:placeholder="$t('password.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				class="dark:bg-slate-700 dark:text-slate-200"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon dark:text-slate-400">
						<ele-Unlock />
					</el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="state.isShowPassword = !state.isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code" v-if="verifyImageEnable">
			<el-col :span="15">
				<el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="state.ruleForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<img :src="imgSrc" @click="getVerifyImageCode" />
			</el-col>
		</el-form-item>
		<el-form-item class="mt-4 login-animation4">
			<el-button type="primary" class="rounded-lg login-content-submit" v-waves @click="handleVerify" :loading="loading">
				<span class="font-semibold tracking-wide">{{ $t('password.accountBtnText') }}</span>
			</el-button>
		</el-form-item>

		<div class="relative flex items-center justify-end mt-6">
			<div class="flex flex-wrap items-center gap-4 text-sm">
				<a 
					href="#" 
					class="font-medium text-blue-500 transition-colors duration-200 hover:text-blue-600"
					@click="emit('change', LoginTypeEnum.MOBILE)"
				>
					{{ $t('password.mobileLogin') }}
				</a>
				<span class="text-gray-300">|</span>
				<a 
					href="#" 
					class="font-medium text-blue-500 transition-colors duration-200 hover:text-blue-600"
					@click="emit('change',LoginTypeEnum.FORGET)"
				>
					{{ $t('password.forgetPassword') }}
				</a>
				<span v-if="autoRegisterEnable" class="text-gray-300">|</span>
				<a 
					href="#" 
					v-if="autoRegisterEnable" 
					class="font-medium text-blue-500 transition-colors duration-200 hover:text-blue-600"
					@click="emit('change', LoginTypeEnum.REGISTER)"
				>
					{{ $t('password.createAccount') }}
				</a>
			</div>
		</div>

		<div class="font12 mt30 login-animation4 login-msg text-slate-400">{{ $t('browserMsgText') }}</div>
	</el-form>
	<Verify
		@success="verifySuccess"
		:mode="'pop'"
		:captchaType="'blockPuzzle'"
		v-if="verifyEnable"
		:imgSize="{ width: '330px', height: '155px' }"
		ref="verifyref"
	/>
</template>

<script setup lang="ts" name="password">
import { defineAsyncComponent, reactive, ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { generateUUID } from '/@/utils/other';
import { LoginErrorEnum, LoginTypeEnum } from '/@/api/login';

// 使用国际化插件
const { t } = useI18n();

// 动态加载滑块验证码组件
const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));

// 定义变量内容
const autoRegisterEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');
const emit = defineEmits(['signInSuccess', 'change']); // 声明事件名称
const loginFormRef = ref(); // 定义LoginForm表单引用
const loading = ref(false); // 定义是否正在登录中
const state = reactive({
	isShowPassword: false, // 是否显示密码
	ruleForm: {
		// 表单数据
		username: 'admin', // 用户名
		password: '123456', // 密码
		code: '', // 验证码
		randomStr: 'blockPuzzle', // 验证码随机数
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
	imgSrc.value = `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/auth'}/code/image?randomStr=${
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
