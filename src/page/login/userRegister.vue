<template>
  <el-form
      class="login-form"
      status-icon
      :rules="registerRules"
      ref="registerForm"
      :model="registerForm"
      label-width="0"
  >
    <el-form-item prop="username">
      <el-input
          @keyup.enter.native="handleRegister"
          v-model="registerForm.username"
          auto-complete="off"
          placeholder="请输入用户名"
      >
        <template #prefix>
          <i class="icon-yonghu"></i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
          @keyup.enter.native="handleRegister"
          :type="passwordType"
          v-model="registerForm.password"
          auto-complete="off"
          placeholder="请输入密码"
      >
        <i
            class="el-icon-view el-input__icon"
            slot="suffix"
            @click="showPassword"
        ></i>
        <template #prefix>
          <i class="icon-mima"></i>
        </template>
      </el-input>
    </el-form-item>
    <SendSmsCode  v-model="registerForm" ref="smsCodeForm" @validatePhone="validatePhone"/>
    <el-form-item>
      <el-button
          type="primary"
          @click.native.prevent="handleRegister"
          class="login-submit"
      >注册
      </el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import {registerUser} from "@/api/login";
import {mapGetters} from "vuex";
import SendSmsCode from "@/components/Sms/index.vue";
import {checkPassword, checkPhone, validateUsername} from '@/const/crud/admin/user'

export default {
  name: "userRegister",
  components: {SendSmsCode},
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        phone: "",
        code: "",
      },
      checked: false,
      registerRules: {
        username: [
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          {
            validator: validateUsername,
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: checkPassword,
            trigger: 'blur'
          }
        ]
      },
      passwordType: "password"
    };
  },
  created() {
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  methods: {
    validatePhone(rule, value, callback) {
      checkPhone(rule, value, callback)
    },
    showPassword() {
      this.passwordType === ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.$refs.smsCodeForm.validate((valid2) => {
            if (valid2) {
              registerUser(this.registerForm)
                  .then(() => {
                    this.$message.success("注册成功!")
                    this.$emit("ok")
                  })
            }
          })
        }
      });
    }
  }
};
</script>

<style></style>
