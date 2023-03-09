import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/pay/channel/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/pay/channel',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/pay/channel/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/pay/channel',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/pay/channel',
		method: 'put',
		data: obj,
	});
}
