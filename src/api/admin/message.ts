import request from '/@/utils/request';

export function fetchUserMessageReadList(query?: Object) {
	return request({
		url: '/admin/sysMessage/user/read/page',
		method: 'get',
		params: query,
	});
}

export const sendMobileInnerCode = (mobile: string) => {
	return request({
		url: '/admin/sysMessage/send/smsCode',
		method: 'get',
		params: { mobile, registered: false },
	});
};

export function readUserMessage(params?: object) {
	return request({
		url: '/admin/sysMessage/read',
		method: 'post',
		params: params,
	});
}

export function fetchUserMessageList(query?: Object) {
	return request({
		url: '/admin/sysMessage/user/page',
		method: 'get',
		params: query,
	});
}

export function fetchList(query?: Object) {
	return request({
		url: '/admin/sysMessage/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/sysMessage',
		method: 'post',
		data: obj,
	});
}

export function sendObj(params?: object) {
	return request({
		url: '/admin/sysMessage/send',
		method: 'post',
		params: params,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/sysMessage/' + id,
		method: 'get',
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/admin/sysMessage',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/sysMessage',
		method: 'put',
		data: obj,
	});
}

export function sendSms(params?: object) {
	return request({
		url: '/admin/sysMessage/send/sms',
		method: 'post',
		data: params,
	});
}

export function sendEmail(params?: object) {
	return request({
		url: '/admin/sysMessage/send/email',
		method: 'post',
		data: params,
	});
}

export function sendHook(params?: object) {
	return request({
		url: '/admin/sysMessage/send/hook',
		method: 'post',
		data: params,
	});
}

export function list(params?: object) {
	return request({
		url: '/admin/sysMessage/list/hook',
		method: 'get',
		params: params,
	});
}
