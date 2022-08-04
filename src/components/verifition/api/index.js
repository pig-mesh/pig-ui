/**
 * 此处可直接引用自己项目封装好的 axios 配合后端联调
 */


import request from '@/router/axios'

//获取验证图片  以及token
export function reqGet(data) {
  return request({
    url: '/code',
    method: 'get',
    data
  })
}

//滑动或者点选验证
export function reqCheck(data) {
  return request({
    url: '/code/check',
    method: 'post',
    params: data
  })
}


