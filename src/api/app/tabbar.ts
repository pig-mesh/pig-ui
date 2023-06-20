import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/app/appTabbar/list',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/app/appTabbar',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/app/appTabbar/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/app/appTabbar',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/app/appTabbar',
		method: 'put',
		data: obj,
	});
}
