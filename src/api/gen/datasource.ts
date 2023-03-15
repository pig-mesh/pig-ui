import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/gen/dsconf/page',
		method: 'get',
		params: query,
	});
}

export function list(query?: Object) {
	return request({
		url: '/gen/dsconf/list',
		method: 'get',
		params: query,
	});
}

export function listTable(query?: Object) {
	return request({
		url: '/gen/dsconf/table/list',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/gen/dsconf',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/gen/dsconf/' + id,
		method: 'get',
	});
}

export function delObj(ids?: Object) {
	return request({
		url: '/gen/dsconf',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/gen/dsconf',
		method: 'put',
		data: obj,
	});
}
