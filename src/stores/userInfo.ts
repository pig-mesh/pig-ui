import { Local, Session, STORAGE_KEYS } from '/@/utils/storage';
import { getUserInfo, login, loginByMobile, loginBySocial, refreshTokenApi, SocialLoginEnum } from '/@/api/login/index';
import { useMessage } from '/@/hooks/message';
import Cookies from 'js-cookie';
import { useThemeConfig } from './themeConfig';

/**
 * @function useUserInfo
 * @returns {UserInfosStore}
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosState => ({
		userInfos: {
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
			tenantId: '',
			tenantName: '',
			deptId: '',
			deptName: '',
			deptList: [],
		},
	}),

	actions: {
		/**
		 * 登录方法
		 * @function login
		 * @async
		 * @param {Object} data - 登录数据
		 * @returns {Promise<Object>}
		 */
		async login(data: any) {
			data.grant_type = 'password';
			data.scope = 'server';

			return new Promise((resolve, reject) => {
				login(data)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err?.msg || '系统异常请联系管理员');
						reject(err);
					});
			});
		},

		/**
		 * 手机登录方法
		 * @function loginByMobile
		 * @async
		 * @param {Object} data - 登录数据
		 * @returns {Promise<Object>}
		 */
		async loginByMobile(data: { mobile: string; code: string }) {
			return new Promise((resolve, reject) => {
				loginByMobile(data.mobile, data.code)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err?.msg || '系统异常请联系管理员');
						reject(err);
					});
			});
		},

		/**
		 * 社交账号登录方法
		 * @function loginBySocial
		 * @async
		 * @param {SocialLoginEnum} state - 状态
		 * @param {string} code - 代码
		 * @returns {Promise<Object>}
		 */
		async loginBySocial(state: SocialLoginEnum, code: string) {
			return new Promise((resolve, reject) => {
				loginBySocial(state, code)
					.then((res) => {
						// 存储token 信息
						Session.set('token', res.access_token);
						Session.set('refresh_token', res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err?.msg || '系统异常请联系管理员');
						reject(err);
					});
			});
		},

		/**
		 * 刷新token方法
		 * @function refreshToken
		 * @async
		 * @returns {Promise<any>}
		 */
		async refreshToken() {
			return new Promise((resolve, reject) => {
				const refreshToken = Session.get('refresh_token');
				refreshTokenApi(refreshToken)
					.then((res) => {
						// 存储token 信息
						Session.set(STORAGE_KEYS.TOKEN, res.access_token);
						Session.set(STORAGE_KEYS.REFRESH_TOKEN, res.refresh_token);
						resolve(res);
					})
					.catch((err) => {
						useMessage().error(err.msg);
						reject(err);
					});
			});
		},

		/**
		 * 获取用户信息方法
		 * @function setUserInfos
		 * @async
		 */
		async setUserInfos() {
			await getUserInfo().then((res) => {
				// 解构后台返回数据
				const { deptList = [], deptId, roleList, permissions, tenantId, tenantName = '' } = res.data;

				const userInfo: any = {
					user: res.data,
					time: new Date().getTime(),
					roles: roleList,
					authBtnList: permissions,
					tenantId,
					tenantName,
					deptId: deptId || '',
					deptList
				};
				this.userInfos = userInfo;

				//设置租户
				this.updateTenantInfo(tenantId, tenantName);

				//设置部门（使用主部门）
				this.updateDeptInfo(deptId);
			});
		},

		/**
		 * 更新租户信息方法（只负责状态和存储，主题由 useTenant 处理）
		 * @function updateTenantInfo
		 * @param {string} tenantId - 租户ID
		 * @param {string} tenantName - 租户名称
		 */
		updateTenantInfo(tenantId: string, tenantName: string) {
			// 更新 store 状态
			this.userInfos.tenantId = tenantId;
			this.userInfos.tenantName = tenantName;

			// 保存租户信息到本地存储（Session/Local/Cookies 三端同步）
			Session.set(STORAGE_KEYS.TENANT_ID, tenantId);
			Local.set(STORAGE_KEYS.TENANT_ID, tenantId);
			Cookies.set(STORAGE_KEYS.TENANT_ID, tenantId);

			// 更新主题配置中的租户信息
			const storesThemeConfig = useThemeConfig();
			const { themeConfig } = storeToRefs(storesThemeConfig);
			themeConfig.value.globalTitle = tenantName || import.meta.env.VITE_GLOBAL_TITLE;
		},

		/**
		 * 更新部门信息方法
		 * @function updateDeptInfo
		 * @param {string} deptId - 部门ID
		 */
		updateDeptInfo(deptId: String) {
			this.userInfos.deptId = deptId;

			// 保存部门信息到本地
			Session.set(STORAGE_KEYS.DEPT_ID, deptId);
			Local.set(STORAGE_KEYS.DEPT_ID, deptId);
			Cookies.set(STORAGE_KEYS.DEPT_ID, deptId);
		},
	},
});
