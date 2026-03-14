import request from '/@/utils/request';

/**
 * 部门信息接口
 */
export interface Dept {
	deptId: string;
	name: string;
	parentId?: string;
	parentName?: string;
}

export const deptTree = (params?: Object) => {
    return request({
        url: '/admin/dept/tree',
        method: 'get',
        params,
    });
};

export const addObj = (obj: Object) => {
    return request({
        url: '/admin/dept',
        method: 'post',
        data: obj,
    });
};

export const getObj = (id: string) => {
    return request({
        url: '/admin/dept/' + id,
        method: 'get',
    });
};

export const delObj = (id: string) => {
    return request({
        url: '/admin/dept/' + id,
        method: 'delete',
    });
};

export const putObj = (obj: Object) => {
    return request({
        url: '/admin/dept',
        method: 'put',
        data: obj,
    });
};

export const syncUser = () => {
    return request({
        url: '/admin/connect/sync/ding/user',
        method: 'post',
    });
};

export const syncDept = () => {
    return request({
        url: '/admin/connect/sync/ding/dept',
        method: 'post',
    });
};

export const syncCpUser = () => {
    return request({
        url: '/admin/connect/sync/cp/user',
        method: 'post',
    });
};

export const syncCpDept = () => {
    return request({
        url: '/admin/connect/sync/cp/dept',
        method: 'post',
    });
};

export const orgTree = (type: String, deptId: Number) => {
    return request({
        url: '/admin/dept/org',
        method: 'get',
        params: {type: type, parentDeptId: deptId},
    });
}

export const orgTreeSearcheUser = (param: Object) => {
    return request({
        url: '/admin/dept/org/user/search',
        method: 'get',
        params: param
    });
}

/**
 * 获取用户的部门列表
 */
export function getPersonalDept() {
    return request({
        url: '/admin/user/personal/dept',
        method: 'get',
    });
}

/**
 * 切换用户当前部门
 * @param deptId 部门ID
 */
export function switchPersonalDept(deptId: string) {
    return request({
        url: '/admin/user/personal/dept/update',
        method: 'put',
        data: { deptId },
    });
}
