import request from '/@/utils/request';
import type { CaptchaType, PasswordRule } from '/@/stores/siteConfig';

export type SectionId = 'brand' | 'login' | 'security' | 'appearance' | 'integration' | 'maintenance';

export type SiteConfigForm = {
	clarityId: string;
	captchaType: CaptchaType | string;
	passwordRule: PasswordRule | string;
	forceResetPwd: boolean;
	passwordExpireDays: number;
	loginFailureLock: boolean;
	loginErrorTimes: number;
	smsLoginEnable: boolean;
	socialLoginEnable: boolean;
	registerEnable: boolean;
	resetPassword: boolean;
	i18nEnable: boolean;
	darkModeEnable: boolean;
	antiDebugEnable: boolean;
	antiDebugKey: string;
	title: string;
	footer: string;
	privacyTip: string;
	logo: string;
};

export type SectionMeta = {
	id: SectionId;
	icon: string;
	title: string;
	desc: string;
	tone: 'blue' | 'green' | 'amber' | 'purple' | 'slate' | 'red';
	showBadge?: boolean;
};

export type SettingRowMeta = {
	key: string;
	section: SectionId;
	label: string;
	desc: string;
};

export type Snapshot = Record<string, string | number | boolean>;

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
