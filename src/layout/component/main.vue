<template>
	<el-main class="layout-main" :style="isFixedHeader ? `height: calc(100% - ${setMainHeight})` : `minHeight: calc(100% - ${setMainHeight})`">
		<el-scrollbar
			ref="layoutMainScrollbarRef"
			class="layout-main-scroll layout-backtop-header-fixed"
			wrap-class="layout-main-scroll"
			view-class="layout-main-scroll"
		>
			<LayoutParentView />
		</el-scrollbar>
		<el-backtop :target="setBacktopClass" />
		<check-token />
    <chat/>
	</el-main>
</template>

<script setup lang="ts" name="layoutMain">
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useThemeConfig } from '/@/stores/themeConfig';
import { NextLoading } from '/@/utils/loading';

const LayoutParentView = defineAsyncComponent(() => import('/@/layout/routerView/parent.vue'));
const CheckToken = defineAsyncComponent(() => import('/@/components/CheckToken/index.vue'));
const Chat = defineAsyncComponent(() => import('/@/components/Chat/index.vue'));

const layoutMainScrollbarRef = ref();
const { themeConfig } = storeToRefs(useThemeConfig());
const { isTagsViewCurrenFull } = storeToRefs(useTagsViewRoutes());

const isFixedHeader = computed(() => themeConfig.value.isFixedHeader);

const setBacktopClass = computed(() => {
	return themeConfig.value.isFixedHeader
		? `.layout-backtop-header-fixed .el-scrollbar__wrap`
		: `.layout-backtop .el-scrollbar__wrap`;
});

const setMainHeight = computed(() => {
	if (isTagsViewCurrenFull.value) return '0px';
	const { isTagsview, layout } = themeConfig.value;
	return isTagsview && layout !== 'classic' ? '85px' : '51px';
});

onMounted(() => {
	NextLoading.done(600);
});

defineExpose({ layoutMainScrollbarRef });
</script>
