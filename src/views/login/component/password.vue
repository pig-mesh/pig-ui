<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm" @keyup.enter="handleVerify">
		<el-form-item class="login-animation1" prop="username">
			<el-input text :placeholder="$t('password.accountPlaceholder1')" v-model="state.ruleForm.username" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
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
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon">
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
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" v-waves @click="handleVerify" :loading="loading">
				<span>{{ $t('password.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
		<div class="font12 mt30 login-animation4 login-msg">{{ $t('browserMsgText') }}</div>
	</el-form>
	<Verify @success="verifySuccess" :mode="'pop'" :captchaType="'blockPuzzle'" :imgSize="{ width: '330px', height: '155px' }" ref="verifyref" />
</template>

<script setup lang="ts" name="password">
import { reactive, defineAsyncComponent, ref, defineEmits } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from 'vue-i18n';

// 使用国际化插件
const { t } = useI18n();

// 动态加载滑块验证码组件
const Verify = defineAsyncComponent(() => import('/@/components/Verifition/Verify.vue'));

// 定义变量内容
const emit = defineEmits(['signInSuccess']); // 声明事件名称
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
});

const verifyref = ref<InstanceType<typeof Verify>>(null); // 定义verify组件引用
// 是否开启验证码
const verifyEnable = ref(import.meta.env.VITE_VERIFY_ENABLE === 'true');

// 调用滑块验证码进行校验
const handleVerify = async () => {
	const valid = await loginFormRef.value.validate().catch(() => {}); // 表单校验

	if (valid && verifyEnable.value) {
		verifyref.value.show(); // 显示验证组件
	} else if (valid) {
		onSignIn(); // 调用登录方法
	}
};

// 滑块验证码校验成功调用后台登录接口
const verifySuccess = (params: any) => {
	state.ruleForm.code = params.captchaVerification; // 获取验证码
	onSignIn(); // 调用登录方法
};

// 账号密码登录
const onSignIn = async () => {
	loading.value = true; // 正在登录中
	try {
		await useUserInfo().login(state.ruleForm); // 调用登录方法
		emit('signInSuccess'); // 触发事件
	} finally {
		loading.value = false; // 登录结束
	}
};
</script>
