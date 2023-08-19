import request from '/@/utils/request';

export const deptTree = (params?: Object) => {
	return request({
		url: '/admin/dept/tree',
		method: 'get',
		params,
	});
};

export const addObj = (obj: Object) => {
	return request({
		url: '/admin/dept',
		method: 'post',
		data: obj,
	});
};

export const getObj = (id: string) => {
	return request({
		url: '/admin/dept/' + id,
		method: 'get',
	});
};

export const delObj = (id: string) => {
	return request({
		url: '/admin/dept/' + id,
		method: 'delete',
	});
};

export const putObj = (obj: Object) => {
	return request({
		url: '/admin/dept',
		method: 'put',
		data: obj,
	});
};

export const syncUser = () => {
	return request({
		url: '/admin/connect/sync/ding/user',
		method: 'post',
	});
};

export const syncDept = () => {
	return request({
		url: '/admin/connect/sync/ding/dept',
		method: 'post',
	});
};

export const syncCpUser = () => {
	return request({
		url: '/admin/connect/sync/cp/user',
		method: 'post',
	});
};

export const syncCpDept = () => {
	return request({
		url: '/admin/connect/sync/cp/dept',
		method: 'post',
	});
};
