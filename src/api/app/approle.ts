import request from "/@/utils/request";

export function fetchList(query: any) {
  return request({
    url: '/admin/approle/page',
    method: 'get',
    params: query
  })
}

export function list() {
  return request({
    url: '/admin/approle/list',
    method: 'get'
  })
}

export function addObj(obj: any) {
  return request({
    url: '/admin/approle',
    method: 'post',
    data: obj
  })
}

export function getObj(id: string) {
  return request({
    url: '/admin/approle/' + id,
    method: 'get'
  })
}

export function delObj(id: string) {
  return request({
    url: '/admin/approle/' + id,
    method: 'delete'
  })
}

export function putObj(obj: any) {
  return request({
    url: '/admin/approle',
    method: 'put',
    data: obj
  })
}

export function fetchRoleTree(roleId: string) {
  return request({
    url: '/admin/appmenu/tree/' + roleId,
    method: 'get'
  })
}

export function permissionUpd(roleId: string, menuIds: string) {
  return request({
    url: '/admin/approle/menu',
    method: 'put',
    data: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}
