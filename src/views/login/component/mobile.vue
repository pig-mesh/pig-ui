<template>
	<el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm" @keyup.enter="handleLogin">
		<el-form-item class="login-animation1" prop="mobile">
			<el-input text :placeholder="$t('mobile.placeholder1')" v-model="loginForm.mobile" clearable autocomplete="off">
				<template #prefix>
					<i class="iconfont icon-dianhua el-input__icon"></i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2" prop="code">
			<el-col :span="15">
				<el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="loginForm.code" clearable autocomplete="off">
					<template #prefix>
						<el-icon class="el-input__icon">
							<ele-Position />
						</el-icon>
					</template>
				</el-input>
			</el-col>
			<el-col :span="1"></el-col>
			<el-col :span="8">
				<el-button v-waves class="login-content-code" @click="handleSendCode" :loading="msg.msgKey">{{ msg.msgText }} </el-button>
			</el-col>
		</el-form-item>
		<el-form-item class="login-animation3">
			<el-button round type="primary" v-waves class="login-content-submit" @click="handleLogin" :loading="loading">
				<span>{{ $t('mobile.btnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="loginMobile">
import { reactive } from 'vue';
import { sendMobileCode } from '/@/api/login';
import { useMessage } from '/@/hooks/message';
import { useUserInfo } from '/@/stores/userInfo';
import { rule } from '/@/utils/validate';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const emit = defineEmits(['signInSuccess']);
const loginFormRef = ref();
const loading = ref(false);

// 定义变量内容
const loginForm = reactive({
	mobile: '',
	code: '',
});

const loginRules = reactive({
	mobile: [{ required: true, trigger: 'blur', validator: rule.validatePhone }],
	code: [
		{
			required: true,
			trigger: 'blur',
			message: t('mobile.codeText'),
		},
	],
});

const handleSendCode = async () => {
	loginFormRef.value.validateField('mobile', (valid: boolean) => {
		if (!valid) {
			return false;
		}

		sendMobileCode(loginForm.mobile).then((response: any) => {
			if (response.data) {
				useMessage().success('验证码发送成功');
				// 调用验证码计时器
				timeCacl();
			} else {
				useMessage().error(response.msg);
			}
		});
	});
};

const handleLogin = async () => {
	loginFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
	});

	loading.value = true;
	useUserInfo()
		.loginByMobile(loginForm)
		.then(() => {
			emit('signInSuccess');
		})
		.finally(() => {
			loading.value = false;
		});
};

const msg = reactive({
	msgText: t('mobile.codeText'),
	msgTime: 60,
	msgKey: false,
});

const timeCacl = () => {
	// 计时避免重复发送
	msg.msgText = `${msg.msgTime}秒后重发`;
	msg.msgKey = true;
	const time = setInterval(() => {
		msg.msgTime--;
		msg.msgText = `${msg.msgTime}秒后重发`;
		if (msg.msgTime === 0) {
			msg.msgTime = 60;
			msg.msgText = t('mobile.codeText');
			msg.msgKey = false;
			clearInterval(time);
		}
	}, 1000);
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;

	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}

	.login-content-code {
		width: 100%;
		padding: 0;
	}

	.login-content-submit {
		width: 100%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
