<template>
  <div class="layout-padding">
    <div class="center-container">
      <el-row>
        <el-col :span="24">
          <h2>聚合支付</h2>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <div class="qrcode-container">
            <vue-qrcode :value="url" :options="state.options"/>
          </div>
        </el-col>
      </el-row>
      <el-row class="mt-4">
        <el-col :span="24">
          <h4>支付宝手机客户端扫一扫</h4>
          <h5>请勿大额支付，无法退还请知悉</h5>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-radio v-model="state.amount" label="1">0.01 元</el-radio>
          <el-radio v-model="state.amount" label="10">0.1 元</el-radio>
          <el-radio v-model="state.amount" label="100">1 元</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-radio v-model="state.type" label="0">聚合支付</el-radio>
          <el-radio v-model="state.type" label="1">普通模式</el-radio>
        </el-col>
      </el-row>
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
  type: '0',
  amount: '1',
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
      url.value = `${protocol}//${host}/admin/goods/buy?amount=${amount}&TENANT-ID=${tenantId}`; // 返回商品购买的二维码链接地址
    }
  } catch (err) {
    throw new Error('获取支付信息失败');
  }
};
</script>

<style scoped>
.center-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qrcode-container {
  display: flex;
  justify-content: center;
  margin-top: 20px; /* adjust margin as needed */
}
</style>
