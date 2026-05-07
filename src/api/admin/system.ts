import request from '/@/utils/request';

// 系统缓存监控
export function systemCache() {
	return request({
		url: '/admin/system/cache',
		method: 'get',
	});
}

// Clarity 站点监控数据
export function systemClarity(numOfDays: number = 1) {
	return request({
		url: '/admin/system/clarity',
		method: 'get',
		params: { numOfDays },
	});
}

// 获取网站配置
export function getSiteConfig() {
	return request({
		url: '/admin/system/site-config',
		method: 'get',
	});
}

// 更新网站配置
export function updateSiteConfig(data: object) {
	return request({
		url: '/admin/system/site-config',
		method: 'put',
		data,
	});
}

// 刷新网站配置缓存（清空 Redis）
export function refreshSiteConfig() {
	return request({
		url: '/admin/system/site-config/refresh',
		method: 'delete',
	});
}
