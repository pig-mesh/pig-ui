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


export function getObj(id: any) {
  return request({
    url: '/gen/create-table/' + id,
    method: 'get'
  })
}


export function delObjs(ids?: Object) {
  return request({
    url: '/gen/create-table',
    method: 'delete',
    data: ids
  })
}
