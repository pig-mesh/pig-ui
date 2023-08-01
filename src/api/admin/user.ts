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
		url: '/admin/user/details/' + id,
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
		url: '/admin/user/details',
		method: 'get',
		params: obj,
	});
}

// 更改个人信息
export function editInfo(obj: Object) {
	return request({
		url: '/admin/user/personal/edit',
		method: 'put',
		data: obj,
	});
}

// 更改个人密码
export function password(obj: Object) {
	return request({
		url: '/admin/user/personal/password',
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

export function checkPassword(password: string) {
	return request({
		url: '/admin/user/check',
		method: 'post',
		params: {
			password,
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
	const flag = new RegExp(/^([a-z\d]+?)$/).test(value);
	if (!flag) {
		callback(new Error('用户名支持小写英文、数字'));
	}

	if (isEdit) {
		return callback();
	}

	getDetails({ username: value }).then((response) => {
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
	getDetails({ phone: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('手机号已经存在'));
		} else {
			callback();
		}
	});
}
