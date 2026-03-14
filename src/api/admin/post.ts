import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/post/page',
		method: 'get',
		params: query,
	});
}

export const list = (params?: Object) => {
	return request({
		url: '/admin/post/list',
		method: 'get',
		params,
	});
};

export function addObj(obj?: Object) {
	return request({
		url: '/admin/post',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/post/details/' + id,
		method: 'get',
	});
}

export function getObjDetails(obj?: object) {
	return request({
		url: '/admin/post/details',
		method: 'get',
		params: obj,
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/admin/post',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/post',
		method: 'put',
		data: obj,
	});
}

export function validatePostName(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ postName: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('岗位名称已经存在'));
		} else {
			callback();
		}
	});
}

export function validatePostCode(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ postCode: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('岗位编码已经存在'));
		} else {
			callback();
		}
	});
}
