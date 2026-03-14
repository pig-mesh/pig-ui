import request from "/@/utils/request"

export function fetchList(query?: Object) {
    return request({
        url: '/admin/system-config/page',
        method: 'get',
        params: query
    })
}

export function addObj(obj?: Object) {
    return request({
        url: '/admin/system-config',
        method: 'post',
        data: obj
    })
}

export function getObj(obj: Object) {
    return request({
        url: '/admin/system-config/details',
        method: 'get',
        params: obj
    })
}

export function refreshObj() {
    return request({
        url: '/admin/system-config/refresh',
        method: 'get'
    })
}

export function delObjs(ids?: Object) {
    return request({
        url: '/admin/system-config',
        method: 'delete',
        data: ids
    })
}

export function putObj(obj?: Object) {
    return request({
        url: '/admin/system-config',
        method: 'put',
        data: obj
    })
}


export function validateExist(rule: any, value: any, callback: any, isEdit: boolean) {
    if (isEdit) {
        return callback();
    }

    getObj({configKey: value}).then((response) => {
        const result = response.data;
        if (result !== null && result.length > 0) {
            callback(new Error('数据已经存在'));
        } else {
            callback();
        }
    });
}
