<template>
  <el-form size="large" class="login-content-form" :rules="dataRules" ref="dataFormRef" :model="state.ruleForm">
    <el-form-item class="login-animation1" prop="username">
      <el-input text :placeholder="$t('account.accountPlaceholder1')" v-model="state.ruleForm.username" clearable
                autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-User/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input :type="state.isShowPassword ? 'text' : 'password'"
                :placeholder="$t('account.accountPlaceholder2')" v-model="state.ruleForm.password" autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Unlock/>
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
    <el-form-item class="login-animation3" prop="phone">
      <el-input text :placeholder="$t('account.phonePlaceholder4')" v-model="state.ruleForm.phone" clearable
                autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon">
            <ele-Position/>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round v-waves @click="handleRegister"
                 :loading="loading">
        <span>{{ $t('account.registerBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="register">
import {rule} from "/@/utils/validate";
import {registerUser, validateUsername, validatePhone} from '/@/api/admin/user'
import {useMessage} from "/@/hooks/message"
import {useI18n} from "vue-i18n";

const emit = defineEmits(['afterSuccess']);

const {t} = useI18n()
const dataFormRef = ref()
const loading = ref(false)
const state = reactive({
  isShowPassword: false,
  ruleForm: {
    username: '',
    password: '',
    phone: ''
  }
});

const dataRules = ref(
    {
      username: [{required: true, message: "用户名不能为空", trigger: "blur"}, {
        min: 5,
        max: 20,
        message: "用户名称长度必须介于 5 和 20 之间",
        trigger: "blur"
      }, {
        validator: (rule: any, value: any, callback: any) => {
          validateUsername(rule, value, callback, false)
        }, trigger: 'blur'
      }],
      phone: [{required: true, message: "手机号不能为空", trigger: "blur"}, {
        validator: rule.validatePhone,
        trigger: 'blur'
      }, {
        validator: (rule: any, value: any, callback: any) => {
          validatePhone(rule, value, callback, false)
        }, trigger: 'blur'
      }],
      password: [{required: true, message: "密码不能为空", trigger: "blur"}, {
        min: 6,
        max: 20,
        message: "用户密码长度必须介于 6 和 20 之间",
        trigger: "blur"
      }]
    }
)

const handleRegister = () => {
  loading.value = true
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    registerUser(state.ruleForm).then(() => {
      useMessage().success(t('common.optSuccessText'))
      loading.value = false
      emit('afterSuccess')
    })
  })
}
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
}
</style>
