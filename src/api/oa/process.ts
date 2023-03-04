import request from '/@/utils/request';

export function fetchList(query) {
	return request({
		url: '/admin/process',
		method: 'get',
		params: query,
	});
}

export function delObj(id) {
	return request({
		url: '/admin/process/' + id,
		method: 'delete',
	});
}

export function status(id, type) {
	return request({
		url: '/admin/process/status/' + id + '/' + type,
		method: 'put',
	});
}
