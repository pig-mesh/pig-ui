import request from '/@/utils/request';

export function fetchApiKeyList() {
	return request({
		url: '/admin/api-key/list',
		method: 'get',
	});
}

export function createApiKey(data: object, password: string) {
	return request({
		url: '/admin/api-key',
		method: 'post',
		data: { ...data, password },
	});
}

export function updateApiKey(data: object) {
	return request({
		url: '/admin/api-key',
		method: 'put',
		data,
	});
}

export function deleteApiKey(id: number) {
	return request({
		url: '/admin/api-key/' + id,
		method: 'delete',
	});
}

export function fetchApiKeyPage(params?: object) {
	return request({
		url: '/admin/api-key/page',
		method: 'get',
		params,
	});
}

export function deleteApiKeyBatch(ids: number[]) {
	return request({
		url: '/admin/api-key',
		method: 'delete',
		data: ids,
	});
}
