<template>
	<el-container class="layout-container flex-center">
		<LayoutHeader />
		<el-container class="layout-mian-height-50">
			<LayoutAside />
			<div class="flex-center layout-backtop">
				<LayoutTagsView v-if="isTagsview" />
				<LayoutMain ref="layoutMainRef" />
			</div>
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutClassic">
import {useThemeConfig} from '/@/stores/themeConfig';
import { until } from '@vueuse/core';

const LayoutAside = defineAsyncComponent(() => import('/@/layout/component/aside.vue'));
const LayoutHeader = defineAsyncComponent(() => import('/@/layout/component/header.vue'));
const LayoutMain = defineAsyncComponent(() => import('/@/layout/component/main.vue'));
const LayoutTagsView = defineAsyncComponent(() => import('/@/layout/navBars/tagsView/tagsView.vue'));

const layoutMainRef = ref<InstanceType<typeof LayoutMain>>();
const route = useRoute();
const { themeConfig } = storeToRefs(useThemeConfig());

const isTagsview = computed(() => {
  const { layout } = themeConfig.value;
  if (layout === 'classic' && route.path === '/home') return false;
	return themeConfig.value.isTagsview;
});

const updateScrollbar = () => {
	layoutMainRef.value?.layoutMainScrollbarRef?.update();
};

const initScrollBarHeight = async () => {
	await until(() => layoutMainRef.value?.layoutMainScrollbarRef).toMatch(v => !!v, { timeout: 3000 });
	await nextTick();
	updateScrollbar();
	if (layoutMainRef.value?.layoutMainScrollbarRef?.wrapRef) {
		layoutMainRef.value.layoutMainScrollbarRef.wrapRef.scrollTop = 0;
	}
};

onMounted(() => {
	initScrollBarHeight();
});

watch(() => route.path, () => {
	initScrollBarHeight();
});

watch(
	[
		() => themeConfig.value.isCollapse,
		() => themeConfig.value.isShowLogo,
		() => themeConfig.value.isTagsview,
		() => themeConfig.value.layout
	],
	() => {
		updateScrollbar();
	}
);
</script>
