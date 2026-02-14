<template>
	<div class="layout-breadcrumb-seting">
		<el-drawer
			:title="$t('layout.configTitle')"
			v-model="getThemeConfig.isDrawer"
			direction="rtl"
			destroy-on-close
			size="260px"
			@close="onDrawerClose"
		>
			<el-scrollbar class="layout-breadcrumb-seting-bar">
				<!-- 布局切换 -->
				<el-divider content-position="left">{{ $t('layout.sixTitle') }}</el-divider>
				<div class="layout-drawer-content-flex">
					<!-- defaults 布局 -->
					<div class="layout-drawer-content-item" @click="onSetLayout('defaults')">
						<section class="el-container el-circular" :class="{ 'drawer-layout-active': getThemeConfig.layout === 'defaults' }">
							<aside class="el-aside" style="width: 20px"></aside>
							<section class="el-container is-vertical">
								<header class="el-header" style="height: 10px"></header>
								<main class="el-main"></main>
							</section>
						</section>
						<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'defaults' }">
							<div class="layout-tips-box">
								<p class="layout-tips-txt">{{ $t('layout.sixDefaults') }}</p>
							</div>
						</div>
					</div>
					<!-- classic 布局 -->
					<div class="layout-drawer-content-item" @click="onSetLayout('classic')">
						<section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': getThemeConfig.layout === 'classic' }">
							<header class="el-header" style="height: 10px"></header>
							<section class="el-container">
								<aside class="el-aside" style="width: 20px"></aside>
								<section class="el-container is-vertical">
									<main class="el-main"></main>
								</section>
							</section>
						</section>
						<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'classic' }">
							<div class="layout-tips-box">
								<p class="layout-tips-txt">{{ $t('layout.sixClassic') }}</p>
							</div>
						</div>
					</div>
					<!-- transverse 布局 -->
					<div class="layout-drawer-content-item" @click="onSetLayout('transverse')">
						<section class="el-container is-vertical el-circular" :class="{ 'drawer-layout-active': getThemeConfig.layout === 'transverse' }">
							<header class="el-header" style="height: 10px"></header>
							<section class="el-container">
								<section class="el-container is-vertical">
									<main class="el-main"></main>
								</section>
							</section>
						</section>
						<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'transverse' }">
							<div class="layout-tips-box">
								<p class="layout-tips-txt">{{ $t('layout.sixTransverse') }}</p>
							</div>
						</div>
					</div>
					<!-- columns 布局 -->
					<div class="layout-drawer-content-item" @click="onSetLayout('columns')">
						<section class="el-container el-circular" :class="{ 'drawer-layout-active': getThemeConfig.layout === 'columns' }">
							<aside class="el-aside-dark" style="width: 10px"></aside>
							<aside class="el-aside" style="width: 20px"></aside>
							<section class="el-container is-vertical">
								<header class="el-header" style="height: 10px"></header>
								<main class="el-main"></main>
							</section>
						</section>
						<div class="layout-tips-warp" :class="{ 'layout-tips-warp-active': getThemeConfig.layout === 'columns' }">
							<div class="layout-tips-box">
								<p class="layout-tips-txt">{{ $t('layout.sixColumns') }}</p>
							</div>
						</div>
					</div>
				</div>
				<!-- 全局主题 -->
				<el-divider content-position="left">{{ $t('layout.oneTitle') }}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex">
					<div class="layout-breadcrumb-seting-bar-flex-label">primary</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker v-model="getThemeConfig.primary" @change="onColorPickerChange" :disabled="getThemeConfig.isDark"> </el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsDark') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isDark" size="small" @change="onAddDarkChange"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('user.title0') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-select v-model="getThemeConfig.globalComponentSize" placeholder="请选择" style="width: 90px" @change="onComponentSizeChange">
							<el-option :label="$t('user.dropdownLarge')" value="large"></el-option>
							<el-option :label="$t('user.dropdownDefault')" value="default"></el-option>
							<el-option :label="$t('user.dropdownSmall')" value="small"></el-option>
						</el-select>
					</div>
				</div>

				<!-- 顶栏设置 -->
				<el-divider content-position="left">{{ $t('layout.twoTopTitle') }}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoTopBar') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker v-model="getThemeConfig.topBar" @change="onBgColorPickerChange('topBar')" :disabled="getThemeConfig.isDark">
						</el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoTopBarColor') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker v-model="getThemeConfig.topBarColor" @change="onBgColorPickerChange('topBarColor')" :disabled="getThemeConfig.isDark">
						</el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt10">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoIsTopBarColorGradual') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isTopBarColorGradual" size="small" @change="onTopBarGradualChange"></el-switch>
					</div>
				</div>

				<!-- 菜单设置 -->
				<el-divider content-position="left">{{ $t('layout.twoMenuTitle') }}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoMenuBar') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker v-model="getThemeConfig.menuBar" @change="onBgColorPickerChange('menuBar')" :disabled="getThemeConfig.isDark">
						</el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoMenuBarColor') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker v-model="getThemeConfig.menuBarColor" @change="onBgColorPickerChange('menuBarColor')" :disabled="getThemeConfig.isDark">
						</el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoMenuBarActiveColor') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker
							v-model="getThemeConfig.menuBarActiveColor"
							show-alpha
							@change="onBgColorPickerChange('menuBarActiveColor')"
							:disabled="getThemeConfig.isDark"
						/>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt14">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoIsMenuBarColorGradual') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isMenuBarColorGradual" size="small" @change="onMenuBarGradualChange"></el-switch>
					</div>
				</div>

				<!-- 分栏设置 -->
				<el-divider content-position="left" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">{{
					$t('layout.twoColumnsTitle')
				}}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoColumnsMenuBar') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker
							v-model="getThemeConfig.columnsMenuBar"
							@change="onBgColorPickerChange('columnsMenuBar')"
							:disabled="getThemeConfig.isDark || getThemeConfig.layout !== 'columns'"
						>
						</el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoColumnsMenuBarColor') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-color-picker
							v-model="getThemeConfig.columnsMenuBarColor"
							@change="onBgColorPickerChange('columnsMenuBarColor')"
							:disabled="getThemeConfig.isDark || getThemeConfig.layout !== 'columns'"
						>
						</el-color-picker>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt14" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoIsColumnsMenuBarColorGradual') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isColumnsMenuBarColorGradual"
							size="small"
							@change="onColumnsMenuBarGradualChange"
							:disabled="getThemeConfig.isDark || getThemeConfig.layout !== 'columns'"
						></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt14" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.twoIsColumnsMenuHoverPreload') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isColumnsMenuHoverPreload"
							size="small"
							@change="onColumnsMenuHoverPreloadChange"
							:disabled="getThemeConfig.isDark || getThemeConfig.layout !== 'columns'"
						></el-switch>
					</div>
				</div>

				<!-- 界面设置 -->
				<el-divider content-position="left">{{ $t('layout.threeTitle') }}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex" :style="{ opacity: getThemeConfig.layout === 'transverse' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.threeIsCollapse') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isCollapse"
							:disabled="getThemeConfig.layout === 'transverse'"
							size="small"
							@change="onThemeConfigChange"
						></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15" :style="{ opacity: getThemeConfig.layout === 'transverse' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.threeIsUniqueOpened') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isUniqueOpened"
							:disabled="getThemeConfig.layout === 'transverse'"
							size="small"
							@change="setLocalThemeConfig"
						></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.threeIsFixedHeader') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isFixedHeader" size="small" @change="onIsFixedHeaderChange"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15" :style="{ opacity: getThemeConfig.layout !== 'classic' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.threeIsClassicSplitMenu') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isClassicSplitMenu"
							:disabled="getThemeConfig.layout !== 'classic'"
							size="small"
							@change="onClassicSplitMenuChange"
						>
						</el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.threeIsLockScreen') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isLockScreen" size="small" @change="setLocalThemeConfig"></el-switch>
					</div>
				</div>
				<!--				<div class="layout-breadcrumb-seting-bar-flex mt11">-->
				<!--					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.threeLockScreenTime') }}</div>-->
				<!--					<div class="layout-breadcrumb-seting-bar-flex-value">-->
				<!--						<el-input-number-->
				<!--							v-model="getThemeConfig.lockScreenTime"-->
				<!--							controls-position="right"-->
				<!--							:min="1"-->
				<!--							:max="9999"-->
				<!--							@change="setLocalThemeConfig"-->
				<!--							style="width: 90px"-->
				<!--						>-->
				<!--						</el-input-number>-->
				<!--					</div>-->
				<!--				</div>-->

				<!-- 界面显示 -->
				<el-divider content-position="left">{{ $t('layout.fourTitle') }}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsShowLogo') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isShowLogo" size="small" @change="onIsShowLogoChange"></el-switch>
					</div>
				</div>
				<div
					class="layout-breadcrumb-seting-bar-flex mt15"
					:style="{ opacity: getThemeConfig.layout === 'classic' || getThemeConfig.layout === 'transverse' ? 0.5 : 1 }"
				>
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsBreadcrumb') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isBreadcrumb"
							:disabled="getThemeConfig.layout === 'classic' || getThemeConfig.layout === 'transverse'"
							size="small"
							@change="onIsBreadcrumbChange"
						></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsBreadcrumbIcon') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isBreadcrumbIcon" size="small" @change="setLocalThemeConfig"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsTagsview') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isTagsview" size="small" @change="setLocalThemeConfig"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsTagsviewIcon') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isTagsviewIcon" size="small" @change="setLocalThemeConfig"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsCacheTagsView') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isCacheTagsView" size="small" @change="setLocalThemeConfig"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15" :style="{ opacity: state.isMobile ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsSortableTagsView') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch
							v-model="getThemeConfig.isSortableTagsView"
							:disabled="!!state.isMobile"
							size="small"
							@change="onSortableTagsViewChange"
						></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsShareTagsView') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isShareTagsView" size="small" @change="onShareTagsViewChange"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsFooter') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isFooter" size="small" @change="setLocalThemeConfig"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsGrayscale') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isGrayscale" size="small" @change="onAddFilterChange('grayscale')"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsInvert') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isInvert" size="small" @change="onAddFilterChange('invert')"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsWartermark') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isWartermark" size="small" @change="onWartermarkChange"></el-switch>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fourIsChat') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-switch v-model="getThemeConfig.isChat" size="small" @change="onChatChange"></el-switch>
					</div>
				</div>
				<!-- 其它设置 -->
				<el-divider content-position="left">{{ $t('layout.fiveTitle') }}</el-divider>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fiveTagsStyle') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-select v-model="getThemeConfig.tagsStyle" placeholder="请选择" style="width: 90px" @change="setLocalThemeConfig">
							<el-option label="风格1" value="tags-style-one"></el-option>
							<el-option label="风格4" value="tags-style-four"></el-option>
							<el-option label="风格5" value="tags-style-five"></el-option>
						</el-select>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fiveAnimation') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-select v-model="getThemeConfig.animation" placeholder="请选择" style="width: 90px" @change="setLocalThemeConfig">
							<el-option label="slide-right" value="slide-right"></el-option>
							<el-option label="slide-left" value="slide-left"></el-option>
							<el-option label="opacitys" value="opacitys"></el-option>
						</el-select>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fiveColumnsAsideStyle') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-select
							v-model="getThemeConfig.columnsAsideStyle"
							placeholder="请选择"
							style="width: 90px"
							:disabled="getThemeConfig.layout !== 'columns' ? true : false"
							@change="setLocalThemeConfig"
						>
							<el-option label="圆角" value="columns-round"></el-option>
							<el-option label="卡片" value="columns-card"></el-option>
						</el-select>
					</div>
				</div>
				<div class="layout-breadcrumb-seting-bar-flex mt15 mb27" :style="{ opacity: getThemeConfig.layout !== 'columns' ? 0.5 : 1 }">
					<div class="layout-breadcrumb-seting-bar-flex-label">{{ $t('layout.fiveColumnsAsideLayout') }}</div>
					<div class="layout-breadcrumb-seting-bar-flex-value">
						<el-select
							v-model="getThemeConfig.columnsAsideLayout"
							placeholder="请选择"
							style="width: 90px"
							:disabled="getThemeConfig.layout !== 'columns' ? true : false"
							@change="setLocalThemeConfig"
						>
							<el-option label="水平" value="columns-horizontal"></el-option>
							<el-option label="垂直" value="columns-vertical"></el-option>
						</el-select>
					</div>
				</div>
				<div class="copy-config">
					<el-alert :title="$t('layout.tipText')" type="warning" :closable="false"> </el-alert>
					<el-button class="copy-config-btn" type="primary" ref="copyConfigBtnRef" @click="onCopyConfigClick">
						<el-icon class="mr5">
							<ele-CopyDocument />
						</el-icon>
						{{ $t('layout.copyText') }}
					</el-button>
					<el-button class="copy-config-btn-reset" type="info" @click="onResetConfigClick">
						<el-icon class="mr5">
							<ele-RefreshRight />
						</el-icon>
						{{ $t('layout.resetText') }}
					</el-button>
				</div>
			</el-scrollbar>
		</el-drawer>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbSeting">
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useChangeColor } from '/@/utils/theme';
import { Local } from '/@/utils/storage';
import Watermark from '/@/utils/wartermark';
import commonFunction from '/@/utils/commonFunction';
import other from '/@/utils/other';
import mittBus from '/@/utils/mitt';
import { useUserInfo } from '/@/stores/userInfo';
import { useDark } from '@vueuse/core';

