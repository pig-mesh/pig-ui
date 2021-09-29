<template>
  <div class="login-container">
    <div class="login-weaper  animated bounceInDown">
      <div class="login-left animate__animated animate__fadeInLeft">
        <img class="img" src="/img/logo.png" alt=""/>
        <p class="title">{{ website.title }}</p>
        <p>©{{ website.year }} {{ website.version }}</p>
      </div>
      <div class="login-border animate__animated animate__fadeInRight">
        <div class="login-main">
          <userLogin v-if="activeName === 'user'"></userLogin>
          <codeLogin v-else-if="activeName==='code'"></codeLogin>
          <div class="login-menu">
            <a href="#"
               @click.stop="activeName='user'">账号密码</a>
            <a href="#"
               @click.stop="activeName='code'">短信登录</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "@/styles/login.scss";
import userLogin from "./userlogin";
import codeLogin from "./codelogin";
import {mapGetters} from "vuex";

export default {
  name: "login",
  components: {
    userLogin,
    codeLogin
  },
  data() {
    return {
      activeName: "user"
    };
  },
  computed: {
    ...mapGetters(["website"])
  }
};
</script>
