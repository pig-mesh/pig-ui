import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/app/page/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/app/appPage',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/app/appPage/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/app/page',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/app/appPage',
		method: 'put',
		data: obj,
	});
}
