import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/client/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/client',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/client/' + id,
		method: 'get',
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/admin/client',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/client',
		method: 'put',
		data: obj,
	});
}

export function refreshCache() {
	return request({
		url: '/admin/client/sync',
		method: 'put',
	});
}

export function getDetails(obj: Object) {
	return request({
		url: '/admin/client/getClientDetailsById/' + obj,
		method: 'get',
	});
}

export function validateclientId(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}
	getDetails(value).then((res) => {
		const result = res.data;
		if (result !== null) {
			callback(new Error('编号已经存在'));
		} else {
			callback();
		}
	});
}
