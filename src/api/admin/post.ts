import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/post/page',
		method: 'get',
		params: query,
	});
}

export const list = (params?: Object) => {
	return request({
		url: '/admin/post/list',
		method: 'get',
		params,
	});
};

export function addObj(obj?: Object) {
	return request({
		url: '/admin/post',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/post/' + id,
		method: 'get',
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/admin/post',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/post',
		method: 'put',
		data: obj,
	});
}
