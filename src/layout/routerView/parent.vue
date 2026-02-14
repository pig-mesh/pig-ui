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

const Iframes = defineAsyncComponent(() => import('/@/layout/routerView/iframes.vue'));

const route = useRoute();
const router = useRouter();
const storesKeepAliveNames = useKeepALiveNames();
const { keepAliveNames, cachedViews } = storeToRefs(storesKeepAliveNames);
const { themeConfig } = storeToRefs(useThemeConfig());
const state = reactive<ParentViewState>({
	refreshRouterViewKey: '', // 非 iframe tagsview 右键菜单刷新时
	iframeRefreshKey: '', // iframe tagsview 右键菜单刷新时
	keepAliveNameList: [],
	iframeList: [],
});

const routeRefreshCounter = ref<Record<string, number>>({});

const setTransitionName = computed(() => themeConfig.value.animation);

// 获取路由视图的 key，支持关闭后重新打开时强制刷新
const getRouterViewKey = computed(() => {
	const basePath = route.meta?.isDynamic ? route.meta.isDynamicPath : route.path;
	const counter = routeRefreshCounter.value[basePath as string] || 0;
	return counter > 0 ? `${state.refreshRouterViewKey}_refresh_${counter}` : state.refreshRouterViewKey;
});

const isIframePage = computed(() => route.meta.isIframe);

const getIframeListRoutes = async () => {
	router.getRoutes().forEach((v) => {
		if (v.meta.isIframe) {
			v.meta.isIframeOpen = false;
			v.meta.loading = true;
			state.iframeList.push({ ...v });
		}
	});
};

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

onUnmounted(() => {
	mittBus.off('onTagsViewRefreshRouterView', () => {});
});

// 监听路由变化，防止 tagsView 多标签切换动画消失
watch(
	() => route.fullPath,
	() => {
		state.refreshRouterViewKey = decodeURI(route.fullPath);

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
