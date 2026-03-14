import request from '/@/utils/request';

export function fetchList(query?: Object) {
    return request({
        url: '/admin/param/page',
        method: 'get',
        params: query,
    });
}

export function addObj(obj?: Object) {
    return request({
        url: '/admin/param',
        method: 'post',
        data: obj,
    });
}

export function getObj(id?: string) {
    return request({
        url: '/admin/param/details/' + id,
        method: 'get',
    });
}

export function delObj(ids?: Object) {
    return request({
        url: '/admin/param',
        method: 'delete',
        data: ids,
    });
}

export function putObj(obj?: Object) {
    return request({
        url: '/admin/param',
        method: 'put',
        data: obj,
    });
}

export function refreshCache() {
    return request({
        url: '/admin/param/sync',
        method: 'put',
    });
}

export function getObjDetails(obj?: object) {
    return request({
        url: '/admin/param/details',
        method: 'get',
        params: obj,
    });
}

export function getValue(key?: String) {
    return request({
        url: '/admin/param/publicValue/' + key,
        method: 'get'
    });
}

export function validateParamsCode(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
    if (isEdit) {
        return callback();
    }

    getObjDetails({publicKey: value}).then((response) => {
        const result = response.data;
        if (result !== null) {
            const message = t ? t('param.keyExists') : 'Parameter key already exists';
            callback(new Error(message));
        } else {
            callback();
        }
    });
}

export function validateParamsName(rule: any, value: any, callback: any, isEdit: boolean, t?: any) {
    if (isEdit) {
        return callback();
    }

    getObjDetails({publicName: value}).then((response) => {
        const result = response.data;
        if (result !== null) {
            const message = t ? t('param.nameExists') : 'Parameter name already exists';
            callback(new Error(message));
        } else {
            callback();
        }
    });
}
