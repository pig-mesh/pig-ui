<template>
  <div class="social-container">
    <div @click="handleClick('cas')">
      <span :style="{ backgroundColor: '#e6a23c' }" class="container">
        <i class="iconfont icon-login" />
      </span>
      <p class="title">CAS</p>
    </div>
    <div @click="handleClick('wechat')">
      <span :style="{ backgroundColor: '#6ba2d6' }" class="container">
        <i icon-class="wechat" class="iconfont icon-weixin" />
      </span>
      <p class="title">微信</p>
    </div>
    <div @click="handleClick('tencent')">
      <span :style="{ backgroundColor: '#8dc349' }" class="container">
        <i icon-class="qq" class="iconfont icon-qq" />
      </span>
      <p class="title">QQ</p>
    </div>
    <div @click="handleClick('gitee')">
      <span :style="{ backgroundColor: '#bf3030' }" class="container">
        <i icon-class="qq" class="iconfont icon-logo_gitee_icon" />
      </span>
      <p class="title">Gitee</p>
    </div>
    <div @click="handleClick('osc')">
      <span :style="{ backgroundColor: '#007B25' }" class="container">
        <i icon-class="qq" class="iconfont icon-oschina" />
      </span>
      <p class="title">开源中国</p>
    </div>
  </div>
</template>

<script setup lang="ts" name="loginSocial">
import Cookies from 'js-cookie';
import other from '/@/utils/other';


const emit = defineEmits(['signInSuccess']);
const winOpen = ref()
const timer = ref()

const handleClick = (thirdpart: string) => {
  let url: string = ''
  const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect')
  if (thirdpart === 'wechat') {
    const appid = 'wxd1678d3f83b1d83a'
    url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&state=WX-LOGIN&response_type=code&scope=snsapi_login#wechat_redirect`
  } else if (thirdpart === 'tencent') {
    const client_id = '101322838'
    url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ-LOGIN&client_id=${client_id}&redirect_uri=${redirect_uri}`
  } else if (thirdpart === 'gitee') {
    const client_id = '0c29cfd9cb1e0037fc837521bc08c1a7483d8fd9b3e123d46beec59a5544a881'
    url = `https://gitee.com/oauth/authorize?response_type=code&client_id=${client_id}&state=GITEE-LOGIN&redirect_uri=${redirect_uri}`
  } else if (thirdpart === 'osc') {
    const client_id = 'uLJ41IGu7qAGmzSVHwF4'
    url = `https://www.oschina.net/action/oauth2/authorize?response_type=code&client_id=${client_id}'&state=OSC-LOGIN&redirect_uri=${redirect_uri}`
  } else if (thirdpart === 'cas') {

    let returnUrl = encodeURIComponent(window.location.origin + '?state=CAS-LOGIN/#/authredirect')

    url = `http://127.0.0.1:8080/cas/login?service=${returnUrl}`
  }
  winOpen.value = other.openWindow(url, thirdpart, 540, 540)
}

onMounted(() => {
  timer.value = window.setInterval(() => {
    // 判断弹框是否关闭
    if (winOpen.value && winOpen.value.closed == true) {
      window.clearInterval(timer.value)
      // 如果已经获取到 token 则执行跳转事件
      if (Cookies.get('token')) {
        emit('signInSuccess')
      }
    }
  }, 500);
})
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.social-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .box {
    cursor: pointer;
  }

  .iconfont {
    color: #fff;
    font-size: 30px;
  }

  .container {
    $height: 50px;
    display: inline-block;
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  .title {
    text-align: center;
  }
}
</style>