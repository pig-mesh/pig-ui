import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/pay/notify/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/pay/notify',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/pay/notify/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/pay/notify',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/pay/notify',
		method: 'put',
		data: obj,
	});
}
