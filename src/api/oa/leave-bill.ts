import request from '/@/utils/request';

export function fetchList(query) {
    return request({
        url: '/admin/leave-bill/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj) {
    return request({
        url: '/admin/leave-bill',
        method: 'post',
        data: obj
    })
}

export function getObj(id) {
    return request({
        url: '/admin/leave-bill/' + id,
        method: 'get'
    })
}

export function submit(id) {
    return request({
        url: '/admin/leave-bill/submit/' + id,
        method: 'get'
    })
}

export function delObj(ids?: Object) {
    return request({
        url: '/admin/leave-bill',
        method: 'delete',
        data: ids
    })
}

export function putObj(obj) {
    return request({
        url: '/admin/leave-bill/',
        method: 'put',
        data: obj
    })
}
