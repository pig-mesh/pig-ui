import request from '/@/utils/request';

export function fetchList(query) {
    return request({
        url: '/admin/process',
        method: 'get',
        params: query
    })
}

export function delObj(ids?: Object) {
    return request({
        url: '/admin/process',
        method: 'delete',
        data: ids
    })
}

export function status(id, type) {
    return request({
        url: '/admin/process/status/' + id + '/' + type,
        method: 'put'
    })
}
