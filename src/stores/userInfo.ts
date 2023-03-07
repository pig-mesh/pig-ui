import { defineStore } from 'pinia';
import { Session } from '/@/utils/storage';
import { getUserInfo, login, loginByMobile, loginBySocial, refreshTokenApi } from '/@/api/login/index';
import other from '/@/utils/other';
import { useMessage } from '/@/hooks/message';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
	}),
	actions: {
		async login(data: any) {
			data.grant_type = 'password';
			data.scope = 'server';
			// 密码加密
			const user = other.encryption({
				data: data,
				key: import.meta.env.VITE_PWD_ENC_KEY,
				param: ['password'],
			});
			return new Promise((resolve, reject) => {
				login(user)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err.msg);
						reject(err);
					});
			});
		},
		async loginByMobile(data) {
			return new Promise((resolve, reject) => {
				loginByMobile(data.mobile, data.code)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err.msg);
						reject(err);
					});
			});
		},
		async loginBySocial(state: string, code: string) {
			return new Promise((resolve, reject) => {
				loginBySocial(state, code)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error('登录失败，账号未绑定');
						reject(err);
					});
			});
		},
		async refreshToken() {
			return new Promise((resolve, reject) => {
				const refreshToken = Session.get('refresh_token');
				refreshTokenApi(refreshToken)
					.then((res: any) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err: any) => {
						useMessage().error(err.msg);
						reject(err);
					});
			});
		},
		async setUserInfos() {
			getUserInfo().then((res: any) => {
				const userInfo: any = {
					user: res.data.sysUser,
					time: new Date().getTime(),
					roles: res.data.roles,
					authBtnList: res.data.permissions,
				};
				this.userInfos = userInfo;
			});
		},
	},
});
