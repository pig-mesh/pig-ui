import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/gen/create-table/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/gen/create-table',
    method: 'post',
    data: obj
  })
}

export function tempStore(obj: any) {
  return request({
    url: '/gen/create-table/temp-store',
    method: 'post',
    data: obj
  })
}

export function getObj(id: any) {
  return request({
    url: '/gen/create-table/' + id,
    method: 'get'
  })
}

export function delObj(id: any) {
  return request({
    url: '/gen/create-table/' + id,
    method: 'delete'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/gen/create-table',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/gen/create-table',
    method: 'put',
    data: obj
  })
}
