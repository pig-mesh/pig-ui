import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import pinia from '/@/stores/index';
import { storeToRefs } from 'pinia';
import { useKeepALiveNames } from '/@/stores/keepAliveNames';
import { useRoutesList } from '/@/stores/routesList';
import { Session } from '/@/utils/storage';
import { staticRoutes, notFoundAndNoPower } from '/@/router/route';
import { initBackEndControlRoutes } from '/@/router/backEnd';

/**
 * 1、前端控制路由时：isRequestRoutes 为 false，需要写 roles，需要走 setFilterRoute 方法。
 * 2、后端控制路由时：isRequestRoutes 为 true，不需要写 roles，不需要走 setFilterRoute 方法），
 * 相关方法已拆解到对应的 `backEnd.ts` 与 `frontEnd.ts`（他们互不影响，不需要同时改 2 个文件）。
 * 特别说明：
 * 1、前端控制：路由菜单由前端去写（无菜单管理界面，有角色管理界面），角色管理中有 roles 属性，需返回到 userInfo 中。
 * 2、后端控制：路由菜单由后端返回（有菜单管理界面、有角色管理界面）
 */

/**
 * 创建一个可以被 Vue 应用程序使用的路由实例
 * @method createRouter(options: RouterOptions): Router
 * @link 参考：https://next.router.vuejs.org/zh/api/#createrouter
 */
export const router = createRouter({
	history: createWebHashHistory(),
	/**
	 * 说明：
	 * 1、notFoundAndNoPower 默认添加 404、401 界面，防止一直提示 No match found for location with path 'xxx'
	 * 2、backEnd.ts(后端控制路由)、frontEnd.ts(前端控制路由) 中也需要加 notFoundAndNoPower 404、401 界面。
	 *    防止 404、401 不在 layout 布局中，不设置的话，404、401 界面将全屏显示
	 */
	routes: [...notFoundAndNoPower, ...staticRoutes],
});

/**
 * 路由多级嵌套数组处理成一维数组
 * @param arr 传入路由菜单数据数组
 * @returns 返回处理后的一维路由菜单数组
 */
export function formatFlatteningRoutes(arr: any) {
	if (arr.length <= 0) return false;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].children) {
			arr = arr.slice(0, i + 1).concat(arr[i].children, arr.slice(i + 1));
		}
	}
	return arr;
}

/**
 * 一维数组处理成多级嵌套数组（只保留二级：也就是二级以上全部处理成只有二级，keep-alive 支持二级缓存）
 * @description isKeepAlive 处理 `name` 值，进行缓存。顶级关闭，全部不缓存
 * @link 参考：https://v3.cn.vuejs.org/api/built-in-components.html#keep-alive
 * @param arr 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成 `定义动态路由（baseRoutes）` 的格式
 */
export function formatTwoStageRoutes(arr: any) {
	if (arr.length <= 0) return false;
	const newArr: any = [];
	const cacheList: Array<string> = [];
	arr.forEach((v: any) => {
		if (v.path === '/') {
			newArr.push({ component: v.component, name: v.name, path: v.path, redirect: v.redirect, meta: v.meta, children: [] });
		} else {
			// 判断是否是动态路由（xx/:id/:name），用于 tagsView 等中使用
			if (v.path.indexOf('/:') > -1) {
				v.meta['isDynamic'] = true;
				v.meta['isDynamicPath'] = v.path;
			}
			newArr[0].children.push({ ...v });
			// 存 name 值，keep-alive 中 include 使用，实现路由的缓存
			// 路径：/@/layout/routerView/parent.vue
			if (newArr[0].meta.isKeepAlive && v.meta.isKeepAlive) {
				cacheList.push(v.name);
				const stores = useKeepALiveNames(pinia);
				stores.setCacheKeepAlive(cacheList);
			}
		}
	});
	return newArr;
}


// 路由加载前
router.beforeEach(async (to, _from, next) => {
	// 检测并处理 URL 中的 access_token（支持任意页面携带 token 访问）
	const accessTokenRedirect = handleAccessTokenFromUrl(to);
	if (accessTokenRedirect) {
		next(accessTokenRedirect);
		return;
	}

	NProgress.configure({ showSpinner: false });
	if (to.name) NProgress.start();
	const token = Session.getToken();
	if (to.meta.isAuth !== undefined && !to.meta.isAuth) {
		next();
		NProgress.done();
	} else {
		if (!token) {
			next(`/login?redirect=${to.path}&params=${JSON.stringify(to.query ? to.query : to.params)}`);
			Session.clear();
			NProgress.done();
		} else if (token && to.path === '/login') {
			next('/home');
			NProgress.done();
		} else {
			const storesRoutesList = useRoutesList(pinia);
			const { routesList } = storeToRefs(storesRoutesList);
			if (routesList.value.length === 0) {
				// 后端控制路由：路由数据初始化，防止刷新时丢失
				await initBackEndControlRoutes();
				next({ path: to.path, query: to.query });
			} else {
				next();
			}
		}
	}
});

/**
 * 处理 URL 中的 access_token 参数
 * @description 检测并处理 URL 中的 access_token，支持任意页面携带 token 访问
 * @param to 目标路由
 * @returns 如果检测到 token 返回清理令牌后的重定向目标，否则返回 undefined
 */
function handleAccessTokenFromUrl(to: RouteLocationNormalized): RouteLocationRaw | undefined {
	const accessToken = getFirstQueryValue(to.query.access_token);
	if (!accessToken) return undefined;

	// 清除旧会话
	Session.clear();

	// 保存新的 token 到 Session
	Session.set('token', accessToken);

	// 如果 URL 中还有 refresh_token，也一并保存
	const refreshToken = getFirstQueryValue(to.query.refresh_token);
	if (refreshToken) {
		Session.set('refresh_token', refreshToken);
	}

	// 移除 URL 中的令牌参数后回到原页面，支持移动端 webview 一次直达。
	const nextQuery = { ...to.query };
	delete nextQuery.access_token;
	delete nextQuery.refresh_token;

	return {
		path: to.path,
		query: nextQuery,
		replace: true,
	};
}

/**
 * 提取路由 query 参数的字符串值
 * @description Vue Router 的 LocationQuery 允许同名参数重复，类型为 string | null | (string | null)[]。
 * 直接 as string 断言在数组情况下会保留原始数组，导致后续字符串操作静默出错；
 * 此函数统一取首个字符串值，兼容单值和多值两种形式。
 * @param value query 中某个参数的原始值
 * @returns 首个字符串值；不存在或非字符串时返回空字符串
 */
function getFirstQueryValue(value: unknown): string {
	if (Array.isArray(value)) {
		const firstValue = value[0];
		return typeof firstValue === 'string' ? firstValue : '';
	}
	return typeof value === 'string' ? value : '';
}


// 路由加载后
router.afterEach(() => {
	NProgress.done();
});

// 导出路由
export default router;
