import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/gen/fieldtype/page',
		method: 'get',
		params: query,
	});
}

export function list(query?: Object) {
	return request({
		url: '/gen/fieldtype/list',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/gen/fieldtype',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/gen/fieldtype/details/' + id,
		method: 'get',
	});
}

export function getObjDetails(obj?: object) {
	return request({
		url: '/gen/fieldtype/details',
		method: 'get',
		params: obj,
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/gen/fieldtype',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/gen/fieldtype',
		method: 'put',
		data: obj,
	});
}

export function validateColumnType(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ columnType: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('类型已经存在'));
		} else {
			callback();
		}
	});
}
