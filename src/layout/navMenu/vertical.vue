<template>
	<el-menu
		router
		:default-active="state.defaultActive"
		background-color="transparent"
		:collapse="state.isCollapse"
		:unique-opened="getThemeConfig.isUniqueOpened"
		:collapse-transition="false"
	>
		<template v-for="val in menuLists">
      <!-- 三级菜单 -->
			<el-sub-menu :index="val.path" v-if="val.children && val.children.length > 0" :key="val.path">
				<template #title>
					<SvgIcon :name="val.meta.icon" />
					<span>{{ $t(val.meta.title || val.name) }}</span>
				</template>
				<SubItem :chil="val.children" />
			</el-sub-menu>
			<template v-else>
        <!-- 二级菜单       -->
				<el-menu-item :index="val.path" :key="val.path">
					<SvgIcon :name="val.meta.icon" />
					<template #title v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
						<span>{{ $t(val.meta.title || val.name) }}</span>
					</template>
					<template #title v-else>
						<a class="w100" @click.prevent="onALinkClick(val)">{{ $t(val.meta.title || val.name) }}</a>
					</template>
				</el-menu-item>
			</template>
		</template>
	</el-menu>
</template>

<script setup lang="ts" name="navMenuVertical">
import {RouteRecordRaw} from 'vue-router';
import {useThemeConfig} from '/@/stores/themeConfig';
import { useWindowSize } from '@vueuse/core';
import other from '/@/utils/other';

const SubItem = defineAsyncComponent(() => import('/@/layout/navMenu/subItem.vue'));

const props = defineProps({
	menuList: {
		type: Array<RouteRecordRaw>,
		default: () => [],
	},
});

const { themeConfig } = storeToRefs(useThemeConfig());
const { width: windowWidth } = useWindowSize();
const route = useRoute();
const state = reactive({
	defaultActive: route.meta.isDynamic ? route.meta.isDynamicPath : route.path,
	isCollapse: false,
});

const menuLists = computed(() => <RouteItems>props.menuList);
const getThemeConfig = computed(() => themeConfig.value);

const setParentHighlight = (currentRoute: RouteToFrom) => {
	const { path, meta } = currentRoute;
	const pathSplit = meta?.isDynamic ? meta.isDynamicPath!.split('/') : path!.split('/');
	if (pathSplit.length >= 4 && meta?.isHide) return pathSplit.splice(0, 3).join('/');
	return path;
};

const onALinkClick = (val: RouteItem) => {
	other.handleOpenLink(val);
};

onMounted(() => {
	state.defaultActive = setParentHighlight(route);
});

onBeforeRouteUpdate((to) => {
	state.defaultActive = setParentHighlight(to);
	if (windowWidth.value < 1000) themeConfig.value.isCollapse = false;
});

watch(
	themeConfig.value,
	() => {
		windowWidth.value <= 1000 ? (state.isCollapse = false) : (state.isCollapse = themeConfig.value.isCollapse);
	},
	{ immediate: true }
);
</script>
