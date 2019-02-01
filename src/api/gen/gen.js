/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import request from '@/router/axios'

export function fetchList (query) {
  return request({
    url: '/gen/generator/page',
    method: 'get',
    params: query
  })
}

export function handleDown (table) {
  return request({
    url: '/gen/generator/code',
    method: 'post',
    data: table,
    responseType: 'arraybuffer'
  }).then((response) => { // 处理返回的文件流
    let blob = new Blob([response.data], { type: 'application/zip' })
    let filename = table.tableName + '.zip'
    let link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function () {
      URL.revokeObjectURL(blob)
      document.body.removeChild(link)
    }, 0)
  })
}
