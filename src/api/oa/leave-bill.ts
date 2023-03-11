import request from '/@/utils/request';

export function fetchList(query) {
	return request({
		url: '/act/leave-bill/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj) {
	return request({
		url: '/act/leave-bill',
		method: 'post',
		data: obj,
	});
}

export function getObj(id) {
	return request({
		url: '/act/leave-bill/' + id,
		method: 'get',
	});
}

export function submit(id) {
	return request({
		url: '/act/leave-bill/submit/' + id,
		method: 'get',
	});
}

export function delObj(ids?: Object) {
	return request({
		url: '/act/leave-bill',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj) {
	return request({
		url: '/act/leave-bill/',
		method: 'put',
		data: obj,
	});
}
