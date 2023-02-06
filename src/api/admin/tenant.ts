import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/admin/tenant/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/admin/tenant',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/admin/tenant',
    method: 'get',
    params: { id }
  })
}

export function delObj(id?: string) {
  return request({
    url: '/admin/tenant/' + id,
    method: 'delete'
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/admin/tenant',
    method: 'put',
    data: obj
  })
}
