<template>
  <div class="login-container">
    <div class="login-weaper  animated bounceInDown">
      <div class="login-left animate__animated animate__fadeInLeft">
        <img class="img" src="/img/logo.png" alt="" />
        <p class="title">{{ website.title }}</p>
        <p>{{ website.version }}</p>
      </div>
      <div class="login-border animate__animated animate__fadeInRight">
        <div class="login-main">
          <userLogin v-if="activeName === 'user'"></userLogin>
          <codeLogin v-else-if="activeName==='code'"></codeLogin>
          <user-register v-else-if="activeName==='register'" @ok="activeName='user'"></user-register>
          <div class="login-menu">
            <a
              href="#"
              @click.stop="activeName='user'">账号密码</a>
            <a
              href="#"
              @click.stop="activeName='code'">短信登录</a>
            <a
              v-if="website.register"
              href="#"
              @click.stop="activeName='register'">用户注册</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import '@/styles/login.scss'
import userLogin from './userlogin.vue'
import codeLogin from './codelogin.vue'
import userRegister from '@/page/login/userRegister.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'login',
  components: {
    userLogin,
    codeLogin,
    userRegister
  },
  data() {
    return {
      activeName: 'user'
    }
  },
  computed: {
    ...mapGetters(['website'])
  }
}
</script>
