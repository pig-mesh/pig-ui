## 登录流程路由拦截

### 登录

登录通过 pinia 调用一步接口，将返回的 token 通过 `Session.set('token', res.access_token);` 保存下来。

```
export const Session = {
	// 设置临时缓存
	set(key: string, val: any) {
		if (key === 'token') return Cookies.set(key, val);
		window.sessionStorage.setItem(key, JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		if (key === 'token') return Cookies.get(key);
		let json = <string>window.sessionStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) {
		if (key === 'token') return Cookies.remove(key);
		window.sessionStorage.removeItem(key);
	},
	// 移除全部临时缓存
	clear() {
		Cookies.remove('token');
		window.sessionStorage.clear();
	},
};
```

根据代码可以看出 如果是存储的是 token 则存储到 `cookies` 中 否则存储到 `sessionStorage` 中

### 路由拦截

通过路由的加载前拦截中

```javascript
router.beforeEach(async (to, from, next) => {
	NProgress.configure({ showSpinner: false });
	if (to.meta.title) NProgress.start();
	const token = Session.getToken();
	if (to.path === '/login' && !token) {
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
```

显而易见，如果没有 token 信息则跳转到登录页面并且带着当前页面的信息，以便登录成功后跳转回之前的页面
有 token 则处理是不是 login 页面。
在不是 login 页面的时候 查询 pinia 中是否有存储的路由和菜单信息，如果没有则进行路由初始化

```javascript
export async function initBackEndControlRoutes() {
	// 界面 loading 动画开始执行
	if (window.nextLoading === undefined) NextLoading.start();
	// 无 token 停止执行下一步
	if (!Session.getToken()) return false;
	// 触发初始化用户信息 pinia
	await useUserInfo().setUserInfos();
	// 获取路由菜单数据
	const res = await getBackEndControlRoutes();
	// 无登录权限时，添加判断
	// https://gitee.com/lyt-top/vue-next-admin/issues/I64HVO
	if ((res.data || []).length <= 0) return Promise.resolve(true);
	// 存储接口原始路由（未处理component），根据需求选择使用
	useRequestOldRoutes().setRequestOldRoutes(JSON.parse(JSON.stringify(res.data)));
	// 处理路由（component），替换 dynamicRoutes（/@/router/route）第一个顶级 children 的路由
	dynamicRoutes[0].children = [...home, ...(await backEndComponent(res.data)), ...staticConfigRoutes];
	// 添加动态路由
	await setAddRoute();
	// 设置路由到 pinia routesList 中（已处理成多级嵌套路由）及缓存多级嵌套数组处理后的一维数组
	await setFilterMenuAndCacheTagsViewRoutes();
}
```

1. 整体逻辑是校验 token 是否存储，
2. 获取登录用户的信息 `await useUserInfo().setUserInfos()`
3. 获取登录用户的菜单信息 `const res = await getBackEndControlRoutes()`
4. 讲菜单信息动态添加到前端可以读取到的内容中，供左侧菜单使用 `dynamicRoutes[0].children = [...home,...await backEndComponent(res.data), ...staticConfigRoutes]` 这里我们将 `home` 放在菜单的第一个位置上
5. 根据菜单信息生成路由信息 `await setAddRoute();`
6. 保存路信息到 pinia 中 `await setFilterMenuAndCacheTagsViewRoutes();`

### 拦截请求增加 token

在使用 axios 发送请求时，拦截请求信息，如果有 token 信息则带着 token 信息进行请求

```javascript
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // get查询参数序列化
    if (config.method === 'get') {
        config.paramsSerializer = (params: any) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }
    // 在发送请求之前做些什么 token
    if (Session.getToken()) {
        config.headers!['Authorization'] = `Bearer ${Session.getToken()}`;
    }
    return config;
},
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);
```

发送请求之后如果后端返回信息中不是 200 表明请求有异常，针对 `424` 进行令牌过期提醒，并跳转丁路界面进行重新登录

```javascript
service.interceptors.response.use(
	(res: any) => {
		if (res.data.code === 1) {
			throw res.data;
		}
		return res.data;
	},
	(error) => {
		const status = Number(error.response.status) || 200;
		const message = error.response.data.msg || errorCode[status] || errorCode['default'];
		if (status === 424) {
			ElMessageBox.confirm('令牌状态已过期，请点击重新登录', '系统提示', {
				confirmButtonText: '重新登录',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					Session.clear(); // 清除浏览器全部临时缓存
					window.location.href = '/'; // 去登录页
					return;
				})
				.catch(() => {});
		}

		if (status !== 200 || error.response.data.code === 1) {
			ElMessage.error(message);
			return Promise.reject(new Error(message));
		}
		return Promise.reject(error);
	}
);
```
