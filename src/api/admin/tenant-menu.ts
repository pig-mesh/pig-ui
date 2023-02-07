import request from "/@/utils/request"

export function fetchList(query?: Object) {
    return request({
        url: '/admin/tenant-menu/page',
        method: 'get',
        params: query
    })
}


export function addObj (obj: object) {
    return request({
        url: '/admin/tenant-menu',
        method: 'post',
        data: obj
    })
}

export function getObj(id: string) {
    return request({
        url: '/admin/tenant-menu/',
        method: 'get',
        params: {
            id: id
        }
    })
}

export function delObj(id: string) {
    return request({
        url: '/admin/tenant-menu/' + id,
        method: 'delete'
    })
}

export function putObj(obj:Object) {
    return request({
        url: '/admin/tenant-menu',
        method: 'put',
        data: obj
    })
}

export function menuList() {
    return request({
        url: '/admin/tenant-menu/list',
        method: 'get'
    })
}

export function treemenu(){
    return request({
        url: '/admin/tenant-menu/tree/menu',
        method: 'get'
    })
}
