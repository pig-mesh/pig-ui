<template>
	<div class="layout-columns-aside">
		<el-scrollbar>
			<ul @mouseleave="onColumnsAsideMenuMouseleave()">
				<li
					v-for="(v, k) in state.columnsAsideList"
					:key="k"
					@click="onColumnsAsideMenuClick(v, k)"
					@mouseenter="onColumnsAsideMenuMouseenter(v, k)"
					:ref="
						(el) => {
							if (el) columnsAsideOffsetTopRefs[k] = el;
						}
					"
					:class="{ 'layout-columns-active': state.liIndex === k, 'layout-columns-hover': state.liHoverIndex === k }"
					:title="$t(v.meta.title || v.name)"
				>
					<div :class="themeConfig.columnsAsideLayout" v-if="!v.meta.isLink || (v.meta.isLink && v.meta.isIframe)">
						<SvgIcon :name="v.meta.icon" />
						<div class="columns-vertical-title font12">
							{{
								$t(v.meta.title || v.name) && $t(v.meta.title || v.name).length >= 4
									? $t(v.meta.title).substr(0, themeConfig.columnsAsideLayout === 'columns-vertical' ? 4 : 3)
									: $t(v.meta.title || v.name)
							}}
						</div>
					</div>
					<div :class="themeConfig.columnsAsideLayout" v-else>
						<a :href="v.meta.isLink" target="_blank">
							<SvgIcon :name="v.meta.icon" />
							<div class="columns-vertical-title font12">
								{{
									$t(v.meta.title) && $t(v.meta.title).length >= 4
										? $t(v.meta.title).substr(0, themeConfig.columnsAsideLayout === 'columns-vertical' ? 4 : 3)
										: $t(v.meta.title)
								}}
							</div>
						</a>
					</div>
				</li>
				<div ref="columnsAsideActiveRef" :class="themeConfig.columnsAsideStyle"></div>
			</ul>
		</el-scrollbar>
	</div>
</template>

<script setup lang="ts" name="layoutColumnsAside">
import { RouteRecordRaw } from 'vue-router';
import { useRoutesList } from '/@/stores/routesList';
import { useThemeConfig } from '/@/stores/themeConfig';
import mittBus from '/@/utils/mitt';

const columnsAsideOffsetTopRefs = ref<RefType>([]);
const columnsAsideActiveRef = ref();
const stores = useRoutesList();
const storesThemeConfig = useThemeConfig();
const { routesList, isColumnsMenuHover, isColumnsNavHover } = storeToRefs(stores);
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const router = useRouter();
const state = reactive<ColumnsAsideState>({
	columnsAsideList: [],
	liIndex: 0,
	liOldIndex: null,
	liHoverIndex: null,
	liOldPath: null,
	difference: 0,
	routeSplit: [],
});

const setColumnsAsideMove = (k: number) => {
	state.liIndex = k;
	columnsAsideActiveRef.value.style.top = `${columnsAsideOffsetTopRefs.value[k].offsetTop + state.difference}px`;
};

const onColumnsAsideMenuClick = (v: RouteItem, k: number) => {
	setColumnsAsideMove(k);
	const { path, redirect } = v;
	if (redirect) router.push(redirect);
	else router.push(path);
};

const onColumnsAsideMenuMouseenter = (v: RouteRecordRaw, k: number) => {
	if (!themeConfig.value.isColumnsMenuHoverPreload) return;
	const { path } = v;
	state.liOldPath = path;
	state.liOldIndex = k;
	state.liHoverIndex = k;
	mittBus.emit('setSendColumnsChildren', setSendChildren(path));
	stores.setColumnsMenuHover(false);
	stores.setColumnsNavHover(true);
};

const onColumnsAsideMenuMouseleave = async () => {
	await stores.setColumnsNavHover(false);
	setTimeout(() => {
		if (!isColumnsMenuHover && !isColumnsNavHover) mittBus.emit('restoreDefault');
	}, 100);
};

const onColumnsAsideDown = (k: number) => {
	nextTick(() => {
		setColumnsAsideMove(k);
	});
};

