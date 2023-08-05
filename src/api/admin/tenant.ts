import request from '/@/utils/request';

export function fetchPage(query?: Object) {
	return request({
		url: '/admin/tenant/page',
		method: 'get',
		params: query,
	});
}

export function fetchList(query?: object) {
	return request({
		url: '/admin/tenant/list',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/tenant',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/tenant/details/' + id,
		method: 'get',
	});
}

export function getObjDetails(obj?: object) {
	return request({
		url: '/admin/tenant/details',
		method: 'get',
		params: obj,
	});
}

export function delObj(ids?: Object) {
	return request({
		url: '/admin/tenant',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/tenant',
		method: 'put',
		data: obj,
	});
}

export function validateTenantName(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ name: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('租户名称已经存在'));
		} else {
			callback();
		}
	});
}

export function validateTenantCode(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ code: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('租户编码已经存在'));
		} else {
			callback();
		}
	});
}

export function treemenu() {
	return request({
		url: '/admin/tenant/tree/menu',
		method: 'get',
	});
}
