import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/param/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/param',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/param/details/' + id,
		method: 'get',
	});
}

export function delObj(ids?: Object) {
	return request({
		url: '/admin/param',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/param',
		method: 'put',
		data: obj,
	});
}

export function refreshCache() {
	return request({
		url: '/admin/param/sync',
		method: 'put',
	});
}

export function getObjDetails(obj?: object) {
	return request({
		url: '/admin/param/details',
		method: 'get',
		params: obj,
	});
}

export function validateParamsCode(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ publicKey: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('参数编码已经存在'));
		} else {
			callback();
		}
	});
}

export function validateParamsName(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ publicName: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('参数名称已经存在'));
		} else {
			callback();
		}
	});
}
