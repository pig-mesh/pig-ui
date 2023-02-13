<template>
  <div class="login-container flex">
    <div class="login-left">
      <div class="login-left-logo">
        <img :src="logoMini"/>
        <div class="login-left-logo-text">
          <span>{{ getThemeConfig.globalViceTitle }}</span>
          <span class="login-left-logo-text-msg">{{ getThemeConfig.globalViceTitleMsg }}</span>
        </div>
      </div>
      <div class="login-left-img">
        <img :src="loginMain"/>
      </div>
      <img :src="loginBg" class="login-left-waves"/>
    </div>
    <div class="login-right flex">
      <div class="login-right-warp flex-margin">
        <div class="login-right-warp-mian">
          <div class="login-right-warp-main-title">{{ getThemeConfig.globalTitle }} 欢迎您！</div>
          <div class="login-right-warp-main-form">
            <div>
              <!--  租户选择 -->
              <tenant/>
              <el-tabs v-model="tabsActiveName">
                <!-- 用户名密码登录 -->
                <el-tab-pane :label="$t('label.one1')" name="account">
                  <Password @signInSuccess="signInSuccess"/>
                </el-tab-pane>
                <!-- 手机号登录 -->
                <el-tab-pane :label="$t('label.two2')" name="mobile">
                  <Mobile @signInSuccess="signInSuccess"/>
                </el-tab-pane>
                <!-- 社交登录 -->
                <el-tab-pane :label="$t('label.three3')" name="social">
                  <Social @signInSuccess="signInSuccess"/>
                </el-tab-pane>
                <!-- 注册 -->
                <el-tab-pane :label="$t('label.register')" name="register" v-if="getThemeConfig.isRegister">
                  <Register @afterSuccess="tabsActiveName = 'account'"/>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="loginIndex">
import {storeToRefs} from 'pinia';
import {useThemeConfig} from '/@/stores/themeConfig';
import {NextLoading} from '/@/utils/loading';
import logoMini from '/@/assets/logo-mini.svg';
import loginMain from '/@/assets/login-main.svg';
import loginBg from '/@/assets/login-bg.svg';
import {useI18n} from 'vue-i18n';
import {formatAxis} from '/@/utils/formatTime';
import {useMessage} from '/@/hooks/message';
import {Session} from '/@/utils/storage';
import {initBackEndControlRoutes} from '/@/router/backEnd';

// 引入组件
const Password = defineAsyncComponent(() => import('./component/password.vue'));
const Mobile = defineAsyncComponent(() => import('./component/mobile.vue'));
const Social = defineAsyncComponent(() => import('./component/social.vue'));
const Register = defineAsyncComponent(() => import('./component/register.vue'));
const Tenant = defineAsyncComponent(() => import('./component/tenant.vue'));

// 定义变量内容
const storesThemeConfig = useThemeConfig()
const {themeConfig} = storeToRefs(storesThemeConfig)
const {t} = useI18n()
const route = useRoute()
const router = useRouter()

// 默认选择账号密码登录方式
const tabsActiveName = ref('account')

// 获取布局配置信息
const getThemeConfig = computed(() => {
  return themeConfig.value;
});

// 页面加载时
onMounted(() => {
  NextLoading.done();
})

// 登录成功后的跳转处理事件
const signInSuccess = async () => {
  const isNoPower = await initBackEndControlRoutes();
  if (isNoPower) {
    useMessage().wraning('抱歉，您没有登录权限');
    Session.clear();
  } else {
    // 初始化登录成功时间问候语
    let currentTimeInfo = formatAxis(new Date());
    if (route.query?.redirect) {
      router.push({
        path: <string>route.query?.redirect,
        query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
      });
    } else {
      router.push('/');
    }
    // 登录成功提示
    const signInText = t('signInText');
    useMessage().success(`${currentTimeInfo}，${signInText}`);
    // 添加 loading，防止第一次进入界面时出现短暂空白
    NextLoading.start();
  }
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100%;
  background: var(--el-color-white);

  .login-left {
    flex: 1;
    position: relative;
    background-color: rgba(211, 239, 255, 1);
    margin-right: 100px;

    .login-left-logo {
      display: flex;
      align-items: center;
      position: absolute;
      top: 50px;
      left: 80px;
      z-index: 1;
      animation: logoAnimation 0.3s ease;

      img {
        width: 52px;
        height: 52px;
      }

      .login-left-logo-text {
        display: flex;
        flex-direction: column;

        span {
          margin-left: 10px;
          font-size: 28px;
          color: #26a59a;
        }

        .login-left-logo-text-msg {
          font-size: 12px;
          color: #32a99e;
        }
      }
    }

    .login-left-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 52%;

      img {
        width: 100%;
        height: 100%;
        animation: error-num 0.6s ease;
      }
    }

    .login-left-waves {
      position: absolute;
      top: 0;
      right: -100px;
    }
  }

  .login-right {
    width: 700px;

    .login-right-warp {
      border: 1px solid var(--el-color-primary-light-3);
      border-radius: 3px;
      width: 500px;
      height: 500px;
      position: relative;
      overflow: hidden;
      background-color: var(--el-color-white);

      .login-right-warp-one,
      .login-right-warp-two {
        position: absolute;
        display: block;
        width: inherit;
        height: inherit;

        &::before,
        &::after {
          content: '';
          position: absolute;
          z-index: 1;
        }
      }

      .login-right-warp-one {
        &::before {
          filter: hue-rotate(0deg);
          top: 0px;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--el-color-primary));
          animation: loginLeft 3s linear infinite;
        }

        &::after {
          filter: hue-rotate(60deg);
          top: -100%;
          right: 2px;
          width: 3px;
          height: 100%;
          background: linear-gradient(180deg, transparent, var(--el-color-primary));
          animation: loginTop 3s linear infinite;
          animation-delay: 0.7s;
        }
      }

      .login-right-warp-two {
        &::before {
          filter: hue-rotate(120deg);
          bottom: 2px;
          right: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(270deg, transparent, var(--el-color-primary));
          animation: loginRight 3s linear infinite;
          animation-delay: 1.4s;
        }

        &::after {
          filter: hue-rotate(300deg);
          bottom: -100%;
          left: 0px;
          width: 3px;
          height: 100%;
          background: linear-gradient(360deg, transparent, var(--el-color-primary));
          animation: loginBottom 3s linear infinite;
          animation-delay: 2.1s;
        }
      }

      .login-right-warp-mian {
        display: flex;
        flex-direction: column;
        height: 100%;

        .login-right-warp-main-title {
          height: 130px;
          line-height: 130px;
          font-size: 27px;
          text-align: center;
          letter-spacing: 3px;
          animation: logoAnimation 0.3s ease;
          animation-delay: 0.3s;
          color: var(--el-text-color-primary);
        }

        .login-right-warp-main-form {
          flex: 1;
          padding: 0 50px 50px;

        }
      }
    }
  }
}
</style>
