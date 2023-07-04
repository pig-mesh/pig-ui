import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/audit/page',
		method: 'get',
		params: query,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/audit/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/admin/audit/delete',
		method: 'delete',
		data: ids,
	});
}
