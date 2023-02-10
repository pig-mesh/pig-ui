import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/admin/appsocial/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/admin/appsocial',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/admin/appsocial/' + id,
    method: 'get'
  })
}

export function delObj(id?: string) {
  return request({
    url: '/admin/appsocial/' + id,
    method: 'delete'
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/admin/appsocial',
    method: 'put',
    data: obj
  })
}
