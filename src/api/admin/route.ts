import request from '/@/utils/request';

export const fetchList = (query?: Object) => {
    return request({
        url: '/admin/route',
        method: 'get',
        params: query,
    });
};

export const addObj = (obj?: object) => {
    return request({
        url: '/admin/route',
        method: 'post',
        data: obj,
    });
};

export const deleteObj = (routeId?: string) => {
    return request({
        url: '/admin/route/' + routeId,
        method: 'delete'
    });
};

export function validateExist(rule: any, value: any, callback: any, isEdit: boolean) {
    if (isEdit) {
        return callback();
    }
    fetchList({[rule.field]: value}).then((response) => {
        const result = response.data;
        if (result !== null && result.length > 0) {
            callback(new Error('数据已经存在'));
        } else {
            callback();
        }
    });
}
