import request from '/@/utils/request';

export function getPage(query) {
	return request({
		url: '/mp/wx-auto-reply/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj) {
	return request({
		url: '/mp/wx-auto-reply',
		method: 'post',
		data: obj,
	});
}

export function getObj(id) {
	return request({
		url: '/mp/wx-auto-reply/' + id,
		method: 'get',
	});
}

export function delObj(id) {
	return request({
		url: '/mp/wx-auto-reply/' + id,
		method: 'delete',
	});
}

export function putObj(obj) {
	return request({
		url: '/mp/wx-auto-reply',
		method: 'put',
		data: obj,
	});
}
