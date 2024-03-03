<template>
  <div class="relative flex justify-center w-full gap-5">
    <div
        @click="handleClick('WEIXIN_CP')"
        class="flex items-center justify-center w-full p-3 mb-6 text-sm font-medium tracking-wide text-gray-500 transition duration-500 ease-in border border-gray-300 rounded-lg cursor-pointer md:mb-0 hover:bg-blue-100"
    >
      <svg
          t="1697170502708"
          class="w-4 mr-2"
          viewBox="0 0 1229 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1529"
          xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
            d="M702.72 849.92c-76.8 30.72-158.72 35.84-240.64 30.72-35.84-5.12-71.68-10.24-107.52-20.48-5.12 0-10.24 0-15.36 5.12-46.08 20.48-92.16 46.08-133.12 66.56-15.36 10.24-30.72 10.24-46.08 0s-15.36-25.6-15.36-46.08c10.24-35.84 10.24-71.68 15.36-107.52 0-5.12-5.12-10.24-5.12-15.36-51.2-51.2-92.16-102.4-122.88-168.96-51.2-122.88-40.96-245.76 30.72-358.4C134.4 112.64 247.04 46.08 380.16 15.36S641.28 0 764.16 61.44c112.64 56.32 194.56 143.36 230.4 266.24 15.36 46.08 20.48 92.16 15.36 138.24-25.6-25.6-56.32-30.72-87.04-15.36 0-30.72 0-61.44-10.24-92.16-20.48-71.68-61.44-128-112.64-174.08-87.04-71.68-194.56-102.4-307.2-102.4-117.76 10.24-220.16 51.2-302.08 133.12-66.56 66.56-102.4 148.48-97.28 245.76 5.12 81.92 40.96 148.48 92.16 204.8l40.96 40.96c20.48 15.36 25.6 30.72 15.36 51.2-5.12 20.48-10.24 46.08-15.36 66.56 0 5.12-5.12 10.24 0 10.24 5.12 5.12 10.24 0 10.24 0 25.6-15.36 56.32-30.72 81.92-51.2 15.36-10.24 30.72-10.24 51.2-5.12 87.04 25.6 179.2 25.6 266.24 0 5.12 0 10.24-5.12 10.24 5.12 10.24 30.72 25.6 51.2 56.32 66.56z"
            fill="#0082EF"
            p-id="1530"
        ></path>
        <path
            d="M1214.72 747.52c0 35.84-25.6 61.44-56.32 66.56-51.2 10.24-92.16 30.72-128 66.56-10.24 10.24-15.36 10.24-25.6 5.12-5.12-5.12-5.12-15.36 0-25.6 35.84-35.84 56.32-81.92 66.56-128 5.12-35.84 40.96-56.32 76.8-56.32 40.96 5.12 66.56 35.84 66.56 71.68z"
            fill="#0081EE"
            p-id="1531"
        ></path>
        <path
            d="M953.6 1024c-35.84 0-66.56-25.6-71.68-56.32-5.12-51.2-30.72-92.16-66.56-122.88-5.12-5.12-10.24-10.24-5.12-20.48 5.12-15.36 15.36-15.36 25.6-10.24 10.24 5.12 15.36 15.36 20.48 20.48 30.72 25.6 66.56 40.96 102.4 46.08 35.84 5.12 61.44 40.96 56.32 76.8 5.12 35.84-25.6 66.56-61.44 66.56z"
            fill="#FA6202"
            p-id="1532"
        ></path>
        <path
            d="M682.24 757.76c0-35.84 20.48-61.44 56.32-71.68 51.2-10.24 92.16-30.72 128-66.56 10.24-10.24 20.48-10.24 25.6 0 5.12 5.12 5.12 15.36-5.12 25.6-30.72 30.72-51.2 66.56-61.44 112.64 0 5.12 0 15.36-5.12 20.48-10.24 35.84-40.96 56.32-76.8 51.2-35.84-5.12-61.44-35.84-61.44-71.68z"
            fill="#FECD00"
            p-id="1533"
        ></path>
        <path
            d="M1035.52 578.56c15.36 30.72 30.72 56.32 51.2 76.8 10.24 10.24 10.24 20.48 5.12 25.6-5.12 10.24-15.36 10.24-25.6 0-25.6-30.72-61.44-51.2-97.28-61.44-10.24-5.12-20.48-5.12-30.72-5.12-20.48-5.12-40.96-15.36-46.08-40.96-10.24-25.6-10.24-51.2 10.24-71.68 20.48-25.6 46.08-30.72 71.68-25.6 25.6 10.24 46.08 25.6 51.2 56.32 0 15.36 5.12 30.72 10.24 46.08z"
            fill="#2CBD00"
            p-id="1534"
        ></path>
      </svg>
      <!-- <svg class="w-4" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05 0 5.71-3.83 9.77-9.6 9.77-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51v-.01Z"></path></svg> -->
      <span>企微</span>
    </div>
    <div
        @click="handleClick('DINGTALK')"
        class="flex items-center justify-center w-full p-3 mb-6 text-sm font-medium tracking-wide text-gray-500 transition duration-500 ease-in border border-gray-300 rounded-lg cursor-pointer md:mb-0 hover:bg-blue-100"
    >
      <svg
          t="1697170502708"
          class="w-4 mr-2"
          viewBox="0 0 1229 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="1529"
          xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
            d="M512.003 79C272.855 79 79 272.855 79 512.003 79 751.145 272.855 945 512.003 945 751.145 945 945 751.145 945 512.003 945 272.855 751.145 79 512.003 79z m200.075 375.014c-0.867 3.764-3.117 9.347-6.234 16.012h0.087l-0.347 0.648c-18.183 38.86-65.631 115.108-65.631 115.108l-0.215-0.52-13.856 24.147h66.8L565.063 779l29.002-115.368h-52.598l18.27-76.29c-14.76 3.55-32.253 8.436-52.945 15.1 0 0-27.967 16.36-80.607-31.5 0 0-35.501-31.29-14.891-39.078 8.744-3.33 42.466-7.573 69.004-11.122 35.93-4.845 57.965-7.441 57.965-7.441s-110.607 1.643-136.841-2.468c-26.237-4.11-59.525-47.905-66.626-86.377 0 0-10.953-21.117 23.595-11.122 34.547 10 177.535 38.95 177.535 38.95s-185.933-56.992-198.36-70.929c-12.381-13.846-36.406-75.902-33.289-113.981 0 0 1.343-9.521 11.127-6.926 0 0 137.49 62.75 231.475 97.152 94.028 34.403 175.76 51.885 165.2 96.414z"
            fill="#3AA2EB"
            p-id="2497"
        ></path>
      </svg>
      <!-- <svg class="w-4" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 13.9v-3.72h9.36c.14.63.25 1.22.25 2.05 0 5.71-3.83 9.77-9.6 9.77-5.52 0-10-4.48-10-10S6.48 2 12 2c2.7 0 4.96.99 6.69 2.61l-2.84 2.76c-.72-.68-1.98-1.48-3.85-1.48-3.31 0-6.01 2.75-6.01 6.12s2.7 6.12 6.01 6.12c3.83 0 5.24-2.65 5.5-4.22h-5.51v-.01Z"></path></svg> -->
      <span>钉钉</span>
    </div>
  </div>
