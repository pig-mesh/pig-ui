import request from '/@/utils/request';

export function fetchList(query) {
	return request({
		url: '/admin/model',
		method: 'get',
		params: query,
	});
}

export function delObj(ids: Object) {
	return request({
		url: '/admin/model',
		method: 'delete',
		data: ids,
	});
}

export function deploy(id) {
	return request({
		url: '/admin/model/deploy/' + id,
		method: 'post',
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/model/insert',
		method: 'post',
		data: obj,
	});
}

export function getObj(id) {
	return request({
		url: '/admin/log/' + id,
		method: 'get',
	});
}

export function putObj(obj) {
	return request({
		url: '/admin/log/',
		method: 'put',
		data: obj,
	});
}
