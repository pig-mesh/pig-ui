<template>
  <div class="mac_bg"></div>
  <div class="login animate__animated"
       :class="{'animate__bounceOut':pass}">
    <div class="head">
      <img src="https://avatar.gitee.com/uploads/61/632261_smallweigit.jpg!avatar100?1518660401"
           alt="">
    </div>
    <div class="message">Login Please</div>
    <div class="form">
      <div class="item"
           :class="isUserNameError?'error':''">
        <input class="account"
               placeholder="account here..."
               v-model="form.username" />
      </div>
      <div class="item"
           :class="isUserPasswordError?'error':''">
        <input class="password"
               placeholder="password here..."
               v-model="form.password"
               type="password" />
        <i class="iconfont icon-send"
           @click="handleLogin"></i>
      </div>
      <Verify @success="verifySuccess"
              :mode="'pop'"
              :captchaType="'blockPuzzle'"
              :imgSize="{ width: '330px', height: '155px' }"
              ref="verify" />
    </div>
  </div>
</template>
<script>
import { randomLenNum } from "@/util";
import { mapGetters } from "vuex";
import { getCode } from "@/api/code";
import Verify from "@/components/verifition/Verify.vue";
export default {
  components: {
    Verify,
  },
  data () {
    return {
      pass: false,
      isUserNameError: false,
      isUserPasswordError: false,
      form: {
        username: "admin",
        password: "123456",
        code: "",
        randomStr: "blockPuzzle",
      }
    }
  },
  computed: {
    ...mapGetters(["tagWel", "userInfo"])
  },
  created () {
    this.getTenant();
    this.refreshCode();
  },
  methods: {
    getTenant () {
      let domain = getTopUrl();
      // 临时指定域名，方便测试
      //domain = "https://bladex.vip";
      info(domain).then(res => {
        const data = res.data;
        if (data.success && data.data.tenantId) {
          this.tenantMode = false;
          this.loginForm.tenantId = data.data.tenantId;
          this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
        }
      })
    },
    refreshCode () {
      if (this.website.captchaMode) {
        getCaptcha().then(res => {
          const data = res.data;
          this.form.key = data.key;
          this.form.image = data.image;
        })
      }
    },
    verifySuccess (params) {
      this.pass = true
      this.form.code = params.captchaVerification;
      this.$store.dispatch("LoginByUsername", this.form).then(() => {
        this.$router.push({ path: this.tagWel.value });
      });
    },
    handleLogin () {
      if (this.form.username == '') {
        this.isUserNameError = true
        setTimeout(() => {
          this.isUserNameError = false
        }, 1000)
        return
        return
      } else if (this.form.password == '') {
        this.isUserPasswordError = true
        setTimeout(() => {
          this.isUserPasswordError = false
        }, 1000)
        return
      }
      this.$refs.verify.show();
    }
  }
}
</script>
<style scoped>
@import url("./login.css");
</style>