<template>
	<el-container class="layout-container">
		<LayoutAside />
		<el-container class="layout-container-view h100">
			<el-scrollbar ref="layoutScrollbarRef" class="layout-backtop">
				<LayoutHeader />
				<LayoutMain ref="layoutMainRef" />
			</el-scrollbar>
		</el-container>
	</el-container>
</template>

<script setup lang="ts" name="layoutDefaults">
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';
import { until } from '@vueuse/core';

const LayoutAside = defineAsyncComponent(() => import('/@/layout/component/aside.vue'));
const LayoutHeader = defineAsyncComponent(() => import('/@/layout/component/header.vue'));
const LayoutMain = defineAsyncComponent(() => import('/@/layout/component/main.vue'));

const layoutScrollbarRef = ref<RefType>('');
const layoutMainRef = ref<InstanceType<typeof LayoutMain>>();
const route = useRoute();
const { themeConfig } = storeToRefs(useThemeConfig());

const updateScrollbar = () => {
	layoutScrollbarRef.value?.update();
	layoutMainRef.value?.layoutMainScrollbarRef?.update();
};

const initScrollBarHeight = async () => {
	await until(() => layoutMainRef.value?.layoutMainScrollbarRef).toMatch(v => !!v, { timeout: 3000 });
	await nextTick();
	updateScrollbar();
	if (layoutScrollbarRef.value?.wrapRef) {
		layoutScrollbarRef.value.wrapRef.scrollTop = 0;
	}
	if (layoutMainRef.value?.layoutMainScrollbarRef?.wrapRef) {
		layoutMainRef.value.layoutMainScrollbarRef.wrapRef.scrollTop = 0;
	}
};

onMounted(() => {
	initScrollBarHeight();
	NextLoading.done(600);
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
