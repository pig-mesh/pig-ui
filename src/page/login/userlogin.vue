<template>
  <el-form
      class="login-form"
      status-icon
      :rules="loginRules"
      ref="loginForm"
      :model="loginForm"
      label-width="0"
  >
    <el-form-item prop="username">
      <el-input
          @keyup.enter.native="handleLogin"
          v-model="loginForm.username"
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
          size="small"
          @keyup.enter.native="handleLogin"
          :type="passwordType"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码"
      >
        <template #suffix>
          <i class="el-icon-view el-input__icon"
             @click="showPassword"></i>
        </template>
        <template #prefix>
          <i class="icon-mima"></i>
        </template>

      </el-input>
      <i class="el-icon-view el-input__icon" @click="showPassword"></i>
    </el-form-item>
    <el-form-item prop="code" v-if="website.validateCode">
      <el-input
          @keyup.enter.native="handleLogin"
          :maxlength="code.len"
          v-model="loginForm.code"
          auto-complete="off"
          placeholder="请输入验证码"
      >
        <template #prefix>
          <i class="icon-yanzhengma"></i>
        </template>
        <template #append>
          <div class="login-code">
            <span
                class="login-code-img"
                @click="refreshCode"
                v-if="code.type === 'text'"
            >{{ code.value }}</span
            >
            <img
                :src="code.src"
                class="login-code-img"
                @click="refreshCode"
                v-else
            />
          </div>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button
          type="primary"
          @click.native.prevent="handleLogin"
          class="login-submit"
      >登录
      </el-button
      >
    </el-form-item>
  </el-form>
</template>

<script>
import {randomLenNum} from "@/util";
import {mapGetters} from "vuex";

export default {
  name: "userlogin",
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
        randomStr: ""
      },
      checked: false,
      code: {
        src: "/code",
        value: "",
        len: 4,
        type: "image"
      },
      loginRules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {pattern: /^([a-z\u4e00-\u9fa5\d]*?)$/, message: "请输入小写字母", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 6, message: "密码长度最少为6位", trigger: "blur"}
        ],
        code: [{required: true, message: "请输入验证码", trigger: "blur"}]
      },
      passwordType: "password"
    };
  },
  created() {
    if (this.website.validateCode) {
      this.refreshCode();
    }
  },
  computed: {
    ...mapGetters(["tagWel", "website"])
  },
  methods: {
    refreshCode() {
      this.loginForm.code = "";
      this.loginForm.randomStr = randomLenNum(this.code.len, true);
      this.code.type === "text"
          ? (this.code.value = randomLenNum(this.code.len))
          : (this.code.src = `/api/code?randomStr=${this.loginForm.randomStr}`);
    },
    showPassword() {
      this.passwordType === ""
          ? (this.passwordType = "password")
          : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store
              .dispatch("LoginByUsername", this.loginForm)
              .then(() => {
                this.$router.push({path: this.tagWel.value});
              })
              .catch(() => {
                this.refreshCode();
              });
        }
      });
    }
  }
};
</script>

<style></style>
