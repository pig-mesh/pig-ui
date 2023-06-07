import request from "/@/utils/request"

export function fetchList(query?: Object) {
  return request({
    url: '/app/appArticle/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj?: Object) {
  return request({
    url: '/app/appArticle',
    method: 'post',
    data: obj
  })
}

export function getObj(id?: string) {
  return request({
    url: '/app/appArticle/' + id,
    method: 'get'
  })
}

export function delObjs(ids?: Object) {
  return request({
    url: '/app/appArticle',
    method: 'delete',
    data: ids
  })
}

export function putObj(obj?: Object) {
  return request({
    url: '/app/appArticle',
    method: 'put',
    data: obj
  })
}

