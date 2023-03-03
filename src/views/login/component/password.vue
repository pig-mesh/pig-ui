<template>
  <el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="state.ruleForm">
    <el-form-item class="login-animation1">
      <el-input text :placeholder="$t('password.accountPlaceholder1')" v-model="state.ruleForm.username" clearable
        autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2">
      <el-input :type="state.isShowPassword ? 'text' : 'password'" :placeholder="$t('password.accountPlaceholder2')"
        v-model="state.ruleForm.password" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock />
          </el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password"
            :class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
            @click="state.isShowPassword = !state.isShowPassword">
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <Verify @success="verifySuccess" :mode="'pop'" :captchaType="'blockPuzzle'"
        :imgSize="{ width: '330px', height: '155px' }" ref="verifyref" />
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round v-waves @click="handleVerify" :loading="loading">
        <span>{{ $t('password.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
    <div class="font12 mt30 login-animation4 login-msg">{{ $t('browserMsgText') }}</div>
  </el-form>
</template>

<script setup lang="ts" name="password">
import { reactive, defineAsyncComponent, ref } from 'vue';
import { useUserInfo } from '/@/stores/userInfo';
import { useI18n } from "vue-i18n";

const { t } = useI18n()
const Verify = defineAsyncComponent(() => import('/@/components/verifition/Verify.vue'))

// 定义变量内容
const emit = defineEmits(['signInSuccess']);

const loginFormRef = ref()
const loading = ref(false);
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    username: 'admin',
    password: '123456',
    code: '',
    randomStr: 'blockPuzzle'
  }
});

const loginRules = reactive({
  username: [{ required: true, trigger: "blur", message: t('password.accountPlaceholder1') }],
  password: [{ required: true, trigger: "blur", message: t('password.accountPlaceholder2') }],
})

// @ts-ignore
const verifyref = ref<InstanceType<typeof Verify>>(null)

// 调用滑块验证码进行校验
const handleVerify = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    verifyref.value.show();
  })
}

// 滑块验证码校验成功调用后台登录接口
const verifySuccess = (params: any) => {
  state.ruleForm.code = params.captchaVerification;
  onSignIn()
}

// 账号密码登录
const onSignIn = () => {
  loading.value = true
  // 调用后台接口进行登录
  useUserInfo().login(state.ruleForm).then(() => {
    // 登录后前端页面跳转
    emit('signInSuccess')
  }).catch(() => {
    loading.value = false;
  })
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

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    width: 100%;
    padding: 0;
    font-weight: bold;
    letter-spacing: 5px;
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }

  .login-msg {
    color: var(--el-text-color-placeholder);
  }
}
</style>
