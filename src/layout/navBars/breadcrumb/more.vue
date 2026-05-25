<template>
	<el-dropdown :show-timeout="70" :hide-timeout="50" trigger="click" @command="onMoreCommand">
		<div class="px-2 md:px-[6px] lg:px-2 cursor-pointer text-[var(--next-bg-topBarColor)] h-[50px] leading-[50px] flex items-center transition-colors duration-300 hover:bg-[var(--next-color-user-hover)]">
			<el-icon :title="$t('user.more')" :size="18">
				<ele-MoreFilled />
			</el-icon>
		</div>
		<template #dropdown>
			<el-dropdown-menu>
				<el-dropdown-item v-if="siteConfig.darkModeEnable" command="theme">
					<el-icon class="mr5"><i class="icon-skin iconfont"></i></el-icon>
					{{ $t('user.theme') }}
				</el-dropdown-item>
				<el-dropdown-item v-if="siteConfig.i18nEnable" :divided="siteConfig.darkModeEnable" command="language">
					<el-icon class="mr5">
						<i class="iconfont" :class="state.disabledI18n === 'en' ? 'icon-fuhao-yingwen' : 'icon-fuhao-zhongwen'"></i>
					</el-icon>
					{{ state.disabledI18n === 'zh-cn' ? '简体中文' : 'English' }}
				</el-dropdown-item>
				<el-dropdown-item :divided="true" command="fullscreen">
					<el-icon class="mr5">
						<i class="iconfont" :class="!isFullscreen ? 'icon-fullscreen' : 'icon-tuichuquanping'"></i>
					</el-icon>
					{{ isFullscreen ? $t('user.exitFullscreen') : $t('user.fullscreen') }}
				</el-dropdown-item>
				<el-dropdown-item command="lock">
					<el-icon class="mr5"><ele-Lock /></el-icon>
					{{ $t('user.lockScreen') }}
				</el-dropdown-item>
			</el-dropdown-menu>
		</template>
	</el-dropdown>
</template>

<script setup lang="ts" name="layoutBreadcrumbMore">
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useSiteConfig } from '/@/stores/siteConfig';
import other from '/@/utils/other';
import mittBus from '/@/utils/mitt';
import { Local } from '/@/utils/storage';
import { useFullscreen } from '@vueuse/core';

const { locale } = useI18n();
const { themeConfig } = storeToRefs(useThemeConfig());
const { siteConfig } = storeToRefs(useSiteConfig());
const { isFullscreen, isSupported: isFullscreenSupported, toggle: toggleFullscreen } = useFullscreen();

interface State {
	disabledI18n: string;
}

const state = reactive<State>({
	disabledI18n: 'zh-cn',
});

// 更多菜单命令处理
const onMoreCommand = (command: string) => {
	switch (command) {
		case 'theme':
			onLayoutSetingClick();
			break;
		case 'language':
			onLanguageToggle();
			break;
		case 'fullscreen':
			onScreenfullClick();
			break;
		case 'lock':
			onLockClick();
			break;
	}
};

// 主题设置点击
const onLayoutSetingClick = () => {
	mittBus.emit('openSettingsDrawer');
};

// 语言切换（直接切换中英文）
const onLanguageToggle = () => {
	const newLang = state.disabledI18n === 'zh-cn' ? 'en' : 'zh-cn';
	Local.remove('themeConfig');
	themeConfig.value.globalI18n = newLang;
	Local.set('themeConfig', themeConfig.value);
	locale.value = newLang;
	other.useTitle();
	state.disabledI18n = newLang;
};

// 全屏切换
const onScreenfullClick = () => {
	if (!isFullscreenSupported.value) {
		ElMessage.warning('暂不支持全屏');
		return;
	}
	toggleFullscreen();
};

// 锁屏
const onLockClick = () => {
	themeConfig.value.isLockScreen = true;
	themeConfig.value.lockScreenTime = 0;
	Local.set('themeConfig', themeConfig.value);
};

// 初始化 i18n
const initI18n = () => {
	const config = Local.get('themeConfig');
	if (config) {
		state.disabledI18n = config['globalI18n'];
	}
};

onMounted(() => {
	initI18n();
});
</script>

<style scoped lang="scss">
// Element Plus 组件深层样式定制
:deep(.el-dropdown) {
	color: var(--next-bg-topBarColor);
}

// 图标 hover 动画
.hover\:bg-\[var\(--next-color-user-hover\)\]:hover i {
	display: inline-block;
	animation: logoAnimation 0.3s ease-in-out;
}

.mr5 {
	margin-right: 5px;
}
</style>
