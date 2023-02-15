import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/admin/i18n/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/admin/i18n',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/admin/i18n/' + id,
    method: 'get'
  })
}

export function delObj(ids?: object) {
  return request({
    url: '/admin/i18n',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/admin/i18n',
    method: 'put',
    data: obj
  })
}


export function info() {
  return request({
    url: '/admin/i18n/info',
    method: 'get',
  })
}
