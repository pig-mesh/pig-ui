import request from "/@/utils/request";

export const pageList = (params?: Object) => {
    return request({
        url: '/admin/log/page',
        method: "get",
        params
    })
}

export const delObjs = (ids: string) =>  {
    return request({
        url: '/admin/log/',
        method: 'delete',
        data: ids
    })
}


export const delObj = (id:string) => {
    return request({
        url: '/admin/log/' + id,
        method: 'delete'
    })
}
