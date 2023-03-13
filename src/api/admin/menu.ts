import request from '/@/utils/request';

export const pageList = (params?: Object) => {
	return request({
		url: '/admin/menu/tree',
		method: 'get',
		params,
	});
};

export const info = (id: String) => {
	return request({
		url: `/admin/menu/${id}`,
		method: 'get',
	});
};

export const save = (data: Object) => {
	return request({
		url: '/admin/menu',
		method: 'post',
		data: data,
	});
};

export const putObj = (data: Object) => {
	return request({
		url: '/admin/menu',
		method: 'put',
		data: data,
	});
};

export const addObj = (data: Object) => {
	return request({
		url: '/admin/menu',
		method: 'post',
		data: data,
	});
};

export const delObj = (id: string) => {
	return request({
		url: '/admin/menu/' + id,
		method: 'delete',
	});
};

/**
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getAdminMenu 获取后端动态路由菜单(admin)
 */
export function useMenuApi() {
	return {
		getAdminMenu: (params?: object) => {
			return request({
				url: '/admin/menu',
				method: 'get',
				params,
			});
		},
	};
}
