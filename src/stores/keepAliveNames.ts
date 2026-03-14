import { defineStore } from 'pinia';

/**
 * 路由缓存列表
 * @methods setCacheKeepAlive 设置要缓存的路由 names（开启 Tagsview）
 * @methods addCachedView 添加要缓存的路由 names（关闭 Tagsview）
 * @methods delCachedView 删除要缓存的路由 names（关闭 Tagsview）
 * @methods delOthersCachedViews 右键菜单`关闭其它`，删除要缓存的路由 names（关闭 Tagsview）
 * @methods delAllCachedViews 右键菜单`全部关闭`，删除要缓存的路由 names（关闭 Tagsview）
 */
export const useKeepALiveNames = defineStore('keepALiveNames', {
	state: (): KeepAliveNamesState => ({
		keepAliveNames: [],
		cachedViews: [],
		// 记录已关闭的路由路径，用于强制刷新
		closedRoutes: new Set<string>(),
	}),
	actions: {
		async setCacheKeepAlive(data: Array<string>) {
			this.keepAliveNames = data;
		},
		async addCachedView(view: any) {
			if (view.meta.isKeepAlive && !this.cachedViews.includes(view.name)) {
				this.cachedViews.push(view.name);
			}
		},
		async delCachedView(view: any) {
			const index = this.cachedViews.indexOf(view.name);
			if (index > -1) {
				this.cachedViews.splice(index, 1);
			}
			// 记录已关闭的路由路径
			if (view.path) {
				this.closedRoutes.add(view.path);
			}
		},
		async delOthersCachedViews(view: any) {
			if (view.meta.isKeepAlive) this.cachedViews = [view.name];
			else this.cachedViews = [];
		},
		async delAllCachedViews() {
			this.cachedViews = [];
		},
		// 检查并清除已关闭标记（当路由重新打开时调用）
		checkAndClearClosedRoute(path: string): boolean {
			if (this.closedRoutes.has(path)) {
				this.closedRoutes.delete(path);
				return true; // 需要刷新
			}
			return false;
		},
	},
});
