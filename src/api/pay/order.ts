import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/admin/order/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/admin/order',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/admin/order/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/admin/order',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/admin/order',
    method: 'put',
    data: obj
  })
}