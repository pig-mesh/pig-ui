<template>
  <div class="mac_bg"></div>
  <div class="login animate__animated"
       :class="{'animate__bounceOut':pass}">
    <div class="head">
      <img src="https://avatar.gitee.com/uploads/61/632261_smallweigit.jpg!avatar100?1518660401"
           alt="">
    </div>
    <div class="message">{{userInfo.username}}</div>
    <div class="form">
      <div class="item"
           style="width:320px"
           :class="passwdError?'error':''">
        <input class="password"
               placeholder="password here..."
               v-model="passwd"
               type="password" />
        <i class="iconfont el-icon-unlock"
           @click="handleLogin"></i>
        <i class="iconfont icon-tuichu"
           @click="handleLogout"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data () {
    return {
      passwdError: false,
      passwd: '',
      pass: false
    }
  },
  computed: {
    ...mapGetters(['userInfo', "tag", "lockPasswd"])
  },
  methods: {
    handleLogout () {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.push({ path: "/login" });
      });
    },
    handleLogin () {
      if (this.passwd != this.lockPasswd) {
        this.passwd = "";
        this.passwdError = true;
        setTimeout(() => {
          this.passwdError = false;
        }, 1000);
        return;
      }
      this.pass = true;
      setTimeout(() => {
        this.$store.commit("CLEAR_LOCK");
        this.$router.push({
          path: this.tag.value
        });
      }, 1000);
    }
  }
}
</script>
<style scoped>
@import url("./login.css");
</style>