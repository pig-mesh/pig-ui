import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/app/appContacts/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/app/appContacts',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/app/appContacts/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/app/appContacts',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/app/appContacts',
    method: 'put',
    data: obj
  })
}

