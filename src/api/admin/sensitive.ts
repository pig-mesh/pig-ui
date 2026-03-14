import request from "/@/utils/request"

export function fetchList(query?: Object) {
    return request({
        url: '/admin/sysSensitiveWord/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj?: Object) {
    return request({
        url: '/admin/sysSensitiveWord',
        method: 'post',
        data: obj
    })
}

export function getObj(obj: Object) {
    return request({
        url: '/admin/sysSensitiveWord/details',
        method: 'get',
        params: obj
    })
}

export function refreshObj() {
    return request({
        url: '/admin/sysSensitiveWord/refresh',
        method: 'get'
    })
}

export function delObjs(ids?: Object) {
    return request({
        url: '/admin/sysSensitiveWord',
        method: 'delete',
        data: ids
    })
}

export function putObj(obj?: Object) {
    return request({
        url: '/admin/sysSensitiveWord',
        method: 'put',
        data: obj
    })
}

export function testObj(obj?: Object) {
    return request({
        url: '/admin/sysSensitiveWord/match',
        method: 'post',
        data: obj
    })
}

export function validateWord(rule: any, value: any, callback: any, isEdit: boolean) {
    if (isEdit) {
        return callback();
    }

    getObj({ sensitiveWord: value }).then((response) => {
        const result = response.data;
        if (result !== null) {
            callback(new Error('敏感词已经存在'));
        } else {
            callback();
        }
    });
}
