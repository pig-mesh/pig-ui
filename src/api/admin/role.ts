import request from "/@/utils/request";


export const list = (params?: Object) => {
    return request({
        url: '/admin/role/list',
        method: "get",
        params
    })
}

export const pageList = (params?: Object) => {
    return request({
        url: '/admin/role/page',
        method: "get",
        params
    })
}
