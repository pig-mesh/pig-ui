import request from "/@/utils/request";

export const depttree = (params?: Object) => {
    return request({
        url: '/admin/dept/tree',
        method: "get",
        params
    })
}
