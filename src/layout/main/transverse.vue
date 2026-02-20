<template>
	<el-container class="layout-container flex-center layout-backtop">
		<LayoutHeader />
		<LayoutMain ref="layoutMainRef" />
	</el-container>
</template>

<script setup lang="ts" name="layoutTransverse">
import { useThemeConfig } from '/@/stores/themeConfig';
import { until } from '@vueuse/core';

const LayoutHeader = defineAsyncComponent(() => import('/@/layout/component/header.vue'));
const LayoutMain = defineAsyncComponent(() => import('/@/layout/component/main.vue'));

const layoutMainRef = ref<InstanceType<typeof LayoutMain>>();
const { themeConfig } = storeToRefs(useThemeConfig());
const route = useRoute();

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
