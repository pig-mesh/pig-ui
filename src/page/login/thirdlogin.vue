<template>
  <div class="third">
    <div class="box">
      <i class="iconfont icon-QQ"
         @click="handleClick('qq')"
         style="color:#53a4d8"></i>
      <i class="iconfont icon-weixinicon2x"
         @click="handleClick('wx')"
         style="color:#71c252"></i>
      <i class="iconfont icon-weibo"
         @click="handleClick('wb')"
         style="color:#c73420"></i>
      <i class="iconfont icon-zhifubao"
         @click="handleClick('zfb')"
         style="color:#439fe2"></i>
      <i class="iconfont  icon-huaban88"
         @click="handleClick('github')"
         style="color:#666"></i>
    </div>
  </div>
</template>

<script>
import { openWindow } from "@/util/index";

export default {
  name: "thirdLogin",
  methods: {
    handleClick (thirdpart) {
      let appid, client_id, redirect_uri, url;
      redirect_uri = encodeURIComponent(
        window.location.origin + "/#/authredirect"
      );
      if (thirdpart === "wx") {
        appid = "xxxx";
        url =
          "https://open.weixin.qq.com/connect/qrconnect?appid=" +
          appid +
          "&redirect_uri=" +
          redirect_uri +
          "&state=WX&response_type=code&scope=snsapi_login#wechat_redirect";
      } else if (thirdpart === "qq") {
        client_id = "xxxx";
        url =
          "https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ&client_id=" +
          client_id +
          "&redirect_uri=" +
          redirect_uri;
      }
      openWindow(url, thirdpart, 540, 540);
    }
  }
};
</script>

<style lang="scss" scoped>
.third {
  padding: 10px 0;
  .box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  i {
    font-size: 36px;
    margin: 0 10px;
  }
}
</style>
