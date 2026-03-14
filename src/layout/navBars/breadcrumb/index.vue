<template>
	<div class="layout-navbars-breadcrumb-index">
		<Logo v-if="setIsShowLogo" />
		<Breadcrumb />
		<Horizontal :menuList="state.menuList" v-if="isLayoutTransverse" />
		<div class="layout-navbars-breadcrumb-actions">
			<div class="more-menu-wrapper">
				<More />
			</div>
			<User />
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbIndex">
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';

const Breadcrumb = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/breadcrumb.vue'));
const More = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/more.vue'));
const User = defineAsyncComponent(() => import('/@/layout/navBars/breadcrumb/user.vue'));
const Logo = defineAsyncComponent(() => import('/@/layout/logo/index.vue'));
const Horizontal = defineAsyncComponent(() => import('/@/layout/navMenu/horizontal.vue'));

const stores = useRoutesList();
const { themeConfig } = storeToRefs(useThemeConfig());
const { routesList } = storeToRefs(stores);
const route = useRoute();
const state = reactive({
	menuList: [] as RouteItems,
});

const setIsShowLogo = computed(() => {
	const { isShowLogo, layout } = themeConfig.value;
	return isShowLogo && (layout === 'classic' || layout === 'transverse');
});

const isLayoutTransverse = computed(() => {
	const { layout, isClassicSplitMenu } = themeConfig.value;
	return layout === 'transverse' || (isClassicSplitMenu && layout === 'classic');
});
// 设置/过滤路由
const setFilterRoutes = () => {
	const { layout, isClassicSplitMenu } = themeConfig.value;
	if (layout === 'classic' && isClassicSplitMenu) {
		state.menuList = delClassicChildren(filterRoutesFun(routesList.value));
		const resData = setSendClassicChildren(route.path);
		mittBus.emit('setSendClassicChildren', resData);
	} else {
		state.menuList = filterRoutesFun(routesList.value);
	}
};
// 分割菜单时，删除底下 children
const delClassicChildren = <T extends ChilType>(arr: T[]): T[] => {
	arr.map((v: T) => {
		if (v.children) delete v.children;
	});
	return arr;
};

// 路由过滤递归函数
const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
  return arr.reduce<T[]>((acc, item) => {
    if (!item.meta?.isHide) {
      const newItem = { ...item };
      if (newItem.children) newItem.children = filterRoutesFun(newItem.children);
      acc.push(newItem);
    }
    return acc;
  }, []);
};

// 传送当前子级数据到菜单中
const setSendClassicChildren = (path: string) => {
  const currentData: MittMenu = { children: [] };
  const route = searchParent(routesList.value, path as string);
  if (route) {
    const filteredRoutes = filterRoutesFun(routesList.value);
    const matchedRoute = filteredRoutes.find(v => v.path === route.path);
    if (matchedRoute) {
      currentData['item'] = { ...matchedRoute };
      currentData['children'] = matchedRoute.children || [];
    }
  }
  return currentData;
};

// 递归查询对应的父级路由
const searchParent = (routesList: any, path: string) => {
  for (const item of routesList) {
    if (item.path === path) return item;
    if (item.children) {
      const parent = searchParent(item.children, path);
      if (parent) return item;
    }
  }
  return undefined;
};

onMounted(() => {
	setFilterRoutes();
	mittBus.on('getBreadcrumbIndexSetFilterRoutes', () => {
		setFilterRoutes();
	});
});

onUnmounted(() => {
	mittBus.off('getBreadcrumbIndexSetFilterRoutes', () => {});
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-index {
	height: 50px;
	display: flex;
	align-items: center;
	background: var(--next-bg-topBar);
	border-bottom: 1px solid var(--next-border-color-light);

	.layout-navbars-breadcrumb-actions {
		margin-left: auto;
		display: flex;
		align-items: center;
	}

	.more-menu-wrapper {
		display: flex;
		align-items: center;

		// 响应式：小屏幕时隐藏More组件
		@media (max-width: 768px) {
			display: none;
		}
	}
}
</style>
