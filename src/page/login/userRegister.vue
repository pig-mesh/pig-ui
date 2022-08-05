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
        size="small"
        @keyup.enter.native="handleRegister"
        v-model="registerForm.username"
        auto-complete="off"
        placeholder="请输入用户名"
      >
        <i slot="prefix" class="icon-yonghu"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="small"
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
        <i slot="prefix" class="icon-mima"></i>
      </el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input
        size="small"
        @keyup.enter.native="handleRegister"
        v-model="registerForm.phone"
        auto-complete="off"
        placeholder="请输入手机号"
      >
        <i slot="prefix" class="el-icon-phone-outline"></i>
      </el-input>
    </el-form-item>
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
import {checkPassword, checkPhone, validateUsername} from '@/const/crud/admin/user'

export default {
  name: "userRegister",
  data() {
    return {
      registerForm: {
        username: "",
        password: "",
        phone: ""
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
        ],
        phone: [
          {
            validator: checkPhone,
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
    showPassword() {
      this.passwordType == ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          registerUser(this.registerForm)
            .then(() => {
              this.$message.success("注册成功!")
              this.$emit("ok")
            })
        }
      });
    }
  }
};
</script>

<style></style>