</template>

<script setup lang="ts" name="loginSocial">
import Cookies from 'js-cookie';
import other from '/@/utils/other';
import {getLoginAppList} from "/@/api/admin/social";
import {useMessage} from "/@/hooks/message";
import {useI18n} from "vue-i18n";
import {validateNull} from "/@/utils/validate";

// 使用i18n
const {t} = useI18n();

/**
 * 执行跳转事件的函数。
 * @event signInSuccess
 */
const emit = defineEmits(['signInSuccess']);

/**
 * 存储弹出窗口实例的 Ref 对象。
 */
const winOpen = ref();

/**
 * 计时器对象，用于检查弹出窗口是否关闭。
 */
const timer = ref();

/**
 * 点击按钮触发事件的回调函数，用于打开第三方登录授权页面。
 * @param thirdpart - 第三方平台名称。
 */
const handleClick = async (thirdpart: string) => {
  // 获取租户配置的账号信息
  const {data} = await getLoginAppList()
  const result = data.find((item: any) => item.type === thirdpart);
  if (validateNull(result)) {
    useMessage().error(t('scan.appErrorTip'));
    return;
  }

  // 拼接授权回调地址
  let url: string = '';
  const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');

  // 企业微信登录
  if (thirdpart === 'WEIXIN_CP') {
    url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${result.appId}&agentid=${result.ext}&redirect_uri=${redirect_uri}&state=CP-LOGIN`;
  }

  // 钉钉登录
  if (thirdpart === 'DINGTALK') {
    url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${result.appId}&scope=openid&state=DINGTALK-LOGIN&prompt=consent`;
  }

  // 打开授权窗口并存储实例
  winOpen.value = other.openWindow(url, thirdpart, 540, 540);
};

/**
 * 页面加载后执行的函数，用于检查窗口是否关闭。
 */
onMounted(() => {
  // 动态获取所属租户的企业微信应用信息和钉钉应用信息

  timer.value = window.setInterval(() => {
    // 检查弹出窗口是否已关闭
    if (winOpen.value && winOpen.value.closed == true) {
      // 停止计时器
      window.clearInterval(timer.value);
      if (Cookies.get('token')) {
        emit('signInSuccess');
      }
    }
  }, 500);
});
</script>
