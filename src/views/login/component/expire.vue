<template>
  <!-- 页面标题 -->
  <div class="text-center mb-9">
    <h2 class="text-lg font-medium text-gray-900 dark:text-white">
      {{ $t('expire.title') || $t('password.resetBtnText') }}
    </h2>
    <p class="mt-2 text-xs text-gray-500 dark:text-slate-400">
      {{ $t('expire.tip') || $t('expire.oldPassword') }}
    </p>
  </div>

  <el-form size="large" class="login-content-form" :rules="dataRules" ref="dataFormRef" :model="passwordFormData"
    style="font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif;">
    <el-form-item class="mb-6 login-animation1" prop="username">
      <el-input text :placeholder="$t('password.accountPlaceholder1')" disabled v-model="passwordFormData.username"
                clearable
                autocomplete="off"
                class="transition-all duration-200 rounded-md login-input h-11">
        <template #prefix>
          <el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
            <ele-User/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="mb-6 login-animation1" prop="password">
      <el-input text :placeholder="$t('expire.oldPassword')" v-model="passwordFormData.password" clearable
                :type="showPassword ? 'text' : 'password'"
                autocomplete="off"
                class="transition-all duration-200 rounded-md login-input h-11">
        <template #prefix>
          <el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
            <ele-Unlock/>
          </el-icon>
        </template>
        <template #suffix>
          <i
              class="text-gray-400 transition-colors duration-200 cursor-pointer iconfont el-input__icon login-content-password dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300"
              :class="showPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
              @click="showPassword = !showPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="mb-6 login-animation2" prop="newpassword1">
      <strength-meter
          :placeholder="$t('expire.newPassword')"
          v-model="passwordFormData.newpassword1"
          autocomplete="off"
          class="rounded-md h-11"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore"
      >
        <template #prefix>
          <el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
            <ele-Unlock/>
          </el-icon>
        </template>
      </strength-meter>
    </el-form-item>

    <el-form-item class="mb-6 login-animation2" prop="newpassword2">
      <strength-meter
          :placeholder="$t('expire.confirmPassword')"
          v-model="passwordFormData.newpassword2"
          autocomplete="off"
          class="rounded-md h-11"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore"
      >
        <template #prefix>
          <el-icon class="text-gray-400 el-input__icon dark:text-slate-500">
            <ele-Unlock/>
          </el-icon>
        </template>
      </strength-meter>
    </el-form-item>

    <el-form-item class="login-animation4">
      <el-button
        type="primary"
        class="login-btn w-full h-11 rounded-md font-medium text-[15px] transition-all duration-200"
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
        class="text-gray-500 transition-all duration-200 login-link dark:text-slate-400"
        @click.prevent="emit('change', LoginTypeEnum.PASSWORD)"
      >
        {{ $t('password.backToLogin') }}
      </a>
    </div>
  </el-form>
</template>

<script setup lang="ts" name="expire">
import {resetUserPassword} from '/@/api/admin/user';
import {useMessage} from '/@/hooks/message';
import {useI18n} from 'vue-i18n';
import {LoginTypeEnum} from "/@/api/login";
import type { FormInstance } from 'element-plus';

// 注册生命周期事件
const emit = defineEmits(['afterSuccess', 'change']);

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 使用i18n
const {t} = useI18n();

// 表单引用
const dataFormRef = ref<FormInstance | null>(null);

// 加载中状态
const loading = ref(false);

// 密码强度得分
const score = ref('0');

const props = defineProps({
  // 当前的值
  username: String,
});

const showPassword = ref(false);
const passwordFormData = reactive({
  username: props.username,
  password: '',
  newpassword1: '',
  newpassword2: '',
});

const validatorPassword2 = (rule: any, value: any, callback: any) => {
  if (value !== passwordFormData.newpassword1) {
    callback(new Error(t('expire.passwordRule')));
  } else {
    callback();
  }
};
const validatorScore = (rule: any, value: any, callback: any) => {
  if (Number(score.value) <= 1) {
    callback(new Error(t('expire.passwordScore')));
  } else {
    callback();
  }
};

// 表单验证规则
const dataRules = reactive({
  password: [{required: true, message: t('expire.oldPassword'), trigger: 'blur'}],
  newpassword1: [
    {
      min: 6,
      max: 20,
      message: t('register.passwordLength'),
      trigger: 'blur',
    },
    {validator: validatorScore, trigger: 'blur'},
  ],
  newpassword2: [
    {
      min: 6,
      max: 20,
      message: t('register.passwordLength'),
      trigger: 'blur',
    },
    {validator: validatorPassword2, trigger: 'blur'},
  ]
});

// 处理密码强度得分变化事件
const handlePassScore = (e: string) => {
  score.value = e;
};

/**
 * @name handleResetPassword
 * @description 重置密码
 */
const handleResetPassword = async () => {
  if (!dataFormRef.value) return false;
  
  // 验证表单是否符合规则
  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) return false;

  try {
    loading.value = true;
    await resetUserPassword(passwordFormData);
    useMessage().success(t('expire.resetSuccess'));
    emit('change', LoginTypeEnum.PASSWORD);
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};
</script>
