<template>
	<div class="flex fixed top-0 right-0 z-10 items-center p-5 space-x-2">
		<!-- 语言切换 -->
		<el-dropdown v-if="isI18nEnabled" trigger="click" @command="onLanguageChange">
			<div
				class="flex justify-center items-center w-9 h-9 rounded-lg backdrop-blur-sm transition-colors cursor-pointer bg-white/80 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700"
			>
				<i
					class="text-lg text-gray-600 dark:text-slate-300 iconfont"
					:class="state.disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"
				></i>
			</div>
			<template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="zh-cn" :disabled="state.disabledI18n === 'zh-cn'">简体中文</el-dropdown-item>
					<el-dropdown-item command="en" :disabled="state.disabledI18n === 'en'">English</el-dropdown-item>
				</el-dropdown-menu>
			</template>
		</el-dropdown>

		<!-- 主题切换 -->
		<el-tooltip v-if="isDarkModeEnabled" :content="getThemeConfig.isDark ? t('control.toggleLightMode') : t('control.toggleDarkMode')" placement="bottom">
			<div
				class="flex justify-center items-center w-9 h-9 rounded-lg backdrop-blur-sm transition-colors cursor-pointer bg-white/80 dark:bg-slate-800/80 hover:bg-gray-100 dark:hover:bg-slate-700"
				@click="onThemeClick"
			>
				<el-icon :size="18" class="text-gray-600 dark:text-slate-300">
					<ele-Moon v-if="!getThemeConfig.isDark" />
					<ele-Sunny v-else />
				</el-icon>
			</div>
		</el-tooltip>
	</div>
</template>

<script setup lang="ts" name="loginControl">
import { useThemeConfig } from '/@/stores/themeConfig';
import { useI18n } from 'vue-i18n';
import { Local } from '/@/utils/storage';
import other from '/@/utils/other';
import { useDark } from '@vueuse/core';

// 定义变量内容
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { locale, t } = useI18n();

// 语言切换状态
const state = reactive({
	disabledI18n: Local.get('themeConfig')?.globalI18n || 'zh-cn',
});

// 环境变量控制功能开关
const isI18nEnabled = import.meta.env.VITE_I18N_ENABLE === 'true';
const isDarkModeEnabled = import.meta.env.VITE_DARK_MODE_ENABLE === 'true';

// 语言切换处理
const onLanguageChange = (lang: string) => {
	Local.remove('themeConfig');
	themeConfig.value.globalI18n = lang;
	Local.set('themeConfig', themeConfig.value);
	locale.value = lang;
	state.disabledI18n = lang;
	other.useTitle();
};

// 主题切换
const isDark = useDark();
const onThemeClick = () => {
	if (!isDarkModeEnabled) return; // 如果未启用暗黑模式，直接返回

	const body = document.documentElement as HTMLElement;
	themeConfig.value.isDark = !themeConfig.value.isDark;

	if (themeConfig.value.isDark) {
		body.setAttribute('data-theme', 'dark');
		body.classList.add('dark');
		isDark.value = true;
	} else {
		body.classList.remove('dark');
		body.setAttribute('data-theme', 'light');
		isDark.value = false;
	}

	// 保存主题配置
	Local.remove('themeConfig');
	Local.set('themeConfig', themeConfig.value);
};

// 初始化暗黑模式
const initDark = () => {
	isDark.value = themeConfig.value.isDark;
};

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return themeConfig.value;
});

// 在 script setup 中添加
const initLanguage = () => {
	if (!isI18nEnabled) return; // 如果未启用多语言，直接返回

	if (Local.get('themeConfig')) {
		state.disabledI18n = Local.get('themeConfig').globalI18n;
		// 确保 i18n locale 与存储的语言保持一致

		locale.value = state.disabledI18n;
	} else {
		// 如果没有存储的主题配置，设置默认语言
		state.disabledI18n = 'zh-cn';
		locale.value = 'zh-cn';
		// 保存默认配置
		themeConfig.value.globalI18n = 'zh-cn';
		Local.set('themeConfig', themeConfig.value);
	}
	// 更新页面标题
	other.useTitle();
};

// 修改 onMounted 钩子
onMounted(() => {
	initLanguage();
	initDark();
});
</script>

<style lang="scss" scoped>
/* 语言图标样式 */
.iconfont {
	font-size: 1.125rem;
}
</style>
