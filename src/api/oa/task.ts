import request from '/@/utils/request';

export function fetchList(query) {
  return request({
    url: '/admin/task/todo',
    method: 'get',
    params: query
  })
}

export function fetchDetail(id) {
  return request({
    url: '/admin/task/' + id,
    method: 'get'
  })
}

export function fetchComment(id) {
  return request({
    url: '/admin/task/comment/' + id,
    method: 'get'
  })
}

export function doTask(obj) {
  return request({
    url: '/admin/task',
    method: 'post',
    data: obj
  })
}
