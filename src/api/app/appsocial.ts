import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/app/appsocial/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/app/appsocial',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/app/appsocial/' + id,
		method: 'get',
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/app/appsocial',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/app/appsocial',
		method: 'put',
		data: obj,
	});
}
