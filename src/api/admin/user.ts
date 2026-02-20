import request from '/@/utils/request';

export const list = () => {
	return request({
		url: '/admin/user/list',
		method: 'get',
	});
};
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


export function unbindingUser(type: string) {
	return request({
		url: '/admin/user/unbinding',
		method: 'post',
		params: {
			type
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

export const resetUserPassword = (userInfo: object) => {
	return request({
		url: '/admin/register/password',
		method: 'post',
		data: userInfo,
	});
};

export const forgetUserPassword = (userInfo: {code:string}) => {
	return request({
		url: '/admin/register/forget/' + userInfo.code,
		method: 'post',
		data: userInfo,
	});
};

export function validateUsername(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
	const flag = new RegExp(/^([a-z\d]+?)$/).test(value);
	if (!flag) {
		const errorMsg = t ? t('validation.usernameFormat') : '用户名支持小写英文、数字';
		callback(new Error(errorMsg));
		return;
	}

	if (isEdit) {
		return callback();
	}

	getDetails({ username: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			const errorMsg = t ? t('validation.usernameExists') : '用户名已经存在';
			callback(new Error(errorMsg));
		} else {
			callback();
		}
	});
}

export function validatePhone(rule: any, value: any, callback: any, isEdit: boolean, originalPhone?: string, t?: any) {
	// 如果是编辑状态且手机号未改变，跳过校验
	if (isEdit && originalPhone && value === originalPhone) {
		return callback();
	}
	getDetails({ phone: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			const errorMsg = t ? t('validation.phoneExists') : '手机号已经存在';
			callback(new Error(errorMsg));
		} else {
			callback();
		}
	});
}

/**
 * 同步钉钉用户
 */
export const syncUser = () => {
	return request({
		url: '/admin/connect/sync/ding/user',
		method: 'post',
	});
};

/**
 * 同步企业微信用户
 */
export const syncCpUser = () => {
	return request({
		url: '/admin/connect/sync/cp/user',
		method: 'post',
	});
};
