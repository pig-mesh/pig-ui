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
      <el-input text placeholder="请输入原密码" v-model="passwordFormData.password" clearable
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
          placeholder="请输入新密码"
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
          placeholder="请确认新密码"
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
      <el-button type="primary" class="login-content-submit rounded-lg" v-waves @click="handleResetPassword"
                 :loading="loading">
        <span class="tracking-wide font-semibold">{{ $t('password.resetBtnText') }}</span>
      </el-button>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts" name="expire">
import {resetUserPassword} from '/@/api/admin/user';
import {useMessage} from '/@/hooks/message';
import {useI18n} from 'vue-i18n';
import {LoginTypeEnum} from "/@/api/login";

// 注册生命周期事件
const emit = defineEmits(['afterSuccess', 'change']);

// 按需加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 使用i18n
const {t} = useI18n();

// 表单引用
const dataFormRef = ref();

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
    callback(new Error(t('personal.passwordRule')));
  } else {
    callback();
  }
};
const validatorScore = (rule: any, value: any, callback: any) => {
  if (score.value <= 1) {
    callback(new Error(t('personal.passwordScore')));
  } else {
    callback();
  }
};

// 表单验证规则
const dataRules = reactive({
  password: [{required: true, message: '密码不能为空', trigger: 'blur'}],
  newpassword1: [
    {
      min: 6,
      max: 20,
      message: '用户密码长度必须介于 6 和 20 之间',
      trigger: 'blur',
    },
    {validator: validatorScore, trigger: 'blur'},
  ],
  newpassword2: [
    {
      min: 6,
      max: 20,
      message: '用户密码长度必须介于 6 和 20 之间',
      trigger: 'blur',
    },
    {validator: validatorPassword2, trigger: 'blur'},
  ]
});

// 处理密码强度得分变化事件
const handlePassScore = (e) => {
  score.value = e;
};

/**
 * @name handleResetPassword
 * @description 重置密码
 */
const handleResetPassword = async () => {
  // 验证表单是否符合规则
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    // 开始加载
    loading.value = true;
    // 调用注册API
    await resetUserPassword(passwordFormData);
    // 注册成功提示
    useMessage().success(t('common.optSuccessText'));
    // 触发注册成功后的钩子函数
    emit('change', LoginTypeEnum.PASSWORD);
  } catch (err: any) {
    // 提示错误信息
    useMessage().error(err.msg);
  } finally {
    // 结束加载状态
    loading.value = false;
  }
};
</script>
