import request from '/@/utils/request';

export const pageList = (params?: Object) => {
	return request({
		url: '/admin/user/page',
		method: 'get',
		params,
	});
};

export const addObj = (obj: Object) => {
	return request({
		url: '/admin/user',
		method: 'post',
		data: obj,
	});
};

export const getObj = (id: String) => {
	return request({
		url: '/admin/user/' + id,
		method: 'get',
	});
};

export const delObj = (ids: Object) => {
	return request({
		url: '/admin/user',
		method: 'delete',
		data: ids,
	});
};

export const putObj = (obj: Object) => {
	return request({
		url: '/admin/user',
		method: 'put',
		data: obj,
	});
};

export function getDetails(obj: Object) {
	return request({
		url: '/admin/user/details/' + obj,
		method: 'get',
	});
}

export function getDetailsByPhone(obj: Object) {
	return request({
		url: '/admin/user/detailsByPhone/' + obj,
		method: 'get',
	});
}

// 更改个人信息
export function editInfo(obj: Object) {
	return request({
		url: '/admin/user/edit',
		method: 'put',
		data: obj,
	});
}

export function password(obj: Object) {
	return request({
		url: '/admin/user/password',
		method: 'put',
		data: obj,
	});
}

export function UnbindingUser(type) {
	return request({
		url: '/admin/user/unbinding',
		method: 'post',
		params: {
			type,
		},
	});
}

/**
 * 注册用户
 */
export const registerUser = (userInfo: object) => {
	return request({
		url: '/admin/register/user',
		method: 'post',
		data: userInfo,
	});
};

export function validateUsername(rule: any, value: any, callback: any, isEdit: boolean) {
	const flag = new RegExp(/^([a-z\u4e00-\u9fa5\d]+?)$/).test(value);
	if (!flag) {
		callback(new Error('用户名支持小写英文、数字、中文'));
	}

	if (isEdit) {
		return callback();
	}

	getDetails(value).then((response) => {
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
	getDetailsByPhone(value).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('手机号已经存在'));
		} else {
			callback();
		}
	});
}
