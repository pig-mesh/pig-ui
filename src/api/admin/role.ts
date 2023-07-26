import request from '/@/utils/request';

export const list = (params?: Object) => {
	return request({
		url: '/admin/role/list',
		method: 'get',
		params,
	});
};

export const pageList = (params?: Object) => {
	return request({
		url: '/admin/role/page',
		method: 'get',
		params,
	});
};

export const deptRoleList = () => {
	return request({
		url: '/admin/role/list',
		method: 'get',
	});
};

export const getObj = (id: string) => {
	return request({
		url: '/admin/role/details/' + id,
		method: 'get',
	});
};

export const getObjDetails = (obj: object) => {
	return request({
		url: '/admin/role/details',
		method: 'get',
		params: obj,
	});
};

export const addObj = (obj: Object) => {
	return request({
		url: '/admin/role',
		method: 'post',
		data: obj,
	});
};

export const putObj = (obj: Object) => {
	return request({
		url: '/admin/role',
		method: 'put',
		data: obj,
	});
};

export const delObj = (ids: Object) => {
	return request({
		url: '/admin/role',
		method: 'delete',
		data: ids,
	});
};

export const permissionUpd = (roleId: string, menuIds: string) => {
	return request({
		url: '/admin/role/menu',
		method: 'put',
		data: {
			roleId: roleId,
			menuIds: menuIds,
		},
	});
};

export const fetchRoleTree = (roleId: string) => {
	return request({
		url: '/admin/menu/tree/' + roleId,
		method: 'get',
	});
};

export function validateRoleCode(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ roleCode: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色标识已经存在'));
		} else {
			callback();
		}
	});
}

export function validateRoleName(rule: any, value: any, callback: any, isEdit: boolean) {
	if (isEdit) {
		return callback();
	}

	getObjDetails({ roleName: value }).then((response) => {
		const result = response.data;
		if (result !== null) {
			callback(new Error('角色名称已经存在'));
		} else {
			callback();
		}
	});
}
