import request from '/@/utils/request';

export function fetchList(query: object) {
	return request({
		url: '/admin/token/page',
		method: 'post',
		data: query,
	});
}

export function delObj(accessTokens: string[]) {
	return request({
		url: '/admin/token/delete',
		method: 'delete',
		data: accessTokens,
	});
}
