import request from '/@/utils/request';

export type SysAreaKey = string | number;

export interface SysAreaManageNode {
	id: SysAreaKey;
	pid: SysAreaKey;
	adcode: SysAreaKey;
	name: string;
	areaType: string;
	hot: string;
	areaStatus: string;
	areaSort?: number;
	hasChildren: boolean;
	childCount: number;
	pathCodes: SysAreaKey[];
	pathName: string;
}

export interface SysAreaSortPayload {
	pid: SysAreaKey;
	areaIds: SysAreaKey[];
}

export interface SysAreaUpdatePayload {
	id: SysAreaKey;
	name: string;
	hot: string;
	areaStatus: string;
}

export function fetchTree(query?: Object) {
	return request({
		url: '/admin/sysArea/tree',
		method: 'get',
		params: query,
	});
}

export function fetchList(query?: Object) {
	return request({
		url: '/admin/sysArea/page',
		method: 'get',
		params: query,
	});
}

export function fetchManageChildren(pid: SysAreaKey) {
	return request({
		url: '/admin/sysArea/manage/children',
		method: 'get',
		params: { pid },
	});
}

export function searchManageAreas(keyword: string) {
	return request({
		url: '/admin/sysArea/manage/search',
		method: 'get',
		params: { keyword },
	});
}

export function sortAreas(data: SysAreaSortPayload) {
	return request({
		url: '/admin/sysArea/sort',
		method: 'put',
		data,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/sysArea',
		method: 'post',
		data: obj,
	});
}

export function getObj(id: SysAreaKey) {
	return request({
		url: '/admin/sysArea/details',
		method: 'get',
		params: { id },
	});
}

export function checkAdcodeExists(adcode: SysAreaKey) {
	return request({
		url: '/admin/sysArea/exists/adcode',
		method: 'get',
		params: { adcode },
	});
}

export function delObjs(ids?: Object) {
	return request({
		url: '/admin/sysArea',
		method: 'delete',
		data: ids,
	});
}

export function putObj(obj: SysAreaUpdatePayload) {
	return request({
		url: '/admin/sysArea',
		method: 'put',
		data: obj,
	});
}
