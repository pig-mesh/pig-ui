import request from "/@/utils/request";


export const list = (params?: Object) => {
    return request({
        url: '/admin/role/list',
        method: "get",
        params
    })
}

export const pageList = (params?: Object) => {
    return request({
        url: '/admin/role/page',
        method: "get",
        params
    })
}


export const deptRoleList = () => {
    return request({
        url: '/admin/role/list',
        method: 'get'
    })
}

export const getObj = (id: string) => {
    return request({
        url: '/admin/role/' + id,
        method: 'get'
    })
}

export const getObjByCode = (code:string) => {
    return request({
        url: '/admin/role/code/' + code,
        method: 'get'
    })
}

export const addObj = (obj: Object)  => {
    return request({
        url: '/admin/role',
        method: 'post',
        data: obj
    })
}

export const putObj = (obj: Object) =>  {
    return request({
        url: '/admin/role',
        method: 'put',
        data: obj
    })
}

export const delObj = (id: string) => {
    return request({
        url: '/admin/role/' + id,
        method: 'delete'
    })
}

export const permissionUpd = (roleId: string, menuIds: string) => {
    return request({
        url: '/admin/role/menu',
        method: 'put',
        data: {
            roleId: roleId,
            menuIds: menuIds
        }
    })
}

export const fetchRoleTree = (roleId: string) =>  {
    return request({
        url: '/admin/menu/tree/' + roleId,
        method: 'get'
    })
}
