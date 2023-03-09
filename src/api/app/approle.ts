import request from '/@/utils/request';

export function fetchList(query: any) {
	return request({
		url: '/app/approle/page',
		method: 'get',
		params: query,
	});
}

export function list() {
	return request({
		url: '/app/approle/list',
		method: 'get',
	});
}

export function addObj(obj: any) {
	return request({
		url: '/app/approle',
		method: 'post',
		data: obj,
	});
}

export function getObj(id: string) {
	return request({
		url: '/app/approle/' + id,
		method: 'get',
	});
}

export function delObj(ids?: object) {
	return request({
		url: '/app/approle',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj: any) {
	return request({
		url: '/app/approle',
		method: 'put',
		data: obj,
	});
}

export function fetchRoleTree(roleId: string) {
	return request({
		url: '/app/appmenu/tree/' + roleId,
		method: 'get',
	});
}

export function permissionUpd(roleId: string, menuIds: string) {
	return request({
		url: '/app/approle/menu',
		method: 'put',
		data: {
			roleId: roleId,
			menuIds: menuIds,
		},
	});
}

export function getDetails(obj: Object) {
	return request({
		url: '/app/approle/details/' + obj,
		method: 'get',
	});
}

export function getDetailsByCode(obj: Object) {
	return request({
		url: '/app/approle/detailsByCode/' + obj,
		method: 'get',
	});
}

export function validateApproleName(rule: any, value: any, callback: any, isEdit: boolean) {
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

export function validateAppRoleCode(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}
	getDetailsByCode(value).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色标识已经存在'));
		} else {
			callback();
		}
	});
}
