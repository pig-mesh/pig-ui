import request from '/@/utils/request';


/**
 * 登录
 * @param data
 */
export const login = (data: any) => {
    let basicAuth = 'Basic ' + window.btoa('pig:pig')
    return request({
        url: '/admin/oauth2/token',
        method: 'post',
        params: data,
        headers: {
            isToken: false,
            'TENANT-ID': '1',
            'Authorization': basicAuth
        }
    })
}

export const loginByMobile = (mobile: any, code: any) => {
    const grant_type = 'mobile'
    const scope = 'server'
    let basicAuth = 'Basic ' + window.btoa('app:app')

    return request({
        url: '/admin/oauth2/token',
        headers: {
            isToken: false,
            'TENANT-ID': '1',
            'Authorization': basicAuth
        },
        method: 'post',
        params: { mobile: 'SMS@' + mobile, code: code, grant_type, scope }
    })
}

export const loginBySocial = (state: string, code: string) => {
    const grant_type = 'mobile'
    const scope = 'server'
    let basicAuth = 'Basic ' + window.btoa('social:social')

    return request({
        url: '/admin/oauth2/token',
        headers: {
            isToken: false,
            'TENANT-ID': '1',
            'Authorization': basicAuth
        },
        method: 'post',
        params: { mobile: state + '@' + code, code: code, grant_type, scope }
    })
}

export const sendMobileCode = (mobile: any) => {
    return request({
        url: "/admin/mobile/" + mobile,
        method: "get",
    })
}


/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return request({
        url: '/admin/user/info',
        method: 'get'
    })
}
