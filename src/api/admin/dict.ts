import request from "/@/utils/request";


export const getDicts = (type: String) => {
    return request({
        url: `/admin/dict/type/${type}`,
        method: "get",
    })
}

export function fetchList(query: any) {
    return request({
        url: '/admin/dict/page',
        method: 'get',
        params: query
    })
}

export function fetchItemList(query: any) {
    return request({
        url: '/admin/dict/item/page',
        method: 'get',
        params: query
    })
}

export function addItemObj(obj: any) {
    return request({
        url: '/admin/dict/item',
        method: 'post',
        data: obj
    })
}

export function getItemObj(id: string) {
    return request({
        url: '/admin/dict/item/' + id,
        method: 'get'
    })
}

export function delItemObj(id: string) {
    return request({
        url: '/admin/dict/item/' + id,
        method: 'delete'
    })
}

export function putItemObj(obj: any) {
    return request({
        url: '/admin/dict/item',
        method: 'put',
        data: obj
    })
}

export function addObj(obj: any) {
    return request({
        url: '/admin/dict/',
        method: 'post',
        data: obj
    })
}

export function getObj(id: string) {
    return request({
        url: '/admin/dict/' + id,
        method: 'get'
    })
}

export function delObj(row: any) {
    return request({
        url: '/admin/dict/' + row.id,
        method: 'delete'
    })
}

export function putObj(obj: any) {
    return request({
        url: '/admin/dict/',
        method: 'put',
        data: obj
    })
}

export function refreshCache() {
    return request({
        url: '/admin/dict/sync',
        method: 'put'
    })
}