const { locale } = useI18n();
const { themeConfig } = storeToRefs(useThemeConfig());
const { copyText } = commonFunction();
const { getLightColor, getDarkColor } = useChangeColor();
const state = reactive({ isMobile: false });

const getThemeConfig = computed(() => themeConfig.value);
// 全局主题色
const onColorPickerChange = () => {
	if (!getThemeConfig.value.primary) return ElMessage.warning('全局主题 primary 颜色值不能为空');
	// 颜色加深
	document.documentElement.style.setProperty('--el-color-primary-dark-2', `${getDarkColor(getThemeConfig.value.primary, 0.1)}`);
	document.documentElement.style.setProperty('--el-color-primary', getThemeConfig.value.primary);
	// 颜色变浅
	for (let i = 1; i <= 9; i++) {
		document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(getThemeConfig.value.primary, i / 10)}`);
	}
	setDispatchThemeConfig();
};
// 菜单/顶栏颜色
const onBgColorPickerChange = (bg: 'topBar' | 'topBarColor' | 'menuBar' | 'menuBarColor' | 'menuBarActiveColor' | 'columnsMenuBar' | 'columnsMenuBarColor') => {
	document.documentElement.style.setProperty(`--next-bg-${bg}`, themeConfig.value[bg]);
	if (bg === 'menuBar') {
		document.documentElement.style.setProperty(`--next-bg-menuBar-light-1`, getLightColor(getThemeConfig.value.menuBar, 0.05));
	}
	onTopBarGradualChange();
	onMenuBarGradualChange();
	onColumnsMenuBarGradualChange();
	setDispatchThemeConfig();
};
// 顶栏背景渐变
const onTopBarGradualChange = () => {
	setGraduaFun('.layout-navbars-breadcrumb-index', getThemeConfig.value.isTopBarColorGradual, getThemeConfig.value.topBar);
};
// 菜单背景渐变
const onMenuBarGradualChange = () => {
	setGraduaFun('.layout-container .el-aside', getThemeConfig.value.isMenuBarColorGradual, getThemeConfig.value.menuBar);
};
// 分栏菜单背景渐变
const onColumnsMenuBarGradualChange = () => {
	setGraduaFun('.layout-container .layout-columns-aside', getThemeConfig.value.isColumnsMenuBarColorGradual, getThemeConfig.value.columnsMenuBar);
};
// 背景渐变函数
const setGraduaFun = (el: string, bool: boolean, color: string) => {
	setTimeout(() => {
		const els = document.querySelector(el);
		if (!els) return;
		document.documentElement.style.setProperty('--el-menu-bg-color', document.documentElement.style.getPropertyValue('--next-bg-menuBar'));
		if (bool) els.setAttribute('style', `background:linear-gradient(to bottom left , ${color}, ${getLightColor(color, 0.6)}) !important;`);
		else els.setAttribute('style', ``);
		setLocalThemeConfig();
	}, 200);
};

const onColumnsMenuHoverPreloadChange = () => {
	setLocalThemeConfig();
};

// 菜单水平折叠
const onThemeConfigChange = () => {
	setDispatchThemeConfig();
};

// 固定 Header
const onIsFixedHeaderChange = () => {
	getThemeConfig.value.isFixedHeaderChange = !getThemeConfig.value.isFixedHeader;
	setLocalThemeConfig();
};

// 经典布局分割菜单
const onClassicSplitMenuChange = () => {
	getThemeConfig.value.isBreadcrumb = false;
	setLocalThemeConfig();
	mittBus.emit('getBreadcrumbIndexSetFilterRoutes');
};
// 侧边栏 Logo
const onIsShowLogoChange = () => {
	getThemeConfig.value.isShowLogoChange = !getThemeConfig.value.isShowLogo;
	setLocalThemeConfig();
};

// 面包屑
const onIsBreadcrumbChange = () => {
	if (getThemeConfig.value.layout === 'classic') {
		getThemeConfig.value.isClassicSplitMenu = false;
	}
	setLocalThemeConfig();
};
// TagsView 拖拽
const onSortableTagsViewChange = () => {
	mittBus.emit('openOrCloseSortable');
	setLocalThemeConfig();
};
// TagsView 共用
const onShareTagsViewChange = () => {
	mittBus.emit('openShareTagsView');
	setLocalThemeConfig();
};
// 灰色模式/色弱模式
const onAddFilterChange = (attr: string) => {
	if (attr === 'grayscale') {
		if (getThemeConfig.value.isGrayscale) getThemeConfig.value.isInvert = false;
	} else {
		if (getThemeConfig.value.isInvert) getThemeConfig.value.isGrayscale = false;
	}
	const cssAttr =
		attr === 'grayscale' ? `grayscale(${getThemeConfig.value.isGrayscale ? 1 : 0})` : `invert(${getThemeConfig.value.isInvert ? '80%' : '0%'})`;
	const appEle = document.body;
	appEle.setAttribute('style', `filter: ${cssAttr}`);
	setLocalThemeConfig();
};
// 深色模式
const isDark = useDark();
const onAddDarkChange = () => {
	const body = document.documentElement as HTMLElement;
	if (getThemeConfig.value.isDark) {
		body.setAttribute('data-theme', 'dark');
		// body 再增加一个 dark : true 的class ,用于tailwindcss 判断是否是深色
		body.classList.add('dark');
		isDark.value = true;
	} else {
		body.classList.remove('dark');
		body.setAttribute('data-theme', 'light');
		isDark.value = false;
	}
};
// 水印
const onWartermarkChange = () => {
	const username = useUserInfo().userInfos.user?.username || getThemeConfig.value.globalTitle;
	getThemeConfig.value.isWartermark ? Watermark.set(username) : Watermark.del();
	setLocalThemeConfig();
};

// AI 助手
const onChatChange = () => {
	setLocalThemeConfig();
};

// 布局切换
const onSetLayout = (layout: string) => {
	Local.set('oldLayout', layout);
	if (getThemeConfig.value.layout === layout) return;
	if (layout === 'transverse') getThemeConfig.value.isCollapse = false;
	getThemeConfig.value.layout = layout;
	getThemeConfig.value.isDrawer = false;
	initLayoutChangeFun();
};

const initLayoutChangeFun = () => {
	onBgColorPickerChange('menuBar');
	onBgColorPickerChange('menuBarColor');
	onBgColorPickerChange('menuBarActiveColor');
	onBgColorPickerChange('topBar');
	onBgColorPickerChange('topBarColor');
	onBgColorPickerChange('columnsMenuBar');
	onBgColorPickerChange('columnsMenuBarColor');
};

const onDrawerClose = () => {
	getThemeConfig.value.isFixedHeaderChange = false;
	getThemeConfig.value.isShowLogoChange = false;
	getThemeConfig.value.isDrawer = false;
	setLocalThemeConfig();
};

const openDrawer = () => {
	getThemeConfig.value.isDrawer = true;
};

const setDispatchThemeConfig = () => {
	setLocalThemeConfig();
	setLocalThemeConfigStyle();
};
const setLocalThemeConfig = () => {
	Local.remove('themeConfig');
	Local.set('themeConfig', getThemeConfig.value);
};

const setLocalThemeConfigStyle = () => {
	Local.set('themeConfigStyle', document.documentElement.style.cssText);
};

const onCopyConfigClick = () => {
	const copyThemeConfig = Local.get('themeConfig');
	copyThemeConfig.isDrawer = false;
	copyText(JSON.stringify(copyThemeConfig)).then(() => {
		getThemeConfig.value.isDrawer = false;
	});
};

const onResetConfigClick = () => {
	Local.clear();
	window.location.reload();
	// @ts-ignore
	Local.set('version', __VERSION__);
};

const onComponentSizeChange = (size: string) => {
	Local.remove('themeConfig');
	themeConfig.value.globalComponentSize = size;
	Local.set('themeConfig', themeConfig.value);
	getThemeConfig.value.isDrawer = false;
	window.location.reload();
};

// 初始化菜单样式
const initSetStyle = () => {
	onTopBarGradualChange();
	onMenuBarGradualChange();
	onColumnsMenuBarGradualChange();
};
onMounted(() => {
	nextTick(() => {
		// 判断当前布局是否不相同，不相同则初始化样式
		if (!Local.get('frequency')) initLayoutChangeFun();
		Local.set('frequency', 1);
		mittBus.on('layoutMobileResize', (res: LayoutMobileResize) => {
			getThemeConfig.value.layout = res.layout;
			getThemeConfig.value.isDrawer = false;
			initLayoutChangeFun();
			state.isMobile = other.isMobile();
		});
		setTimeout(() => {
			onColorPickerChange();
			if (getThemeConfig.value.isGrayscale) onAddFilterChange('grayscale');
			if (getThemeConfig.value.isInvert) onAddFilterChange('invert');
			onAddDarkChange();
			onWartermarkChange();
			if (Local.get('themeConfig')) locale.value = Local.get('themeConfig').globalI18n;
			initSetStyle();
		}, 100);
	});
});
onUnmounted(() => {
	mittBus.off('layoutMobileResize', () => {});
});

defineExpose({ openDrawer });
</script>

<style scoped lang="scss">
.layout-breadcrumb-seting-bar {
	height: calc(100vh - 50px);
	padding: 0 15px;
	:deep(.el-scrollbar__view) {
		overflow-x: hidden !important;
	}
	.layout-breadcrumb-seting-bar-flex {
		display: flex;
		align-items: center;
		margin-bottom: 5px;
		&-label {
			flex: 1;
			color: var(--el-text-color-primary);
		}
	}
	.layout-drawer-content-flex {
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		margin: 0 -5px;
		.layout-drawer-content-item {
			width: 50%;
			height: 70px;
			cursor: pointer;
			border: 1px solid transparent;
			position: relative;
			padding: 5px;
			.el-container {
				height: 100%;
				.el-aside-dark {
					background-color: var(--next-color-seting-header);
				}
				.el-aside {
					background-color: var(--next-color-seting-aside);
				}
				.el-header {
					background-color: var(--next-color-seting-header);
				}
				.el-main {
					background-color: var(--next-color-seting-main);
				}
			}
			.el-circular {
				border-radius: 2px;
				overflow: hidden;
				border: 1px solid transparent;
				transition: all 0.3s ease-in-out;
			}
			.drawer-layout-active {
				border: 1px solid;
				border-color: var(--el-color-primary);
			}
			.layout-tips-warp,
			.layout-tips-warp-active {
				transition: all 0.3s ease-in-out;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
				border: 1px solid;
				border-color: var(--el-color-primary-light-5);
				border-radius: 100%;
				padding: 4px;
				.layout-tips-box {
					transition: inherit;
					width: 30px;
					height: 30px;
					z-index: 9;
					border: 1px solid;
					border-color: var(--el-color-primary-light-5);
					border-radius: 100%;
					.layout-tips-txt {
						transition: inherit;
						position: relative;
						top: 5px;
						font-size: 12px;
						line-height: 1;
						letter-spacing: 2px;
						white-space: nowrap;
						color: var(--el-color-primary-light-5);
						text-align: center;
						transform: rotate(30deg);
						left: -1px;
						background-color: var(--next-color-seting-main);
						width: 32px;
						height: 17px;
						line-height: 17px;
					}
				}
			}
			.layout-tips-warp-active {
				border: 1px solid;
				border-color: var(--el-color-primary);
				.layout-tips-box {
					border: 1px solid;
					border-color: var(--el-color-primary);
					.layout-tips-txt {
						color: var(--el-color-primary) !important;
						background-color: var(--next-color-seting-main) !important;
					}
				}
			}
			&:hover {
				.el-circular {
					transition: all 0.3s ease-in-out;
					border: 1px solid;
					border-color: var(--el-color-primary);
				}
				.layout-tips-warp {
					transition: all 0.3s ease-in-out;
					border-color: var(--el-color-primary);
					.layout-tips-box {
						transition: inherit;
						border-color: var(--el-color-primary);
						.layout-tips-txt {
							transition: inherit;
							color: var(--el-color-primary) !important;
							background-color: var(--next-color-seting-main) !important;
						}
					}
				}
			}
		}
	}
	.copy-config {
		margin: 10px 0;
		.copy-config-btn {
			width: 100%;
			margin-top: 15px;
		}
		.copy-config-btn-reset {
			width: 100%;
			margin: 10px 0 0;
		}
	}
}
</style>
