<script setup lang="ts" name="payCd">
import { useBuyApi } from '/@/api/pay/cd';
import { Session } from '/@/utils/storage';

const VueQrcode = defineAsyncComponent(() => import('@chenfengyuan/vue-qrcode'));

const protocol = window.location.protocol;
const host = window.location.host;

const url = ref('url');
const state = reactive({
	type: '0',
	amount: 1,
});

const qrCodeOptions = {
	width: 280,
	height: 280,
	margin: 2,
	scale: 1,
};

const paymentModes = [
	{
		type: '0',
		title: '聚合支付',
		fee: '1% 手续费',
		description: '推荐使用，支付体验更顺畅',
	},
	{
		type: '1',
		title: '普通模式',
		fee: '零手续费',
		description: '适合常规收款场景',
	},
];

const formattedAmount = computed(() => (state.amount / 100).toFixed(2));

const selectMode = (type: string) => {
	state.type = type;
};

watch(
	() => [state.type, state.amount],
	() => {
		getQr();
	},
	{ immediate: true }
);

/**
 * 获取支付二维码信息。
 */
async function getQr() {
	const { type, amount } = state;
	try {
		if (type === '0') {
			const res = await useBuyApi(amount);
			url.value = res.params;
			return;
		}

		const tenantId = Session.getTenant();
		url.value = `${protocol}//${host}${baseURL}${import.meta.env.VITE_IS_MICRO == 'false' ? '/admin' : '/pay'
			}/goods/buy?amount=${amount}&TENANT-ID=${tenantId}`;
	} catch (err) {
		throw new Error('获取支付信息失败');
	}
}
</script>

