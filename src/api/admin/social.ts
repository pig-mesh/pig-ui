import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/social/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/social',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/social/getById/' + id,
		method: 'get',
	});
}

export function delObj(ids?: Object) {
	return request({
		url: '/admin/social',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/social',
		method: 'put',
		data: obj,
	});
}
