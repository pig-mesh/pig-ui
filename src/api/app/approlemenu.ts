import request from '/@/utils/request';

export function fetchList(query: any) {
	return request({
		url: '/app/approlemenu/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj: any) {
	return request({
		url: '/app/approlemenu',
		method: 'post',
		data: obj,
	});
}

export function getObj(id: string) {
	return request({
		url: '/app/approlemenu/' + id,
		method: 'get',
	});
}

export function delObj(id: string) {
	return request({
		url: '/app/approlemenu/' + id,
		method: 'delete',
	});
}

export function putObj(obj: string) {
	return request({
		url: '/app/approlemenu',
		method: 'put',
		data: obj,
	});
}
