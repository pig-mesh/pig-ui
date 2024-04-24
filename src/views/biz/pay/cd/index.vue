<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">

      <div
          class="mx-auto mt-11 w-100 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-110 hover:shadow-lg">
        <div class="flex items-center justify-center">
          <svg t="1697991137004" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
               p-id="4195" width="32" height="32">
            <path
                d="M44.8 631.04c24.32 0 44.8 20.48 44.8 44.8v180.48c0 24.32 20.48 44.8 44.8 44.8h180.48c16.64 0 30.72 8.96 38.4 23.04 7.68 14.08 7.68 30.72 0 44.8s-23.04 23.04-38.4 23.04H89.6c-49.92 0-89.6-40.96-89.6-89.6V675.84c0-25.6 20.48-44.8 44.8-44.8zM89.6 495.36c0-17.92 10.24-33.28 23.04-33.28h765.44c7.68 0 15.36 6.4 19.2 16.64 3.84 10.24 3.84 23.04 0 33.28s-11.52 16.64-19.2 16.64H112.64c-12.8 0-23.04-15.36-23.04-33.28zM314.88 89.6h-179.2C110.08 89.6 89.6 110.08 89.6 135.68v180.48c0 24.32-20.48 44.8-44.8 44.8S0 340.48 0 314.88V89.6c0-49.92 40.96-89.6 89.6-89.6h225.28c16.64 0 30.72 8.96 38.4 23.04 7.68 14.08 7.68 30.72 0 44.8-6.4 14.08-21.76 21.76-38.4 21.76z m631.04 271.36c-24.32 0-44.8-20.48-44.8-44.8V135.68c0-24.32-20.48-44.8-44.8-44.8H675.84c-16.64 0-30.72-8.96-38.4-23.04-7.68-14.08-7.68-30.72 0-44.8s23.04-23.04 38.4-23.04h225.28c49.92 0 89.6 40.96 89.6 89.6v225.28c0 25.6-20.48 46.08-44.8 46.08zM764.16 879.36c-67.84 87.04-148.48 60.16-162.56 53.76-32-8.96-43.52-69.12-3.84-87.04 67.84-21.76 128 3.84 170.24 25.6-1.28 3.84-3.84 7.68-3.84 7.68z m70.4-25.6c30.72-53.76 40.96-106.24 40.96-106.24h-99.84v-37.12h119.04v-16.64h-119.04v-57.6h-53.76v57.6H614.4v16.64h107.52v38.4h-93.44v16.64h186.88c0 3.84 0 3.84-3.84 5.12 0 19.2-14.08 47.36-24.32 69.12-138.24-53.76-177.92-21.76-189.44-16.64-92.16 65.28-5.12 147.2 8.96 144.64 97.28 21.76 160-19.2 203.52-70.4 3.84 3.84 5.12 3.84 8.96 3.84 30.72 16.64 172.8 84.48 172.8 84.48v-81.92c-23.04-2.56-101.12-29.44-157.44-49.92z"
                fill="#0D90FC" p-id="4196"></path>
          </svg>
          <h1 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200 ml-4">支付宝扫一扫</h1>
        </div>


        <div class="flex justify-center items-center">
          <vue-qrcode class="h-48 w-full object-cover object-center" :value="url"
                      :options="state.options"/>
        </div>

        <div class="bg-white dark:bg-gray-900">
          <div class="container px-6 py-2 mx-auto">
            <!-- 聚合支付 -->
            <div class="mt-6 space-y-8 xl:mt-6" @click="state.type = '0'">
              <div
                  :class="{'border-primary': state.type === '0' ,'flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border  border-gray-300 cursor-pointer rounded-xl':true}">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       :class="{'text-primary': state.type === '0','w-5 h-5 sm:h-9 sm:w-9 text-gray-400':true}"
                       viewBox="0 0 20 20"
                       fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"/>
                  </svg>

                  <div class="flex flex-col items-center mx-5 space-y-1">
                    <h2 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">聚合支付</h2>
                    <div class="px-2 text-xs bg-gray-100 text-blue-400 rounded-full sm:px-4 sm:py-1 dark:bg-gray-700 ">
                      1% 手续费
                    </div>
                  </div>
                </div>

                <h2 :class="{'text-primary': state.type === '0', 'text-2xl font-semibold sm:text-4xl text-gray-400':true}">
                  {{ state.amount / 100 }}<span
                    class="text-base font-medium">/元</span>
                </h2>
              </div>
            </div>

            <!-- 普通模式 -->
            <div class="mt-6 space-y-8 xl:mt-2" @click="state.type = '1'">
              <div
                  :class="{'border-primary': state.type === '1' ,'flex items-center justify-between max-w-2xl px-8 py-4 mx-auto border  border-gray-300 cursor-pointer rounded-xl':true}">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       :class="{'text-primary': state.type === '1','w-5 h-5 sm:h-9 sm:w-9 text-gray-400':true}"
                       viewBox="0 0 20 20"
                       fill="currentColor">
                    <path fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"/>
                  </svg>

                  <div class="flex flex-col items-center mx-5 space-y-1">
                    <h2 class="text-lg font-medium text-gray-700 sm:text-2xl dark:text-gray-200">普通模式</h2>
                    <div class="px-2 text-xs bg-gray-100 text-blue-400 rounded-full sm:px-4 sm:py-1 dark:bg-gray-700 ">
                      零手续费
                    </div>
                  </div>
                </div>

                <h2 :class="{'text-primary': state.type === '1', 'text-2xl font-semibold sm:text-4xl text-gray-400':true}">
                  {{ state.amount / 100 }}<span
                    class="text-base font-medium">/元</span></h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

<script setup lang="ts" name="payCd">
import {useBuyApi} from '/@/api/pay/cd';
import {Session} from '/@/utils/storage';

// 导入二维码插件
const VueQrcode = defineAsyncComponent(() => import('@chenfengyuan/vue-qrcode'));

const protocol = window.location.protocol;
const host = window.location.host;

const url = ref('url');
const state = reactive({
  type: '0', // 支付方式
  amount: '1', // 支付金额
  options: {
    height: 300,
    width: 300,
  },
});

watch(state, () => {
  getQr();
});

onMounted(() => {
  getQr();
});

/**
 * 获取支付二维码信息。
 * @param {Object} state - 包含 type 和 amount 两个属性的对象。
 * @param {string} state.type - 支付类型。"0" 表示直接购买，其他值表示商品购买。
 * @param {number} state.amount - 支付金额。
 * @returns {Promise<string>} - 返回 Promise 实例，包含获取到的支付二维码链接地址。
 */
const getQr = async () => {
  const {type, amount} = state;
  try {
    if (type === '0') {
      const res = await useBuyApi(amount);
      url.value = res.params; // 直接返回购买 API 返回的二维码链接地址
    } else {
      const tenantId = Session.getTenant();
      url.value = `${protocol}//${host}${import.meta.env.VITE_API_URL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/pay'}/goods/buy?amount=${amount}&TENANT-ID=${tenantId}`
    }
  } catch (err) {
    throw new Error('获取支付信息失败');
  }
};
</script>

