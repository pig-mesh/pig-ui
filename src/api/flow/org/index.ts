import request from '/@/utils/request';
import { AxiosPromise } from 'axios';

export function orgTree(type: String, deptId: Number): AxiosPromise<[]> {
	return request({
		url: '/task/org/tree',
		method: 'get',
		params: { type: type, deptId: deptId },
	});
}

export function orgTreeSearcheUser(param:Object): AxiosPromise<[]> {
	return request({
		url: '/task/org/tree/user/search',
		method: 'get',
		params:param
	});
}
