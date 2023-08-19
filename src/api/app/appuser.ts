import request from '/@/utils/request';

export function fetchList(query: any) {
	return request({
		url: '/app/appuser/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj: any) {
	return request({
		url: '/app/appuser',
		method: 'post',
		data: obj,
	});
}

export function getObj(id: string) {
	return request({
		url: '/app/appuser/details/' + id,
		method: 'get',
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/app/appuser',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj: any) {
	return request({
		url: '/app/appuser',
		method: 'put',
		data: obj,
	});
}

export function getDetails(obj: Object) {
	return request({
		url: '/app/appuser/details',
		method: 'get',
		params: obj,
	});
}

export function validateUsername(rule: any, value: any, callback: any, isEdit: boolean) {
	const flag = new RegExp(/^([a-z\d]+?)$/).test(value);
	if (!flag) {
		callback(new Error('用户名支持小写英文、数字'));
	}

	if (isEdit) {
		return callback();
	}

	getDetails({
		username: value,
	}).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('用户名已经存在'));
		} else {
			callback();
		}
	});
}

export function validatePhone(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}
	getDetails({
		phone: value,
	}).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('手机号已经存在'));
		} else {
			callback();
		}
	});
}
