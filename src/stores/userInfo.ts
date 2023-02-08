import {defineStore} from 'pinia';
import Cookies from 'js-cookie';
import {Session} from '/@/utils/storage';
import {getUserInfo, login} from '/@//api/login/index'
import other from '/@/utils/other'

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
            data.grant_type = 'password'
            data.scope = 'server'
            // 密码加密
            const user = other.encryption({
                data: data,
                key: 'pigxpigxpigxpigx',
                param: ['password']
            })
            return new Promise((resolve, reject) => {
                login(user).then(res => {
                    // 存储token 信息
                    Session.set('token', res.access_token);
                    Session.set('refresh_token', res.refresh_token);
                    resolve(res)
                }).catch((err) => {
                    reject(err)
                })
            })

        },
        async setUserInfos() {
            getUserInfo().then((res: any) => {
                const userInfo: any = {
                    user: res.data.sysUser,
                    time: new Date().getTime(),
                    roles: res.data.roles,
                    authBtnList: res.data.permissions,
                };
                this.userInfos = userInfo
            })
        }
    },
});
