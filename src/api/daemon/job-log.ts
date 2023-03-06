import request from '/@/utils/request';

export function fetchList(query: any) {
	return request({
		url: '/admin/sys-job-log/page',
		method: 'get',
		params: query,
	});
}

export function delObjs(ids: object) {
	return request({
		url: '/admin/sys-job-log',
		method: 'delete',
		data: ids,
	});
}
