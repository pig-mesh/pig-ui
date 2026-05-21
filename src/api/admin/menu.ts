import request from '/@/utils/request';

export interface MenuSortPayload {
	parentId: string | number;
	menuIds: Array<string | number>;
}

export const pageList = (params?: Object) => {
    return request({
        url: '/admin/menu/tree',
        method: 'get',
        params,
    });
};

export const getObj = (obj: object) => {
    return request({
        url: `/admin/menu/details`,
        method: 'get',
        params: obj
    });
};

export const save = (data: Object) => {
    return request({
        url: '/admin/menu',
        method: 'post',
        data: data,
    });
};

export const putObj = (data: Object) => {
    return request({
        url: '/admin/menu',
        method: 'put',
        data: data,
    });
};

export const sortMenu = (data: MenuSortPayload) => {
	return request({
		url: '/admin/menu/sort',
		method: 'put',
		data,
	});
};

export const addObj = (data: Object) => {
    return request({
        url: '/admin/menu',
        method: 'post',
        data: data,
    });
};

export const delObj = (id: string) => {
    return request({
        url: '/admin/menu/' + id,
        method: 'delete',
    });
};

/**
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getAdminMenu 获取后端动态路由菜单(admin)
 */
export function useMenuApi() {
    return {
        getAdminMenu: (params?: object) => {
            return request({
                url: '/admin/menu',
                method: 'get',
                params,
            });
        },
    };
}

export function validateExist(rule: any, value: any, callback: any, isEdit: boolean) {
    if (isEdit) {
        return callback();
    }
    getObj({[rule.field]: value}).then((response) => {
        const result = response.data;
        if (result !== null && result.length > 0) {
            callback(new Error('数据已经存在'));
        } else {
            callback();
        }
    });
}

/**
 * 设置首页菜单
 * @param menuId 菜单ID
 */
export const setHomePage = (menuId: string) => {
    return request({
        url: `/admin/menu/homepage/${menuId}`,
        method: 'put',
    });
};

/**
 * 获取首页菜单
 */
export const getHomePage = () => {
    return request({
        url: '/admin/menu/homepage',
        method: 'get',
    });
};

/**
 * 刷新指定角色的菜单权限缓存
 */
export const clearMenuCache = (roleId: string | number) => {
	return request({
		url: `/admin/menu/cache/${roleId}`,
		method: 'delete',
	});
};