const setFilterRoutes = () => {
	state.columnsAsideList = filterRoutesFun(routesList.value);
	const resData: MittMenu = setSendChildren(route.path);
	if (Object.keys(resData).length <= 0) return;
	onColumnsAsideDown(resData.item?.k);
	mittBus.emit('setSendColumnsChildren', resData);
};
// 传送当前子级数据到菜单中
const setSendChildren = (path: string) => {
	const parentRoute = searchParent(routesList.value, path) as any;
	const currentData: MittMenu = { children: [] };
	state.columnsAsideList.map((v: RouteItem, k: number) => {
		if (v.path === parentRoute.path) {
			v['k'] = k;
			currentData['item'] = { ...v };
			currentData['children'] = [{ ...v }];
			if (v.children) currentData['children'] = v.children;
		}
	});
	return currentData;
};

const filterRoutesFun = <T extends RouteItem>(arr: T[]): T[] => {
	return arr
		.filter((item: T) => !item.meta?.isHide)
		.map((item: T) => {
			item = Object.assign({}, item);
			if (item.children) item.children = filterRoutesFun(item.children);
			return item;
		});
};

// tagsView 点击时，根据路由查找下标实现左侧菜单高亮
const setColumnsMenuHighlight = (path: string) => {
	const parentRoute = searchParent(routesList.value, path) as any;
	const currentSplitRoute = state.columnsAsideList.find((v: RouteItem) => v.path === parentRoute.path);
	if (!currentSplitRoute) return;
	setTimeout(() => {
		onColumnsAsideDown(currentSplitRoute.k);
	}, 0);
};

const searchParent = (routesList: any, path: string) => {
	let route = undefined;
	routesList.forEach((item: any) => {
		if (item.path === path) {
			route = item;
			return;
		}
		if (item.children && searchParent(item.children, path)) {
			route = item;
			return;
		}
	});
	return route;
};

onMounted(() => {
	setFilterRoutes();
	mittBus.on('restoreDefault', () => {
		state.liOldIndex = null;
		state.liOldPath = null;
	});
});

onUnmounted(() => {
	mittBus.off('restoreDefault', () => {});
});

onBeforeRouteUpdate((to) => {
	setColumnsMenuHighlight(to.path);
	mittBus.emit('setSendColumnsChildren', setSendChildren(to.path));
});

// 监听布局配置变化，动态调整菜单高亮位置
watch(
	() => themeConfig.value.columnsAsideStyle,
	(style) => {
		state.difference = style === 'columnsRound' ? 3 : 0;
	}
);

watch(
	[isColumnsMenuHover, isColumnsNavHover],
	([menuHover, navHover]) => {
		if (!menuHover && !navHover) {
			state.liHoverIndex = null;
			mittBus.emit('setSendColumnsChildren', setSendChildren(route.path));
		} else {
			state.liHoverIndex = state.liOldIndex;
			if (!state.liOldPath) return;
			mittBus.emit('setSendColumnsChildren', setSendChildren(state.liOldPath));
		}
	}
);
</script>

<style scoped lang="scss">
.layout-columns-aside {
	width: 70px;
	height: 100%;
	background: var(--next-bg-columnsMenuBar);

	ul {
		position: relative;

		.layout-columns-active {
			color: var(--next-bg-columnsMenuBarColor) !important;
			transition: 0.3s ease-in-out;
		}

		.layout-columns-hover {
			color: var(--el-color-primary);

			a {
				color: var(--el-color-primary);
			}
		}

		li {
			color: var(--next-bg-columnsMenuBarColor);
			width: 100%;
			height: 50px;
			text-align: center;
			display: flex;
			cursor: pointer;
			position: relative;
			z-index: 1;

			&:hover {
				@extend .layout-columns-hover;
			}

			.columns-vertical {
				margin: auto;

				.columns-vertical-title {
					padding-top: 1px;
				}
			}

			.columns-horizontal {
				display: flex;
				height: 50px;
				width: 100%;
				align-items: center;
				padding: 0 5px;

				i {
					margin-right: 3px;
				}

				a {
					display: flex;

					.columns-horizontal-title {
						padding-top: 1px;
					}
				}
			}

			a {
				text-decoration: none;
				color: var(--next-bg-columnsMenuBarColor);
			}
		}

		.columns-round {
			background: var(--el-color-primary);
			color: var(--el-color-white);
			position: absolute;
			left: 50%;
			top: 2px;
			height: 44px;
			width: 65px;
			transform: translateX(-50%);
			z-index: 0;
			transition: 0.3s ease-in-out;
			border-radius: 5px;
		}

		.columns-card {
			@extend .columns-round;
			top: 0;
			height: 50px;
			width: 100%;
			border-radius: 0;
		}
	}
}
</style>