<template>
	<div class="layout-padding pay-page">
		<div class="layout-padding-auto layout-padding-view h-full">
			<div class="pay-scroll flex h-full justify-center overflow-y-auto px-4 py-8 sm:px-6 sm:py-10">
				<section
					class="pay-panel my-auto w-full max-w-[480px] overflow-hidden rounded-lg bg-white shadow-[0_24px_80px_-32px_rgba(15,23,42,0.28)] dark:bg-slate-900">
					<header class="px-6 py-6 sm:px-8">
						<div class="flex items-center justify-center gap-3 text-center">
							<div
								class="flex items-center justify-center rounded-lg h-11 w-11 bg-blue-50 text-primary ring-1 ring-inset ring-blue-100 dark:bg-slate-800 dark:text-blue-400 dark:ring-slate-700">
								<svg t="1697991137004" viewBox="0 0 1024 1024" version="1.1"
									xmlns="http://www.w3.org/2000/svg" p-id="4195" width="26" height="26"
									aria-hidden="true">
									<path
										d="M44.8 631.04c24.32 0 44.8 20.48 44.8 44.8v180.48c0 24.32 20.48 44.8 44.8 44.8h180.48c16.64 0 30.72 8.96 38.4 23.04 7.68 14.08 7.68 30.72 0 44.8s-23.04 23.04-38.4 23.04H89.6c-49.92 0-89.6-40.96-89.6-89.6V675.84c0-25.6 20.48-44.8 44.8-44.8zM89.6 495.36c0-17.92 10.24-33.28 23.04-33.28h765.44c7.68 0 15.36 6.4 19.2 16.64 3.84 10.24 3.84 23.04 0 33.28s-11.52 16.64-19.2 16.64H112.64c-12.8 0-23.04-15.36-23.04-33.28zM314.88 89.6h-179.2C110.08 89.6 89.6 110.08 89.6 135.68v180.48c0 24.32-20.48 44.8-44.8 44.8S0 340.48 0 314.88V89.6c0-49.92 40.96-89.6 89.6-89.6h225.28c16.64 0 30.72 8.96 38.4 23.04 7.68 14.08 7.68 30.72 0 44.8-6.4 14.08-21.76 21.76-38.4 21.76z m631.04 271.36c-24.32 0-44.8-20.48-44.8-44.8V135.68c0-24.32-20.48-44.8-44.8-44.8H675.84c-16.64 0-30.72-8.96-38.4-23.04-7.68-14.08-7.68-30.72 0-44.8s23.04-23.04 38.4-23.04h225.28c49.92 0 89.6 40.96 89.6 89.6v225.28c0 25.6-20.48 46.08-44.8 46.08zM764.16 879.36c-67.84 87.04-148.48 60.16-162.56 53.76-32-8.96-43.52-69.12-3.84-87.04 67.84-21.76 128 3.84 170.24 25.6-1.28 3.84-3.84 7.68-3.84 7.68z m70.4-25.6c30.72-53.76 40.96-106.24 40.96-106.24h-99.84v-37.12h119.04v-16.64h-119.04v-57.6h-53.76v57.6H614.4v16.64h107.52v38.4h-93.44v16.64h186.88c0 3.84 0 3.84-3.84 5.12 0 19.2-14.08 47.36-24.32 69.12-138.24-53.76-177.92-21.76-189.44-16.64-92.16 65.28-5.12 147.2 8.96 144.64 97.28 21.76 160-19.2 203.52-70.4 3.84 3.84 5.12 3.84 8.96 3.84 30.72 16.64 172.8 84.48 172.8 84.48v-81.92c-23.04-2.56-101.12-29.44-157.44-49.92z"
										fill="currentColor" p-id="4196"></path>
								</svg>
							</div>
							<div>
								<p class="text-sm font-medium text-blue-600 dark:text-blue-400">扫码支付</p>
								<h1 class="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">支付宝扫一扫</h1>
							</div>
						</div>
						<p class="mt-4 text-sm text-center text-slate-500 dark:text-slate-400">
							请使用支付宝扫描下方二维码完成付款
						</p>
						<div class="flex items-center justify-center gap-2 mt-5">
							<span
								class="px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
								当前应付
							</span>
							<span class="text-3xl font-semibold text-slate-900 dark:text-slate-50">{{ formattedAmount
							}}</span>
							<span class="pt-2 text-sm font-medium text-slate-500 dark:text-slate-400">元</span>
						</div>
					</header>

					<div class="px-6 py-8 sm:px-8">
						<div
							class="mx-auto flex w-full max-w-[320px] items-center justify-center rounded-lg bg-slate-50 p-5 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.35)] dark:bg-slate-950/80">
							<div
								class="rounded-md bg-white p-3 shadow-[0_8px_30px_-20px_rgba(15,23,42,0.3)] dark:bg-slate-900">
								<vue-qrcode
									class="qr-image h-full w-full max-w-[280px] rounded-md object-cover object-center"
									:value="url" :options="qrCodeOptions" />
							</div>
						</div>
					</div>

					<div
						class="bg-slate-50/70 px-4 py-4 dark:bg-slate-950/40 sm:px-5">
						<div class="space-y-3">
							<button v-for="mode in paymentModes" :key="mode.type" type="button"
								@click="selectMode(mode.type)" :class="[
									'payment-mode w-full rounded-lg px-4 py-4 text-left transition-all duration-200 sm:px-5',
									state.type === mode.type
										? 'bg-white ring-1 ring-inset ring-primary/70 shadow-[0_14px_34px_-24px_rgba(37,99,235,0.55)] dark:bg-slate-900'
										: 'bg-white/80 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.25)] hover:bg-white dark:bg-slate-900/70',
								]">
								<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
									<div class="flex items-center min-w-0 gap-4">
										<div :class="[
											'flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors',
											state.type === mode.type
												? 'bg-primary text-white ring-primary/20'
												: 'bg-slate-100 text-slate-400 ring-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:ring-slate-700',
										]">
											<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20"
												fill="currentColor" aria-hidden="true">
												<path fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
													clip-rule="evenodd" />
											</svg>
										</div>
										<div class="min-w-0">
											<div class="flex flex-wrap items-center gap-2">
												<h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{
													mode.title }}</h2>
												<span :class="[
													'inline-flex rounded-md px-2 py-1 text-xs font-medium',
													state.type === mode.type
														? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300'
														: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
												]">
													{{ mode.fee }}
												</span>
											</div>
											<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{{
												mode.description }}</p>
										</div>
									</div>
									<div class="text-left shrink-0 sm:text-right">
										<div :class="[
											'text-3xl font-semibold tracking-tight',
											state.type === mode.type ? 'text-primary' : 'text-slate-400 dark:text-slate-300',
										]">
											{{ formattedAmount }}
										</div>
										<div class="mt-1 text-sm font-medium text-slate-400 dark:text-slate-500">元</div>
									</div>
								</div>
							</button>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<style scoped>
.pay-page,
.pay-page :deep(.layout-padding-view) {
	height: calc(100vh - 84px);
}

.pay-scroll {
	overscroll-behavior: contain;
}

.qr-image {
	transition: transform 0.2s ease, filter 0.2s ease;
}

:deep(.dark .qr-image) {
	filter: invert(0.88) hue-rotate(180deg) brightness(1.18) saturate(1.05);
}
</style>
