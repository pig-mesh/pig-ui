import request from '/@/utils/request';

export const pageList = (params?: Object) => {
	return request({
		url: '/admin/log/page',
		method: 'get',
		params,
	});
};

export const delObj = (ids: object) => {
	return request({
		url: '/admin/log',
		method: 'delete',
		data: ids,
	});
};
