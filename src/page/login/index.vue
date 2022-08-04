<template>
  <div class="login-container"
       @keyup.enter="handleLogin">
    <div class="login-time">
      {{time}}
    </div>
    <div class="login-weaper">
      <div class="login-left animate__animated animate__fadeInLeft">
        <img class="img"
             src="/img/logo.png"
             alt="">
        <p class="title">{{ $t('login.info') }}</p>
      </div>
      <div class="login-border animate__animated animate__fadeInRight">
        <div class="login-main">
          <p class="login-title">
            {{ $t('login.title') }}{{website.title}}
            <top-lang></top-lang>
          </p>
          <el-select v-model="active"
                     style="width:100%"
                     size="large"
                     class="login-select animated fadeIn"
                     placeholder="点击请选择租户"
                     @change="handleCommand">
            <el-option v-for="tenant in tenantList"
                       :key="tenant.id"
                       :label="tenant.name"
                       :value="tenant.id"></el-option>
          </el-select>
          <userLogin v-if="activeName==='user'"></userLogin>
          <codeLogin v-else-if="activeName==='code'"></codeLogin>
          <faceLogin v-else-if="activeName==='face'"></faceLogin>
          <div class="login-menu">
            <a href="#"
               @click.stop="activeName='user'">{{ $t('login.userLogin') }}</a>
            <a href="#"
               @click.stop="activeName='code'">{{ $t('login.phoneLogin') }}</a>
            <a href="#"
               @click.stop="activeName='face'">{{ $t('login.faceLogin') }}</a>
          </div>
          <thirdLogin></thirdLogin>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchList } from '@/api/admin/tenant'
import { getStore, setStore } from "@/util/store"
import userLogin from "./userlogin.vue";
import codeLogin from "./codelogin.vue";
import thirdLogin from "./thirdlogin.vue";
import faceLogin from "./facelogin.vue";
import { validatenull } from "@/util/validate";
import topLang from "@/page/index/top/top-lang.vue";
export default {
  name: "login",
  components: {
    userLogin,
    codeLogin,
    thirdLogin,
    faceLogin,
    topLang
  },
  data () {
    return {
      tenantList: [],
      active: '',
      socialForm: {},
      time: "",
      activeName: "user"
    };
  },
  watch: {
    $route () {
      const params = this.$route.query;
      this.socialForm = params
      if (!validatenull(this.socialForm.state)) {
        const loading = this.$loading({
          lock: true,
          text: `${this.socialForm.state === "WX" ? "微信" : "QQ"
            }登录中,请稍后。。。`,
          spinner: "el-icon-loading"
        });
        setTimeout(() => {
          loading.close();
        }, 2000);
      }
    }
  },
  created () {
    this.getTenantList()
    this.active = getStore({ name: 'tenantId' })
    this.getTime();
    setInterval(() => {
      this.getTime();
    }, 1000);
  },
  mounted () { },
  props: [],
  methods: {
    handleCommand (command) {
      setStore({ name: 'tenantId', content: command })
    },
    getTenantList () {
      fetchList().then(response => {
        this.tenantList = response.data.data
      })
    },
    getTime () {
      this.time = this.$dayjs().format('YYYY年MM月DD日 HH:mm:ss')
    }
  }
};
</script>
