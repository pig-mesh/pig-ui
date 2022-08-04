<template>
  <basic-container>
    <div style="text-align: center">
      <el-row>
        <el-col :span="24"><h2>聚合支付</h2></el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <qrcode :value="msg" :options="options" />
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24"><h4>请使用微信或支付宝手机客户端扫一扫</h4></el-col>
      </el-row>
      <el-row> 请勿大额支付，无法退还请知悉 2</el-row>
      <el-row>
        <el-radio v-model="amount" label="1">0.01 元</el-radio>
        <el-radio v-model="amount" label="10">0.1 元</el-radio>
        <el-radio v-model="amount" label="100">1 元</el-radio>
      </el-row>
      <el-row>
        <el-radio v-model="type" label="0">聚合支付</el-radio>
        <el-radio v-model="type" label="1">普通模式</el-radio>
      </el-row>
    </div>
  </basic-container>
</template>

<style>
</style>

<script>
import VueQrcode from "@chenfengyuan/vue-qrcode";
import request from "@/router/axios";
import { getStore } from "@/util/store";

const protocol = window.location.protocol;
const host = window.location.host;

export default {
  components: {
    qrcode: VueQrcode,
  },
  data() {
    return {
      type: "1",
      amount: "1",
      msg: "NULL",
      options: {
        height: 300,
        width: 300,
      },
    };
  },
  watch: {
    amount: function (amount) {
      this.getQr();
    },
    type: function (type) {
      this.getQr();
    },
  },
  created() {
    this.getQr();
  },
  methods: {
    getQr() {
      // 聚合支付模式 调用后端生成支付链接
      if (this.type === "0") {
        request({
          url: "/pay/goods/merge/buy",
          method: "get",
          params: { amount: this.amount },
        }).then((res) => {
          this.msg = res.data.params;
        });
      } else {
        const TENANT_ID = getStore({ name: "tenantId" });
        this.msg = `${protocol}//${host}/pay/goods/buy?amount=${this.amount}&TENANT-ID=${TENANT_ID}`;
      }
    },
  },
};
</script>
