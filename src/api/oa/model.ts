import request from '/@/utils/request';

export function fetchList(query) {
	return request({
		url: '/act/model',
		method: 'get',
		params: query,
	});
}

export function delObj(ids: Object) {
	return request({
		url: '/act/model',
		method: 'delete',
		data: ids,
	});
}

export function deploy(id) {
	return request({
		url: '/act/model/deploy/' + id,
		method: 'post',
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/act/model/insert',
		method: 'post',
		data: obj,
	});
}

export function getObj(id) {
	return request({
		url: '/act/log/' + id,
		method: 'get',
	});
}

export function putObj(obj) {
	return request({
		url: '/act/log/',
		method: 'put',
		data: obj,
	});
}
