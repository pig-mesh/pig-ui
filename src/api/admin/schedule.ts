import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/schedule/page',
		method: 'get',
		params: query,
	});
}

export function list(query?: Object) {
	return request({
		url: '/admin/schedule/list',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/schedule',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/schedule/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/admin/schedule',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/schedule',
		method: 'put',
		data: obj,
	});
}
