import request from '@/router/axios'

export function getPage(query) {
  return request({
    url: '/mp/wxautoreply/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/mp/wxautoreply',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/mp/wxautoreply/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/mp/wxautoreply/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/mp/wxautoreply',
    method: 'put',
    data: obj
  })
}
