<template>
  <el-form size="large" class="login-content-form" :rules="dataRules" ref="dataFormRef" :model="passwordFormData">
    <el-form-item class="login-animation1" prop="username">
      <el-input text :placeholder="$t('password.accountPlaceholder1')" disabled v-model="passwordFormData.username"
                clearable
                autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation1" prop="password">
      <el-input text :placeholder="$t('expire.oldPassword')" v-model="passwordFormData.password" clearable
                :type="showPassword ? 'text' : 'password'"
                autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
          </el-icon>
        </template>
        <template #suffix>
          <i
              class="iconfont el-input__icon login-content-password"
              :class="showPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
              @click="showPassword = !showPassword"
          >
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="newpassword1">
      <strength-meter
          :placeholder="$t('expire.newPassword')"
          v-model="passwordFormData.newpassword1"
          autocomplete="off"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
          </el-icon>
        </template>
      </strength-meter>
    </el-form-item>

    <el-form-item class="login-animation2" prop="newpassword2">
      <strength-meter
          :placeholder="$t('expire.confirmPassword')"
          v-model="passwordFormData.newpassword2"
          autocomplete="off"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore"
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
          </el-icon>
        </template>
      </strength-meter>
    </el-form-item>

    <el-form-item class="login-animation4">
      <el-button 
        type="primary" 
        class="rounded-lg login-content-submit" 
        v-waves 
        @click="handleResetPassword"
        :loading="loading"
      >
        <span class="font-semibold tracking-wide">{{ $t('password.resetBtnText') }}</span>
      </el-button>
    </el-form-item>

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
