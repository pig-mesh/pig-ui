<template>
	<div class="layout-padding">
		<div style="text-align: center">
			<el-row>
				<el-col :span="24">
					<h2>聚合支付</h2>
				</el-col>
			</el-row>

			<el-row>
				<el-col :span="24">
					<vue-qrcode :value="url" :options="state.options" />
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="24">
					<h4>请使用微信或支付宝手机客户端扫一扫</h4>
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
import { useBuyApi } from '/@/api/pay/cd';
import { Local } from '/@/utils/storage';
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

const getQr = () => {
	if (state.type === '0') {
		useBuyApi(state.amount).then((res) => {
			url.value = res.params;
		});
	} else {
		const tenantId = Session.getTenant();
		url.value = `${protocol}//${host}/admin/goods/buy?amount=${state.amount}&TENANT-ID=${tenantId}`;
	}
};
</script>
