import request from '/@/utils/request';
import { Session } from '/@/utils/storage';
import { validateNull } from '/@/utils/validate';
import { useUserInfo } from '/@/stores/userInfo';
import other from '/@/utils/other';
import { refAutoReset } from '@vueuse/core';

/**
 * https://www.ietf.org/rfc/rfc6749.txt
 * OAuth 协议 4.3.1 要求格式为 form 而不是 JSON 注意！
 */
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded';

/**
 * OAuth 客户端类型枚举
 */
enum OAuth2ClientType {
	PASSWORD = 'VITE_OAUTH2_PASSWORD_CLIENT',
	MOBILE = 'VITE_OAUTH2_MOBILE_CLIENT',
	SOCIAL = 'VITE_OAUTH2_SOCIAL_CLIENT',
}

/**
 * 获取并设置 Basic Auth
 * @param clientType - OAuth 客户端类型
 * @returns Basic Auth 字符串
 */
const getBasicAuth = (clientType: OAuth2ClientType): string => {
	const clientId = import.meta.env[clientType];
	const basicAuth = 'Basic ' + window.btoa(clientId);
	Session.set('basicAuth', basicAuth);
	return basicAuth;
};

// 登录方式
export enum LoginTypeEnum {
	PASSWORD,
	MOBILE,
	REGISTER,
	EXPIRE,
	QRCODE,
	FORGET,
}

// 登录错误信息
export enum LoginErrorEnum {
	CREDENTIALS_EXPIRED = 'credentials_expired', // 密码过期
}

/**
 * 社交登录方式枚举
 */
export enum SocialLoginEnum {
	SMS = 'SMS', // 验证码登录
	DINGTALK = 'DINGTALK', // 钉钉
	WEIXIN_CP = 'WEIXIN_CP', // 企业微信
	APP_SMS = 'APP-SMS', // APP验证码登录
	QQ = 'QQ', // QQ登录
	WECHAT = 'WX', // 微信登录
	MINI_APP = 'MINI', // 微信小程序
	GITEE = 'GITEE', // 码云登录
	OSC = 'OSC', // 开源中国登录
	CAS = 'CAS', // CAS 登录
}

/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
	const basicAuth = getBasicAuth(OAuth2ClientType.PASSWORD);
	// 密码加密
	const encPassword = other.encryption(data.password, import.meta.env.VITE_PWD_ENC_KEY);
	const { username, randomStr, code, grant_type, scope } = data;
	return request({
		url: '/auth/oauth2/token',
		method: 'post',
		params: { username, randomStr, code, grant_type, scope },
		data: { password: encPassword },
		headers: {
			skipToken: true,
			skipTenant: true,
			Authorization: basicAuth,
			'Content-Type': FORM_CONTENT_TYPE,
			"Enc-Flag": "false",
		},
	});
};

export const loginByMobile = (mobile: any, code: any) => {
	const grant_type = 'mobile';
	const scope = 'server';
	const basicAuth = getBasicAuth(OAuth2ClientType.MOBILE);

	return request({
		url: '/auth/oauth2/token',
		headers: {
			skipToken: true,
			skipTenant: true,
			Authorization: basicAuth,
			'Content-Type': FORM_CONTENT_TYPE,
		},
		method: 'post',
		params: { mobile: `${SocialLoginEnum.SMS}@${mobile}`, code: code, grant_type, scope },
	});
};

export const loginBySocial = (state: SocialLoginEnum, code: string) => {
	const grant_type = 'mobile';
	const scope = 'server';
	const basicAuth = getBasicAuth(OAuth2ClientType.SOCIAL);

	return request({
		url: '/auth/oauth2/token',
		headers: {
			skipToken: true,
			skipTenant: true,
			Authorization: basicAuth,
			'Content-Type': FORM_CONTENT_TYPE,
		},
		method: 'post',
		params: { mobile: `${state}@${code}`, code: code, grant_type, scope },
	});
};

export const sendMobileCode = (mobile: string) => {
	return request({
		url: '/admin/sysMessage/send/smsCode',
		method: 'get',
		params: { mobile },
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
			skipToken: true,
			skipTenant: true,
			Authorization: basicAuth,
			'Content-Type': FORM_CONTENT_TYPE,
		},
		method: 'post',
		params: { refresh_token, grant_type, scope },
	});
};

// Token 刷新锁 - 使用 VueUse 的 refAutoReset 防止并发刷新
const tokenRefreshLock = refAutoReset(false, 100);

/**
 * 校验令牌，若有效期小于半小时自动续期
 * @returns {Promise<boolean>} 返回是否需要停止定时器
 */
export const checkToken = async (): Promise<boolean> => {
	try {
		const basicAuth = Session.get('basicAuth');
		const response = await request({
			url: '/auth/token/check_token',
			headers: {
				skipToken: true,
				skipTenant: true,
				Authorization: basicAuth,
				'Content-Type': FORM_CONTENT_TYPE,
			},
			method: 'get',
			params: { token: Session.getToken() },
		});

		// 检查响应有效性
		if (validateNull(response) || response.code === 1) {
			return true; // 返回 true 表示需要停止定时器
		}

		// 计算过期时间
		const expire = Date.parse(response.data.expiresAt);
		if (!expire) return false;

		const expiredPeriod = expire - new Date().getTime();
		const HALF_HOUR = 30 * 60 * 1000;

		// 小于半小时自动续约
		if (expiredPeriod <= HALF_HOUR && !tokenRefreshLock.value) {
			tokenRefreshLock.value = true;
			try {
				await useUserInfo().refreshToken();
			} catch (error) {
				return true; // 刷新失败，停止定时器
			} finally {
				tokenRefreshLock.value = false;
			}
		}

		return false; // 继续运行定时器
	} catch (error) {
		// 发生异常，返回 true 停止定时器
		return true;
	}
};

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
	return request({
		url: '/admin/user/info',
		method: 'get',
	});
};

export const logout = () => {
	return request({
		url: '/auth/token/logout',
		method: 'delete',
	});
};
