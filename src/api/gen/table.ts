import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/gen/table/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/gen/table',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/gen/table/' + id,
		method: 'get',
	});
}

export function delObj(id?: string) {
	return request({
		url: '/gen/table/' + id,
		method: 'delete',
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/gen/table',
		method: 'put',
		data: obj,
	});
}

export const useSyncTableApi = (dsName: string, tableName: string) => {
	return request.get('/gen/table/sync/' + dsName + '/' + tableName);
};

export const useTableApi = (dsName: string, tableName: string) => {
	return request.get('/gen/table/' + dsName + '/' + tableName);
};

export const useListTableApi = (dsName: string) => {
	return request.get('/gen/table/list/' + dsName);
};

export const useListTableColumnApi = (dsName: string, tableName: string) => {
	return request.get('/gen/table/column/' + dsName + '/' + tableName);
};

export const useTableFieldSubmitApi = (dsName: string, tableName: string, fieldList: any) => {
	return request.put('/gen/table/field/' + dsName + '/' + tableName, fieldList);
};

export const useGeneratorCodeApi = (tableIds: any) => {
	return request({
		url: '/gen/generator/code',
		method: 'get',
		params: { tableIds: tableIds },
	});
};

export const useGeneratorVFormApi = (dsName: any, tableName: any) => {
	return request({
		url: '/gen/generator/vform',
		method: 'get',
		params: { dsName: dsName, tableName: tableName },
	});
};

export const useGeneratorVFormSfcApi = (id: string) => {
	return request({
		url: '/gen/generator/vform/sfc',
		method: 'get',
		params: { formId: id },
	});
};

export const useGeneratorPreviewApi = (tableId: any) => {
	return request({
		url: '/gen/generator/preview',
		method: 'get',
		params: { tableId: tableId },
	});
};

export function fetchDictList() {
	return request({
		url: '/admin/dict/list',
		method: 'get',
	});
}

export function useFormConfSaveApi(obj?: Object) {
	return request({
		url: '/gen/form',
		method: 'post',
		data: obj,
	});
}

export function fetchFormList(query?: Object) {
	return request({
		url: '/gen/form/page',
		method: 'get',
		params: query,
	});
}

export function fetchFormById(id?: string) {
	return request({
		url: '/gen/form/' + id,
		method: 'get',
	});
}

export function delFormObj(id?: string) {
	return request({
		url: '/gen/form/' + id,
		method: 'delete',
	});
}
