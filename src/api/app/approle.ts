import request from '/@/utils/request';

export interface AppRoleTabbarRole {
	roleId: string;
	roleName: string;
	roleCode: string;
	roleDesc?: string;
}

export interface AppTabbarItem {
	id: number | string;
	name: string;
	selected: string;
	unselected: string;
	link: Record<string, any> | string;
	sortOrder?: number;
	loginFlag?: string;
}

export interface AppRoleTabbarPayload {
	roleId: string;
	tabbarIds: number[];
}

export function fetchList(query?: Record<string, any>) {
	return request({
		url: '/app/role-tabbar/roles',
		method: 'get',
		params: query,
	});
}

export function getAppTabbars() {
	return request({
		url: '/app/role-tabbar/tabbar',
		method: 'get',
	});
}

export function getRoleTabbars(roleId: string) {
	return request({
		url: `/app/role-tabbar/${roleId}`,
		method: 'get',
	});
}

export function updateRoleTabbars(data: AppRoleTabbarPayload) {
	return request({
		url: '/app/role-tabbar',
		method: 'put',
		data,
	});
}
