<template>
	<el-form size="large" class="login-content-form" :rules="dataRules" ref="dataFormRef" :model="state.ruleForm">
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
			<strength-meter
				:placeholder="$t('password.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				autocomplete="off"
				class="dark:bg-slate-700 dark:text-slate-200"
				:maxLength="20"
				:minLength="6"
				@score="handlePassScore"
			>
				<template #prefix>
					<el-icon class="el-input__icon dark:text-slate-400">
						<ele-Unlock />
					</el-icon>
				</template>
			</strength-meter>
		</el-form-item>
		<el-form-item class="login-animation3" prop="phone">
			<el-input
				text
				:placeholder="$t('password.phonePlaceholder4')"
				v-model="state.ruleForm.phone"
				clearable
				autocomplete="off"
				class="dark:bg-slate-700 dark:text-slate-200"
			>
				<template #prefix>
					<el-icon class="el-input__icon dark:text-slate-400">
						<ele-Position />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-checkbox v-model="state.ruleForm.checked" class="dark:text-slate-400">
				<span class="text-gray-400 dark:text-slate-400">{{ $t('password.readAccept') }}</span>
			</el-checkbox>
			<span class="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300">
				{{ $t('password.privacyPolicy') }}
			</span>
		</el-form-item>

		<el-form-item class="login-animation4">
			<el-button type="primary" class="rounded-lg login-content-submit" v-waves @click="handleRegister" :loading="loading">
				<span class="font-semibold tracking-wide">{{ $t('password.registerBtnText') }}</span>
			</el-button>
		</el-form-item>

		<div class="relative flex items-center justify-between">
			<div class="ml-auto text-sm">
				<a
					href="#"
					class="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
					@click="emit('change', LoginTypeEnum.PASSWORD)"
				>
					{{ $t('password.backToLogin') }}
				</a>
			</div>
		</div>
	</el-form>
</template>

<script setup lang="ts" name="register">
import { registerUser, validatePhone, validateUsername } from '/@/api/admin/user';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { LoginTypeEnum } from '/@/api/login';
import type { FormInstance } from 'element-plus';

// 注册生命周期事件
const emit = defineEmits(['afterSuccess', 'change']);

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 使用i18n
const { t } = useI18n();

// 表单引用
const dataFormRef = ref<FormInstance | null>(null);

// 加载中状态
const loading = ref(false);

// 密码强度得分
const score = ref('0');

interface RuleForm {
	username: string;
	password: string;
	phone: string;
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
				validateUsername(rule, value, callback, false);
			},
			trigger: 'blur',
		},
	],
	phone: [
		{ required: true, message: t('register.phoneEmpty'), trigger: 'blur' },
		{
			validator: (rule: ValidateRule, value: string, callback: ValidateCallback) => {
				validatePhone(rule, value, callback, false);
			},
			trigger: 'blur',
		},
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
	checked: [{ required: true, message: t('register.termsRequired'), trigger: 'blur' }],
});

// 处理密码强度得分变化事件
const handlePassScore = (e: string) => {
	score.value = e;
};

/**
 * @name handleRegister
 * @description 注册事件，包括表单验证、注册、成功后的钩子函数触发
 */
const handleRegister = async () => {
	if (!dataFormRef.value) return false;

	// 验证表单是否符合规则
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		await registerUser(state.ruleForm);
		useMessage().success(t('common.optSuccessText'));
		emit('afterSuccess');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
</script>
