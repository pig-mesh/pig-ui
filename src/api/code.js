import request from '@/router/axios'

/**
 * 获取验证码
 * @param query 查询条件
 * @param code 验证码对象
 * @returns {Promise<T>}
 */
export function getCode(query, code) {
  return request({
    url: '/code',
    method: 'get',
    params: query,
    responseType: 'arraybuffer'
  }).then(response => {
    //将从后台获取的图片流进行转换
    return 'data:image/png;base64,' + btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
  }).then(function(data) {
    //接收转换后的Base64图片
    code.src = data
  }).catch(function(err) {
    console.log(err)
  })
}
