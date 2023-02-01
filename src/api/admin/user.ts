import request from "/@/utils/request";

export const pageList = (params?: Object) => {
    return request({
        url: '/admin/user/page',
        method: "get",
        params
    })
}

export const addObj = (obj: Object) =>  {
    return request({
        url: '/admin/user',
        method: 'post',
        data: obj
    })
}

export const getObj = (id: String) => {
    return request({
        url: '/admin/user/' + id,
        method: 'get'
    })
}

export const delObj = (id: String) => {
    return request({
        url: '/admin/user/' + id,
        method: 'delete'
    })
}

export const putObj = (obj: Object) => {
    return request({
        url: '/admin/user',
        method: 'put',
        data: obj
    })
}
