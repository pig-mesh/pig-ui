import request from "/@/utils/request";


export const list = (params?: Object) => {
    return request({
        url: '/admin/post/list',
        method: "get",
        params
    })
}
