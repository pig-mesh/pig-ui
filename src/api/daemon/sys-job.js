import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/job/sys-job/page',
    method: 'get',
    params: query
  })
}

export function fetchLogList(query) {
  return request({
    url: '/job/sys-job/job-log',
    method: 'get',
    params: query
  })
}

export function shutdownJobsRa() {
  return request({
    url: '/job/sys-job/shutdown-jobs',
    method: 'post'
  })
}

export function startJobsRa() {
  return request({
    url: '/job/sys-job/start-jobs',
    method: 'post'
  })
}

export function refreshJobsRa() {
  return request({
    url: '/job/sys-job/refresh-jobs',
    method: 'post'
  })
}

export function startJobRa(jobId) {
  return request({
    url: '/job/sys-job/start-job/' + jobId,
    method: 'post'
  })
}

export function runJobRa(jobId) {
  return request({
    url: '/job/sys-job/run-job/' + jobId,
    method: 'post'
  })
}

export function shutDownJobRa(jobId) {
  return request({
    url: '/job/sys-job/shutdown-job/' + jobId,
    method: 'post'
  })
}

export function addObj(obj) {
  return request({
    url: '/job/sys-job',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/job/sys-job/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/job/sys-job/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/job/sys-job',
    method: 'put',
    data: obj
  })
}

export function isValidTaskName(query) {
  return request({
    url: '/job/sys-job/is-valid-task-name',
    method: 'get',
    params: query
  })
}
