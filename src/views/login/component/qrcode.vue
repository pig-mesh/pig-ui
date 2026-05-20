<template>
	<div class="fixed z-20 hidden select-none right-8 bottom-24 2xl:right-14 xl:block">
		<div
			class="relative flex h-[116px] w-[116px] items-center justify-center rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.92)] dark:border-blue-300/25">
			<img class="object-contain w-24 h-24 rounded-md" :src="qrCodeSrc" :alt="t('scan.wechatApp')" />
			<div
				class="absolute left-1/2 top-1/2 flex h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[9px] border border-blue-600/20 bg-white shadow-[0_6px_14px_rgba(37,99,235,0.16)]">
				<img class="object-contain w-4 h-4" :src="logo" alt="PIGX" />
			</div>
		</div>
		<div class="mt-2 text-xs font-medium leading-5 text-center text-slate-500 dark:text-slate-300">
			{{ t('scan.wechatApp') }}
		</div>
	</div>
</template>

<script setup lang="ts" name="loginQrcode">
import { useThemeConfig } from '/@/stores/themeConfig';
import { useI18n } from 'vue-i18n';
import miniQr from '/@/assets/login/mini_qr.png';
import logo from '/@/assets/login/logo.svg';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
const qrCodeSrc = computed(() => (themeConfig.value.miniQr ? baseURL + themeConfig.value.miniQr : miniQr));
</script>
