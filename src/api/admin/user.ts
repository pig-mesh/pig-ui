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

export function getDetails(obj: Object) {
    return request({
        url: '/admin/user/details/' + obj,
        method: 'get'
    })
}


export function getDetailsByPhone(obj: Object) {
    return request({
        url: '/admin/user/detailsByPhone/' + obj,
        method: 'get'
    })
}

// 更改个人信息
export function editInfo(obj: Object) {
    return request({
        url: '/admin/user/edit',
        method: 'put',
        data: obj
    })
}
