import request from '/@/utils/request';

export function fetchList(query?: Object) {
	return request({
		url: '/daemon/sys-job/page',
		method: 'get',
		params: query,
	});
}

export function addObj(obj?: Object) {
	return request({
		url: '/daemon/sys-job',
		method: 'post',
		data: obj,
	});
}

export function getObj(id?: string) {
	return request({
		url: '/daemon/sys-job/' + id,
		method: 'get',
	});
}

export function delObj(id?: string) {
	return request({
		url: '/daemon/sys-job/' + id,
		method: 'delete',
	});
}

export function putObj(obj?: Object) {
	return request({
		url: '/daemon/sys-job',
		method: 'put',
		data: obj,
	});
}

export function startJobRa(jobId: string) {
	return request({
		url: '/daemon/sys-job/start-job/' + jobId,
		method: 'post',
	});
}

export function runJobRa(jobId: string) {
	return request({
		url: '/daemon/sys-job/run-job/' + jobId,
		method: 'post',
	});
}

export function shutDownJobRa(jobId: string) {
	return request({
		url: '/daemon/sys-job/shutdown-job/' + jobId,
		method: 'post',
	});
}
