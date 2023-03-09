import request from '/@/utils/request';

export function fetchList(query) {
    return request({
        url: '/act/process',
        method: 'get',
        params: query
    })
}

export function delObj(ids?: Object) {
    return request({
        url: '/act/process',
        method: 'delete',
        data: ids
    })
}

export function status(id, type) {
    return request({
        url: '/act/process/status/' + id + '/' + type,
        method: 'put'
    })
}
