<template>
    <el-form size="large" class="login-content-form" ref="dataFormRef" :rules="dataRules" :model="forgetFormData">
      <el-form-item class="login-animation1" prop="phone">
        <el-input text :placeholder="$t('mobile.placeholder1')" v-model="forgetFormData.phone" clearable autocomplete="off"
                  class="dark:bg-slate-700 dark:text-slate-200">
          <template #prefix>
            <i class="iconfont icon-dianhua el-input__icon dark:text-slate-400"></i>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="login-animation2" prop="code">
        <el-col :span="15">
          <el-input text maxlength="4" :placeholder="$t('mobile.placeholder2')" v-model="forgetFormData.code" clearable
                    autocomplete="off" class="dark:bg-slate-700 dark:text-slate-200">
            <template #prefix>
              <el-icon class="el-input__icon dark:text-slate-400">
                <ele-Position/>
              </el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="8">
          <el-button v-waves @click="handleSendCode" :loading="msg.msgKey" :disabled="msg.msgKey"
                     class="w-full h-11 text-sm rounded-md transition-all duration-300 hover:-translate-y-[1px] hover:shadow-btn dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
            <span class="font-semibold text-xs">
              {{ msg.msgText }}
            </span>
          </el-button>
        </el-col>
      </el-form-item>
      <el-form-item class="login-animation2" prop="newpassword1">
        <strength-meter
          :placeholder="$t('forget.newPasswordPlaceholder')"
          v-model="forgetFormData.newpassword1"
          autocomplete="off"
          class="dark:bg-slate-700 dark:text-slate-200"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore"
        >
          <template #prefix>
            <el-icon class="el-input__icon dark:text-slate-400">
              <ele-Unlock/>
            </el-icon>
          </template>
        </strength-meter>
      </el-form-item>

      <el-form-item class="login-animation2" prop="newpassword2">
        <strength-meter
          :placeholder="$t('forget.confirmPasswordPlaceholder')"
          v-model="forgetFormData.newpassword2"
          autocomplete="off"
          class="dark:bg-slate-700 dark:text-slate-200"
          :maxLength="20"
          :minLength="6"
          @score="handlePassScore"
        >
          <template #prefix>
            <el-icon class="el-input__icon dark:text-slate-400">
              <ele-Unlock/>
            </el-icon>
          </template>
        </strength-meter>
      </el-form-item>

      <el-form-item class="login-animation4">
        <el-button type="primary" class="login-content-submit rounded-lg w-full h-11 text-sm font-semibold tracking-wide" 
                   v-waves @click="handleResetPassword" :loading="loading">
          <span class="tracking-wide font-semibold">{{ $t('password.resetBtnText') }}</span>
        </el-button>
      </el-form-item>

      <div class="flex relative justify-between items-center">
        <div class="ml-auto text-sm">
          <a href="#" class="text-blue-500 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300" 
             @click="emit('change', LoginTypeEnum.PASSWORD)">
            {{ $t('password.backToLogin') }}
          </a>
        </div>
      </div>

      <div class="mt-8 text-xs leading-normal text-slate-400 login-animation4">
        {{ $t('browserMsgText') }}
      </div>
    </el-form>
  </template>
  
  <script setup lang="ts" name="forget">
  import {LoginTypeEnum, sendMobileCode} from '/@/api/login';
  import {forgetUserPassword} from '/@/api/admin/user';
  import {useMessage} from '/@/hooks/message';
  import {rule} from '/@/utils/validate';
  import {useI18n} from 'vue-i18n';
  import {ref, reactive, defineAsyncComponent} from "vue";
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
    password: '',
    newpassword1: '',
    newpassword2: '',
  });

  // 定义响应式对象
  const msg = reactive({
    msgText: t('mobile.codeText'),
    msgTime: 60,
    msgKey: false,
  });

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
   * 处理发送验证码事件。
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
      if (error.message) {
        useMessage().error(error.message);
      } else {
        useMessage().error(error.data || error.msg || t('mobile.sendFailed'));
      }
    }
  };
  
  /**
   * 计算并更新倒计时。
   */
  const timeCacl = () => {
    msg.msgText = `${msg.msgTime}${t('mobile.seconds')}`;
    msg.msgKey = true;
    const time = setInterval(() => {
      msg.msgTime--;
      msg.msgText = `${msg.msgTime}${t('mobile.seconds')}`;
      if (msg.msgTime === 0) {
        msg.msgTime = 60;
        msg.msgText = t('mobile.codeText');
        msg.msgKey = false;
        clearInterval(time);
      }
    }, 1000);
  };

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
        // 开始加载
        loading.value = true;
        // 调用重置密码API
        await forgetUserPassword(forgetFormData);
        // 成功提示
        useMessage().success(t('common.optSuccessText'));
        // 触发跳转到登录页面
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
  