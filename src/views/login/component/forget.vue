<template>
	<!-- 忘记密码页面标题 -->
	<div class="text-center mb-9">
		<h2 class="text-lg font-medium text-gray-900 dark:text-white">
			{{ $t('forget.resetPasswordTitle') }}
		</h2>
		<p class="mt-2 text-xs text-gray-500 dark:text-slate-400">
			{{ $t('forget.resetPasswordTip') }}
		</p>
	</div>

	<el-form size="large" class="login-content-form" ref="dataFormRef" :rules="dataRules" :model="forgetFormData">
		<!-- 手机号 -->
		<el-form-item class="mb-6 login-animation1" prop="phone">
			<el-input
				text
				type="tel"
				:placeholder="$t('mobile.placeholder1')"
				v-model="forgetFormData.phone"
				clearable
				autocomplete="off"
				class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
			>
				<template #prefix>
					<i class="text-gray-400 iconfont icon-dianhua el-input__icon dark:text-slate-400"></i>
				</template>
			</el-input>
		</el-form-item>

		<!-- 验证码 -->
		<el-form-item class="mb-6 login-animation2" prop="code">
			<div class="flex gap-2">
				<el-input
					text
					maxlength="4"
					:placeholder="$t('mobile.placeholder2')"
					v-model="forgetFormData.code"
					clearable
					autocomplete="off"
					class="flex-1 rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
				>
					<template #prefix>
						<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
							<ele-Position/>
						</el-icon>
					</template>
				</el-input>
				<SmsCodeButton
					:mobile="forgetFormData.phone"
					:validate="() => dataFormRef?.validateField('phone')"
					class="w-[120px] h-11 text-sm rounded-md font-medium border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				/>
			</div>
		</el-form-item>

		<!-- 新密码 -->
		<el-form-item class="mb-6 login-animation2" prop="newpassword1">
			<strength-meter
				:placeholder="$t('forget.newPasswordPlaceholder')"
				v-model="forgetFormData.newpassword1"
				autocomplete="off"
				class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
				:maxLength="12"
				:minLength="10"
			>
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
						<ele-Unlock/>
					</el-icon>
				</template>
			</strength-meter>
		</el-form-item>

		<!-- 确认密码 -->
		<el-form-item class="mb-6 login-animation2" prop="newpassword2">
			<strength-meter
				:placeholder="$t('forget.confirmPasswordPlaceholder')"
				v-model="forgetFormData.newpassword2"
				autocomplete="off"
				class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
				:maxLength="12"
				:minLength="10"
			>
				<template #prefix>
					<el-icon class="text-gray-400 el-input__icon dark:text-slate-400">
						<ele-Unlock/>
					</el-icon>
				</template>
			</strength-meter>
		</el-form-item>

		<!-- 重置密码按钮 -->
		<el-form-item class="login-animation4">
			<el-button
				type="primary"
				class="w-full h-11 rounded-md bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium text-base transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98]"
				v-waves
				@click="handleResetPassword"
				:loading="loading"
			>
				<span class="font-semibold tracking-wide">{{ $t('password.resetBtnText') }}</span>
			</el-button>
		</el-form-item>

		<!-- 返回登录链接 -->
		<div class="flex items-center justify-center mt-3 text-sm font-medium">
			<a
				href="#"
				class="text-blue-600 cursor-pointer dark:text-blue-400 hover:underline"
				@click.prevent="emit('change', LoginTypeEnum.PASSWORD)"
			>
				{{ $t('password.backToLogin') }}
			</a>
		</div>
	</el-form>
</template>

  <script setup lang="ts" name="forget">
  import {LoginTypeEnum} from '/@/api/login';
  import {forgetUserPassword} from '/@/api/admin/user';
  import SmsCodeButton from '/@/components/Verifition/SmsCodeButton.vue';
  import {useMessage} from '/@/hooks/message';
  import {rule} from '/@/utils/validate';
  import {useI18n} from 'vue-i18n';
  import type { FormInstance } from 'element-plus';
  import { useSiteConfig } from '/@/stores/siteConfig';
  import { createPasswordRuleValidator } from '/@/utils/passwordRule';
  
  const {t} = useI18n();
  const { siteConfig } = storeToRefs(useSiteConfig());
  const emit = defineEmits(['afterSuccess', 'change']);
  
  // 按需加载组件
  const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

  // 表单引用
  const dataFormRef = ref<FormInstance>();

  // 加载中状态
  const loading = ref(false);

  const forgetFormData = reactive({
    phone: '',
    code: '',
    newpassword1: '',
    newpassword2: '',
  });

  const validatorPassword2 = (rule: any, value: any, callback: any) => {
    if (value !== forgetFormData.newpassword1) {
        callback(new Error(t('forget.passwordRule')));
    } else {
        callback();
    }
  };

  const passwordRuleValidator = createPasswordRuleValidator(() => siteConfig.value.passwordRule, t);

  // 表单验证规则
  const dataRules = reactive({
    phone: [{required: true, trigger: 'blur', validator: rule.validatePhone}],
    code: [
      {
        required: true,
        trigger: 'blur',
        message: t('mobile.codeRequired'),
      },
    ],
    newpassword1: [
        {
            required: true,
            message: t('forget.passwordEmpty'),
            trigger: 'blur',
        },
        {validator: passwordRuleValidator, trigger: 'blur'},
    ],
    newpassword2: [
        {
            required: true,
            message: t('forget.passwordEmpty'),
            trigger: 'blur',
        },
        {validator: validatorPassword2, trigger: 'blur'},
    ]
  });

  /**
   * 处理重置密码事件
   * @description 验证表单并执行密码重置操作
   * @returns 重置是否成功
   */
  const handleResetPassword = async () => {
    if (!dataFormRef.value) return false;

    // 验证表单是否符合规则
    const valid = await dataFormRef.value.validate().catch(() => false);
    if (!valid) return false;

    try {
        // 开始加载
        loading.value = true;
        // 调用重置密码API
        await forgetUserPassword(forgetFormData);
        // 成功提示
        useMessage().success(t('forget.resetSuccess'));
        // 触发跳转到登录页面
        emit('change', LoginTypeEnum.PASSWORD);
        return true;
    } catch (err: any) {
        // 提示错误信息
        useMessage().error(err.msg || t('errors.networkError'));
        return false;
    } finally {
        // 结束加载状态
        loading.value = false;
    }
  };
  </script>
