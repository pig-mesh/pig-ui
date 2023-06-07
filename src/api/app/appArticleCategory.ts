import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/app/appArticleCategory/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/app/appArticleCategory',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/app/appArticleCategory/' + id,
		method: 'get',
	});
}

export function getObjList() {
	return request({
		url: '/app/appArticleCategory/list',
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/app/appArticleCategory',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/app/appArticleCategory',
		method: 'put',
		data: obj,
	});
}
