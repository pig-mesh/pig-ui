import request from "/@/utils/request"

export function fetchList(query: object) {
    return request({
        url: '/admin/token/page',
        method: 'post',
        data: query
    })
}

export function delObj(token:string) {
    return request({
        url: '/admin/token/' + token,
        method: 'delete'
    })
}
