import request from '/@/utils/request';

export const getDicts = (type: String) => {
	return request({
		url: `/admin/dict/type/${type}`,
		method: 'get',
	});
};

export function fetchList(query: any) {
	return request({
		url: '/admin/dict/list',
		method: 'get',
		params: query,
	});
}

export function fetchItemList(query: any) {
	return request({
		url: '/admin/dict/item/page',
		method: 'get',
		params: query,
	});
}

export function addItemObj(obj: any) {
	return request({
		url: '/admin/dict/item',
		method: 'post',
		data: obj,
	});
}

export function getItemObj(id: string) {
	return request({
		url: '/admin/dict/item/details/' + id,
		method: 'get',
	});
}

export function getItemDetails(obj: object) {
	return request({
		url: '/admin/dict/item/details',
		method: 'get',
		params: obj,
	});
}

export function delItemObj(id: string) {
	return request({
		url: '/admin/dict/item/' + id,
		method: 'delete',
	});
}

export function putItemObj(obj: any) {
	return request({
		url: '/admin/dict/item',
		method: 'put',
		data: obj,
	});
}

export function addObj(obj: any) {
	return request({
		url: '/admin/dict',
		method: 'post',
		data: obj,
	});
}

export function getObj(id: string) {
	return request({
		url: '/admin/dict/details/' + id,
		method: 'get',
	});
}

export function getObjDetails(obj: object) {
	return request({
		url: '/admin/dict/details',
		method: 'get',
		params: obj,
	});
}

export function delObj(ids: Object) {
	return request({
		url: '/admin/dict',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj: any) {
	return request({
		url: '/admin/dict',
		method: 'put',
		data: obj,
	});
}

export function refreshCache() {
	return request({
		url: '/admin/dict/sync',
		method: 'put',
	});
}

export function validateDictType(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ dictType: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('字典类型已经存在'));
		} else {
			callback();
		}
	});
}

export function validateDictItemLabel(rule: any, value: any, callback: any, type: string, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getItemDetails({ dictType: type, label: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('标签已经存在'));
		} else {
			callback();
		}
	});
}
