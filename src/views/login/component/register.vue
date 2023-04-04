<template>
	<el-form size="large" class="login-content-form" :rules="dataRules" ref="dataFormRef" :model="state.ruleForm">
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
			<strength-meter
				:placeholder="$t('password.accountPlaceholder2')"
				v-model="state.ruleForm.password"
				autocomplete="off"
				:maxLength="20"
				:minLength="6"
				@score="handlePassScore"
				><template #prefix>
					<el-icon class="el-input__icon">
						<ele-Unlock />
					</el-icon>
				</template>
			</strength-meter>
		</el-form-item>
		<el-form-item class="login-animation3" prop="phone">
			<el-input text :placeholder="$t('password.phonePlaceholder4')" v-model="state.ruleForm.phone" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon">
						<ele-Position />
					</el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item>
			<el-checkbox v-model="state.ruleForm.checked">
				{{ $t('password.readAccept') }}
			</el-checkbox>
			<el-button link type="primary">
				{{ $t('password.privacyPolicy') }}
			</el-button>
		</el-form-item>
		<el-form-item class="login-animation4">
			<el-button type="primary" class="login-content-submit" v-waves @click="handleRegister" :loading="loading">
				<span>{{ $t('password.registerBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script setup lang="ts" name="register">
import { registerUser, validateUsername, validatePhone } from '/@/api/admin/user';
import { useMessage } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

// 注册生命周期事件
const emit = defineEmits(['afterSuccess']);

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 使用i18n
const { t } = useI18n();

// 表单引用
const dataFormRef = ref();

// 加载中状态
const loading = ref(false);

// 密码强度得分
const score = ref('0');

// 组件内部状态
const state = reactive({
	// 是否显示密码
	isShowPassword: false,
	// 表单内容
	ruleForm: {
		username: '', // 用户名
		password: '', // 密码
		phone: '', // 手机号
		checked: '', // 是否同意条款
	},
});

// 表单验证规则
const dataRules = reactive({
	username: [
		{ required: true, message: '用户名不能为空', trigger: 'blur' },
		{
			min: 5,
			max: 20,
			message: '用户名称长度必须介于 5 和 20 之间',
			trigger: 'blur',
		},
		// 自定义方法验证用户名
		{
			validator: (rule, value, callback) => {
				validateUsername(rule, value, callback, false);
			},
			trigger: 'blur',
		},
	],
	phone: [
		{ required: true, message: '手机号不能为空', trigger: 'blur' },
		// 手机号格式验证方法
		{
			validator: rule.validatePhone,
			trigger: 'blur',
		},
		// 自定义方法验证手机号是否重复
		{
			validator: (rule, value, callback) => {
				validatePhone(rule, value, callback, false);
			},
			trigger: 'blur',
		},
	],
	password: [
		{ required: true, message: '密码不能为空', trigger: 'blur' },
		{
			min: 6,
			max: 20,
			message: '用户密码长度必须介于 6 和 20 之间',
			trigger: 'blur',
		},
		// 判断密码强度是否达到要求
		{
			validator: (_rule, _value, callback) => {
				if (Number(score.value) < 2) {
					callback('密码强度太低');
				} else {
					callback();
				}
			},
			trigger: 'blur',
		},
	],
	checked: [{ required: true, message: '请阅读并同意条款', trigger: 'blur' }],
});

// 处理密码强度得分变化事件
const handlePassScore = (e) => {
	score.value = e;
};

/**
 * @name handleRegister
 * @description 注册事件，包括表单验证、注册、成功后的钩子函数触发
 */
const handleRegister = async () => {
	// 验证表单是否符合规则
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		// 开始加载
		loading.value = true;
		// 调用注册API
		await registerUser(state.ruleForm);
		// 注册成功提示
		useMessage().success(t('common.optSuccessText'));
		// 触发注册成功后的钩子函数
		emit('afterSuccess');
	} catch (err: any) {
		// 提示错误信息
		useMessage().error(err.msg);
	} finally {
		// 结束加载状态
		loading.value = false;
	}
};
</script>
