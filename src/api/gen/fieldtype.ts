import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/gen/fieldtype/page',
    method: 'get',
    params: query
  })
}

export function list(query?: Object) {
  return request({
    url: '/gen/fieldtype/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/gen/fieldtype',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/gen/fieldtype/' + id,
    method: 'get'
  })
}

export function delObj(id?: string) {
  return request({
    url: '/gen/fieldtype/' + id,
    method: 'delete'
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/gen/fieldtype',
    method: 'put',
    data: obj
  })
}
