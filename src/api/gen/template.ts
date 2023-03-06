import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/gen/template/page',
		method: 'get',
		params: query,
	});
}

export function list() {
	return request({
		url: '/gen/template/list',
		method: 'get',
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/gen/template',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/gen/template/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/gen/template',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/gen/template',
		method: 'put',
		data: obj,
	});
}
