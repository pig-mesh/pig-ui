<template>
  <div
    class="login-container"
    @keyup.enter="handleLogin">
    <div class="login-time">
      {{ time }}
    </div>
    <div class="login-weaper">
      <div class="login-left animate__animated animate__fadeInLeft">
        <img
          class="img"
          src="/img/logo.png"
          alt="">
        <p class="title">{{ $t('login.info') }}</p>
      </div>
      <div class="login-border animate__animated animate__fadeInRight">
        <div class="login-main">
          <div class="lock-form animate__animated animate__bounceInDown">
            <div
              class="animate__animated"
              :class="{'shake':passwdError,'animate__bounceOut':pass}">
              <h3 style="color:#333">{{ userInfo.username }}</h3>
              <el-input
                v-model="passwd"
                placeholder="请输入登录密码"
                type="password"
                class="input-with-select animated"
                @keyup.enter="handleLogin">
                <template #append>
                  <el-button
                    icon="icon-bofangqi-suoping"
                    @click="handleLogin"></el-button>
                  <el-button
                    icon="icon-tuichu"
                    @click="handleLogout"></el-button>
                </template>
              </el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'lock',
  data() {
    return {
      time: '',
      passwd: '',
      passwdError: false,
      pass: false
    }
  },
  created() {
    this.getTime()
    setInterval(() => {
      this.getTime()
    }, 1000)
  },
  mounted() { },
  computed: {
    ...mapGetters(['userInfo', 'tag', 'lockPasswd'])
  },
  components: {},
  props: [],
  methods: {
    getTime() {
      this.time = this.dayjs.format('YYYY年MM月DD日 HH:mm:ss')
    },
    handleLogout() {
      this.$confirm('是否退出系统, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          this.$router.push({ path: '/login' })
        })
      })
    },
    handleLogin() {
      if (this.passwd !== this.lockPasswd) {
        this.passwd = ''
        this.$message({
          message: '解锁密码错误,请重新输入',
          type: 'error'
        })
        this.passwdError = true
        setTimeout(() => {
          this.passwdError = false
        }, 1000)
        return
      }
      this.pass = true
      setTimeout(() => {
        this.$store.commit('CLEAR_LOCK')
        this.$router.push({
          path: this.tag.value
        })
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
</style>
