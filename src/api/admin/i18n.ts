import axios from 'axios';
import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { decrypt } from '/@/utils/apiCrypto';

export function fetchList(query?: Object) {
	return request({
		url: '/admin/i18n/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/i18n',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/i18n/details/' + id,
		method: 'get',
	});
}

export function getObjDetails(obj?: object) {
	return request({
		url: '/admin/i18n/details',
		method: 'get',
		params: obj,
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/admin/i18n',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/i18n',
		method: 'put',
		data: obj,
	});
}

export function refreshCache() {
	return request({
		url: '/admin/i18n/sync',
		method: 'put',
	});
}

/**
 *  注意这里使用原声axios对象进行操作，request 实例中依赖i18n 所以还没有初始化会报错
 * @returns
 */
export async function info() {
	const headers: Record<string, string> = {};

	const token = Session.getToken();
	if (token) headers.Authorization = `Bearer ${token}`;

	const version = import.meta.env.VITE_GRAY_VERSION;
	if (version) headers.VERSION = version;

	const timeout = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 50000;
	const res = await axios.get(`${baseURL}/admin/i18n/info`, { headers, timeout });

	if (res.data?.encryption) {
		return decrypt(res.data.encryption);
	}

	return res.data;
}

export function validateName(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ name: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			const message = t ? t('i18n.nameExists') : 'I18n key already exists';
			callback(new Error(message));
		} else {
			callback();
		}
	});
}

export function validateZhCn(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ zhCn: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			const message = t ? t('i18n.zhCnExists') : 'Chinese translation already exists';
			callback(new Error(message));
		} else {
			callback();
		}
	});
}

export function validateEn(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ en: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			const message = t ? t('i18n.enExists') : 'English translation already exists';
			callback(new Error(message));
		} else {
			callback();
		}
	});
}
