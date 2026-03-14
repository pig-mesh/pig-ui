import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/gen/group/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/gen/group',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/gen/group/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/gen/group',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/gen/group',
		method: 'put',
		data: obj,
	});
}

export function list() {
	return request({
		url: '/gen/group/list',
		method: 'get',
	});
}
