<template>
	<div class="layout-parent">
		<router-view v-slot="{ Component }">
			<transition :name="setTransitionName" mode="out-in">
				<keep-alive>
					<component :is="Component" :key="getRouterViewKey" class="w100" v-show="!isIframePage" v-if="route.meta.isKeepAlive" />
				</keep-alive>
			</transition>
			<transition :name="setTransitionName" mode="out-in">
				<component :is="Component" :key="getRouterViewKey" class="w100" v-show="!isIframePage" v-if="!route.meta.isKeepAlive" />
			</transition>
		</router-view>
		<transition :name="setTransitionName" mode="out-in">
			<Iframes class="w100" v-show="isIframePage" :refreshKey="state.iframeRefreshKey" :name="setTransitionName" :list="state.iframeList" />
		</transition>
	</div>
</template>

<script setup lang="ts" name="layoutParentView">
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useThemeConfig } from '/@/stores/themeConfig';
import { Session } from '/@/utils/storage';
import mittBus from '/@/utils/mitt';

// 引入组件
const Iframes = defineAsyncComponent(() => import('/@/layout/routerView/iframes.vue'));

// 定义变量内容
const route = useRoute();
const router = useRouter();
const storesKeepAliveNames = useKeepALiveNames();
const storesThemeConfig = useThemeConfig();
const { keepAliveNames, cachedViews } = storeToRefs(storesKeepAliveNames);
const { themeConfig } = storeToRefs(storesThemeConfig);
const state = reactive<ParentViewState>({
	refreshRouterViewKey: '', // 非 iframe tagsview 右键菜单刷新时
	iframeRefreshKey: '', // iframe tagsview 右键菜单刷新时
	keepAliveNameList: [],
	iframeList: [],
});

// 路由刷新计数器，用于强制刷新关闭后重新打开的页面
const routeRefreshCounter = ref<Record<string, number>>({});

// 设置主界面切换动画
const setTransitionName = computed(() => {
	return themeConfig.value.animation;
});

// 获取路由视图的 key，支持关闭后重新打开时强制刷新
const getRouterViewKey = computed(() => {
	const basePath = route.meta?.isDynamic ? route.meta.isDynamicPath : route.path;
	const counter = routeRefreshCounter.value[basePath as string] || 0;
	return counter > 0 ? `${state.refreshRouterViewKey}_refresh_${counter}` : state.refreshRouterViewKey;
});

// 设置 iframe 显示/隐藏
const isIframePage = computed(() => {
	return route.meta.isIframe;
});
// 获取 iframe 组件列表(未进行渲染)
const getIframeListRoutes = async () => {
	router.getRoutes().forEach((v) => {
		if (v.meta.isIframe) {
			v.meta.isIframeOpen = false;
			v.meta.loading = true;
			state.iframeList.push({ ...v });
		}
	});
};
// 页面加载前，处理缓存，页面刷新时路由缓存处理
onBeforeMount(() => {
	state.keepAliveNameList = keepAliveNames.value;
	mittBus.on('onTagsViewRefreshRouterView', (fullPath: string) => {
		state.keepAliveNameList = keepAliveNames.value.filter((name: string) => route.name !== name);
		state.refreshRouterViewKey = '';
		state.iframeRefreshKey = '';
		nextTick(() => {
			state.refreshRouterViewKey = fullPath;
			state.iframeRefreshKey = fullPath;
			state.keepAliveNameList = keepAliveNames.value;
		});
	});
});
// 页面加载时
onMounted(() => {
	getIframeListRoutes();
	nextTick(() => {
		setTimeout(() => {
			if (themeConfig.value.isCacheTagsView) {
				let tagsViewArr: RouteItem[] = Session.get('tagsViewList') || [];
				cachedViews.value = tagsViewArr.filter((item) => item.meta?.isKeepAlive).map((item) => item.name as string);
			}
		}, 0);
	});
});
// 页面卸载时
onUnmounted(() => {
	mittBus.off('onTagsViewRefreshRouterView', () => {});
});
// 监听路由变化，防止 tagsView 多标签时，切换动画消失
// https://toscode.gitee.com/lyt-top/vue-next-admin/pulls/38/files
watch(
	() => route.fullPath,
	() => {
		state.refreshRouterViewKey = decodeURI(route.fullPath);

		// 检查是否是关闭后重新打开的路由，如果是则增加计数器强制刷新
		const basePath = route.meta?.isDynamic ? route.meta.isDynamicPath : route.path;
		if (storesKeepAliveNames.checkAndClearClosedRoute(basePath as string)) {
			routeRefreshCounter.value[basePath as string] = (routeRefreshCounter.value[basePath as string] || 0) + 1;
		}
	},
	{
		immediate: true,
	}
);
</script>
