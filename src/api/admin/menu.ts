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

export const update = (data: Object) => {
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
