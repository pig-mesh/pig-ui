import request from '/@/utils/request';

export function fetchList(query: any) {
	return request({
		url: '/app/appuserrole/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj: any) {
	return request({
		url: '/app/appuserrole',
		method: 'post',
		data: obj,
	});
}

export function getObj(id: string) {
	return request({
		url: '/app/appuserrole/' + id,
		method: 'get',
	});
}

export function delObj(id: string) {
	return request({
		url: '/app/appuserrole/' + id,
		method: 'delete',
	});
}

export function putObj(obj: any) {
	return request({
		url: '/app/appuserrole',
		method: 'put',
		data: obj,
	});
}
