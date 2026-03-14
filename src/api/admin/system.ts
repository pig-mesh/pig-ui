import request from '/@/utils/request';

// 系统缓存监控
export function systemCache() {
	return request({
		url: '/admin/system/cache',
		method: 'get',
	});
}
