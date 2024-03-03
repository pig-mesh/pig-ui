<template>
  <el-form size="large" class="login-content-form" ref="loginFormRef" :rules="loginRules" :model="loginForm"
           @keyup.enter="handleLogin">
    <el-form-item class="login-animation1" prop="mobile">
      <el-input text :placeholder="$t('mobile.placeholder1')" v-model="loginForm.mobile" clearable autocomplete="off">
        <template #prefix>
          <i class="iconfont icon-dianhua el-input__icon"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="code">
      <el-col :span="15">
        <el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="loginForm.code" clearable
                  autocomplete="off">
          <template #prefix>
            <el-icon class="el-input__icon">
              <ele-Position/>
            </el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <el-button v-waves  @click="handleSendCode" :loading="msg.msgKey">
          <span class="font-semibold text-xs text-gray-500">
          {{
              msg.msgText
            }}
            </span>
        </el-button>
      </el-col>
    </el-form-item>

    <el-form-item class="login-animation3 mt-4">
      <el-button type="primary"  class="login-content-submit rounded-lg" v-waves @click="handleLogin"
                 :loading="loading">
        <span class="tracking-wide font-semibold">{{ $t('mobile.btnText') }}</span>
      </el-button>
    </el-form-item>

    <div class="relative flex items-center justify-between">
      <div class="text-sm ml-auto">
        <a href="#" class="text-primary hover:text-blue-600" @click="emit('change',LoginTypeEnum.PASSWORD)">
          密码登录
        </a>
        <a href="#" v-if="autoRegisterEnable" class="ml-2 text-primary hover:text-blue-600" @click="emit('change',LoginTypeEnum.REGISTER)">
          注册账号
        </a>
      </div>
    </div>

  </el-form>
</template>

<script setup lang="ts" name="loginMobile">
import {LoginTypeEnum, sendMobileCode} from '/@/api/login';
import {useMessage} from '/@/hooks/message';
import {useUserInfo} from '/@/stores/userInfo';
import {rule} from '/@/utils/validate';
import {useI18n} from 'vue-i18n';
import {ref} from "vue";

const {t} = useI18n();
const emit = defineEmits(['signInSuccess','change']);

// 创建一个 ref 对象，并将其初始化为 null
const autoRegisterEnable = ref(import.meta.env.VITE_REGISTER_ENABLE === 'true');
const loginFormRef = ref();
const loading = ref(false);

// 定义响应式对象
const loginForm = reactive({
  mobile: '',
  code: '',
});

// 定义校验规则
const loginRules = reactive({
  mobile: [{required: true, trigger: 'blur', validator: rule.validatePhone}],
  code: [
    {
      required: true,
      trigger: 'blur',
      message: t('mobile.codeText'),
    },
  ],
});

/**
 * 处理发送验证码事件。
 */
const handleSendCode = async () => {
  const valid = await loginFormRef.value.validateField('mobile').catch(() => {
  });
  if (!valid) return;

  const response = await sendMobileCode(loginForm.mobile);
  if (response.data) {
    useMessage().success('验证码发送成功');
    timeCacl();
  } else {
    useMessage().error(response.msg);
  }
};

/**
 * 处理登录事件。
 */
const handleLogin = async () => {
  const valid = await loginFormRef.value.validate().catch(() => {
  });
  if (!valid) return;

  try {
    loading.value = true;
    await useUserInfo().loginByMobile(loginForm);
    emit('signInSuccess');
  } finally {
    loading.value = false;
  }
};

// 定义响应式对象
const msg = reactive({
  msgText: t('mobile.codeText'),
  msgTime: 60,
  msgKey: false,
});

/**
 * 计算并更新倒计时。
 */
const timeCacl = () => {
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
