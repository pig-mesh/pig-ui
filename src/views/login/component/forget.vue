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
				<el-button
					v-waves
					@click="handleSendCode"
					:loading="msgKey"
					:disabled="msgKey"
					class="w-[120px] h-11 text-sm rounded-md font-medium border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					<span class="text-xs font-semibold">{{ msgText }}</span>
				</el-button>
			</div>
		</el-form-item>

		<!-- 新密码 -->
		<el-form-item class="mb-6 login-animation2" prop="newpassword1">
			<strength-meter
				:placeholder="$t('forget.newPasswordPlaceholder')"
				v-model="forgetFormData.newpassword1"
				autocomplete="off"
				class="rounded-md h-11 bg-gray-50 dark:bg-slate-700 dark:text-slate-200"
				:maxLength="20"
				:minLength="6"
				@score="handlePassScore"
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
				:maxLength="20"
				:minLength="6"
				@score="handlePassScore"
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
  import {LoginTypeEnum, sendMobileCode} from '/@/api/login';
  import {forgetUserPassword} from '/@/api/admin/user';
  import {useMessage} from '/@/hooks/message';
  import {rule} from '/@/utils/validate';
  import {useI18n} from 'vue-i18n';
  import { useIntervalFn } from '@vueuse/core';
  import type { FormInstance } from 'element-plus';
  
  const {t} = useI18n();
  const emit = defineEmits(['afterSuccess', 'change']);
  
  // 按需加载组件
  const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

  // 表单引用
  const dataFormRef = ref<FormInstance>();

  // 加载中状态
  const loading = ref(false);

  // 密码强度得分
  const score = ref<string>('0');

  const forgetFormData = reactive({
    phone: '',
    code: '',
    newpassword1: '',
    newpassword2: '',
  });

  // 定义响应式对象 - 使用 ref 替代 reactive 以配合 VueUse
  const msgText = ref(t('mobile.codeText'));
  const msgTime = ref(60);
  const msgKey = ref(false);

  // 使用 VueUse 的 useIntervalFn 实现倒计时，自动处理清理
  const { pause, resume } = useIntervalFn(
    () => {
      msgTime.value--;
      msgText.value = `${msgTime.value}${t('mobile.seconds')}`;

      if (msgTime.value === 0) {
        msgTime.value = 60;
        msgText.value = t('mobile.codeText');
        msgKey.value = false;
        pause();
      }
    },
    1000,
    { immediate: false }
  );

  const validatorPassword2 = (rule: any, value: any, callback: any) => {
    if (value !== forgetFormData.newpassword1) {
        callback(new Error(t('forget.passwordRule')));
    } else {
        callback();
    }
  };

  const validatorScore = (rule: any, value: any, callback: any) => {
    if (Number(score.value) <= 1) {
        callback(new Error(t('forget.passwordScore')));
    } else {
        callback();
    }
  };

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
        {
            min: 6,
            max: 20,
            message: t('forget.passwordLength'),
            trigger: 'blur',
        },
        {validator: validatorScore, trigger: 'blur'},
    ],
    newpassword2: [
        {
            required: true,
            message: t('forget.passwordEmpty'),
            trigger: 'blur',
        },
        {
            min: 6,
            max: 20,
            message: t('forget.passwordLength'),
            trigger: 'blur',
        },
        {validator: validatorPassword2, trigger: 'blur'},
    ]
  });
  
  /**
   * 处理发送验证码事件
   * @description 验证手机号格式并发送验证码
   */
  const handleSendCode = async () => {
    if (!dataFormRef.value) return;

    try {
      await dataFormRef.value.validateField('phone');

      const {msg, data} = await sendMobileCode(forgetFormData.phone);
      if (data !== false) {
        useMessage().success(t('mobile.sendSuccess'));
        timeCacl();
      } else {
        useMessage().error(msg);
      }
    } catch (error: any) {
      const errorMsg = error?.msg || error?.message || t('mobile.sendFailed');
      useMessage().error(errorMsg);
    }
  };
  
  /**
   * 计算并更新倒计时
   * @description 处理验证码发送后的倒计时逻辑，使用 VueUse 自动管理定时器生命周期
   */
  const timeCacl = () => {
    msgText.value = `${msgTime.value}${t('mobile.seconds')}`;
    msgKey.value = true;
    resume();
  };

  /**
   * 处理密码强度得分变化事件
   * @param e - 密码强度得分
   */
  const handlePassScore = (e: string) => {
    score.value = e;
  };

  /**
   * 处理重置密码事件
   * @description 验证表单并执行密码重置操作
   * @returns 重置是否成功
   */
  const handleResetPassword = async () => {
    if (!dataFormRef.value) return false;

    try {
        // 验证表单是否符合规则
        const valid = await dataFormRef.value.validate();
        if (!valid) return false;

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
  