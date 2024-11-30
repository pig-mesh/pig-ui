<template>
	<div class="fixed bottom-0 right-0 z-10 flex flex-col items-center mb-16 w-[160px]">
		<div class="group">
			<div class="relative transition-transform duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
				<img
					class="w-24 h-24 rounded-lg ring-gray-200 dark:ring-slate-700 dark:bg-slate-800"
					:src="!themeConfig.miniQr ? miniQr : baseURL + themeConfig.miniQr"
					:alt="t('scan.wechatApp')"
				/>
			</div>
			<!-- 底部文字 -->
			<div class="mt-2">
				<p class="text-xs text-gray-400 dark:text-slate-500">{{ t('scan.wechatApp') }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" name="loginQrcode">
import { useThemeConfig } from '/@/stores/themeConfig';
import { useI18n } from 'vue-i18n';
import miniQr from '/@/assets/login/mini_qr.png';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { t } = useI18n();
</script>
