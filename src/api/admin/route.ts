import request from '/@/utils/request';

export const fetchList = (query?: Object) => {
	return request({
		url: '/admin/route',
		method: 'get',
		params: query,
	});
};

export const addObj = (obj?: object) => {
	return request({
		url: '/admin/route',
		method: 'post',
		data: obj,
	});
};

export const deleteObj = (routeId?: string) => {
	return request({
		url: '/admin/route/' + routeId,
		method: 'delete'
	});
};

export const refreshObj = () => {
	return request({
		url: '/actuator/gateway/refresh',
		method: 'post',
	});
};
