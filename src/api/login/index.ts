import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { validateNull } from '/@/utils/validate';
import { useUserInfo } from '/@/stores/userInfo';

/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
	const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT);
	Session.set('basicAuth', basicAuth);
	return request({
		url: '/auth/oauth2/token',
		method: 'post',
		params: data,
		headers: {
			isToken: false,
			'TENANT-ID': '1',
			Authorization: basicAuth,
		},
	});
};

export const loginByMobile = (mobile: any, code: any) => {
	const grant_type = 'mobile';
	const scope = 'server';
	const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_MOBILE_CLIENT);
	Session.set('basicAuth', basicAuth);

	return request({
		url: '/auth/oauth2/token',
		headers: {
			isToken: false,
			'TENANT-ID': '1',
			Authorization: basicAuth,
		},
		method: 'post',
		params: { mobile: 'SMS@' + mobile, code: code, grant_type, scope },
	});
};

export const loginBySocial = (state: string, code: string) => {
	const grant_type = 'mobile';
	const scope = 'server';
	const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_SOCIAL_CLIENT);
	Session.set('basicAuth', basicAuth);

	return request({
		url: '/auth/oauth2/token',
		headers: {
			isToken: false,
			'TENANT-ID': '1',
			Authorization: basicAuth,
		},
		method: 'post',
		params: { mobile: state + '@' + code, code: code, grant_type, scope },
	});
};

export const sendMobileCode = (mobile: any) => {
	return request({
		url: '/auth/mobile/' + mobile,
		method: 'get',
	});
};

export const refreshTokenApi = (refresh_token: string) => {
	const grant_type = 'refresh_token';
	const scope = 'server';
	// 获取当前选中的 basic 认证信息
	const basicAuth = Session.get('basicAuth');

	return request({
		url: '/auth/oauth2/token',
		headers: {
			isToken: false,
			'TENANT-ID': '1',
			Authorization: basicAuth,
		},
		method: 'post',
		params: { refresh_token, grant_type, scope },
	});
};

/**
 * 校验令牌，若有效期小于半小时自动续期
 * @param refreshLock
 */
export const checkToken = (refreshTime: number, refreshLock: boolean) => {
	const basicAuth = Session.get('basicAuth');
	request({
		url: '/auth/token/check_token',
		headers: {
			isToken: false,
			Authorization: basicAuth,
		},
		method: 'get',
		params: { token: Session.getToken() },
	})
		.then((response) => {
			if (validateNull(response) || response.code === 1) {
				clearInterval(refreshTime);
				return;
			}
			const expire = Date.parse(response.data.expiresAt);
			if (expire) {
				const expiredPeriod = expire - new Date().getTime();
				//小于半小时自动续约
				if (expiredPeriod <= 10 * 30 * 1000) {
					if (!refreshLock) {
						refreshLock = true;
						useUserInfo()
							.refreshToken()
							.catch(() => {
								clearInterval(refreshTime);
							});
						refreshLock = false;
					}
				}
			}
		})
		.catch(() => {
			// 发生异常关闭定时器
			clearInterval(refreshTime);
		});
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	return request({
		url: '/auth/user/info',
		method: 'get',
	});
};

export const logout = () => {
	return request({
		url: '/admin/token/logout',
		method: 'delete',
	});
};
