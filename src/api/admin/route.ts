import request from '/@/utils/request';

export const fetchList = (query?: Object) => {
	return request({
		url: '/admin/route',
		method: 'get',
		params: query,
	});
};

export const putObj = (obj?: object) => {
	return request({
		url: '/admin/route',
		method: 'put',
		data: obj,
	});
};

export const refreshObj = () => {
	return request({
		url: '/actuator/gateway/refresh',
		method: 'post',
	});
};
