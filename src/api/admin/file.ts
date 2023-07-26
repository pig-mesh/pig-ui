import request from '/@/utils/request';

export function fileList(query?: Object) {
	return request({
		url: '/admin/sys-file/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/admin/sys-file',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/admin/sys-file/' + id,
		method: 'get',
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/admin/sys-file',
		method: 'put',
		data: obj,
	});
}

export function fileGroupAdd(params: Record<string, any>) {
	return request({
		url: '/admin/sys-file/group/add',
		method: 'post',
		data: params,
	});
}

export function fileGroupUpdate(params: Record<string, any>) {
	return request({
		url: '/admin/sys-file/group/update',
		method: 'put',
		data: params,
	});
}

// 文件分类删除
export function fileGroupDelete(params: Record<string, any>) {
	return request({
		url: '/admin/sys-file/group/delete/' + params.id,
		method: 'delete',
	});
}

// 文件分类列表
export function fileCateLists(params: Record<string, any>) {
	return request({
		url: '/admin/sys-file/group/list',
		method: 'get',
		params: params,
	});
}

// 文件删除
export function fileDelete(params: Record<string, any>) {
	return request({
		url: '/admin/sys-file',
		method: 'delete',
		data: params.ids,
	});
}

// 文件移动
export function fileMove(params: Record<string, any>) {
	return request({
		url: '/admin/sys-file/group/move',
		method: 'put',
		data: params,
	});
}

// 文件重命名
export function fileRename(params: { id: number; original: string }) {
	return request({
		url: '/admin/sys-file/rename',
		method: 'put',
		data: params,
	});
}
