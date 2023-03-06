import request from '/@/utils/request';

export function fetchPage(query?: Object) {
	return request({
		url: '/admin/tenant/page',
		method: 'get',
		params: query,
	});
}

export function fetchList(query?: object) {
	return request({
		url: '/admin/tenant/list',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/tenant',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/tenant',
		method: 'get',
		params: { id },
	});
}

export function delObj(ids?: Object) {
	return request({
		url: '/admin/tenant',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/tenant',
		method: 'put',
		data: obj,
	});
}
