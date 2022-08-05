/*
 *    Copyright (c) 2018-2025, test All rights reserved.
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
 * Author: lengleng
 */

import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/gen/generator/page',
    method: 'get',
    params: query
  })
}

export function preview(table) {
  return request({
    url: '/gen/generator/preview',
    method: 'get',
    params: table
  })
}

export function fetchDsList(query) {
  return request({
    url: '/gen/dsconf/page',
    method: 'get',
    params: query
  })
}

export function fetchSelectDsList() {
  return request({
    url: '/gen/dsconf/list',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/gen/dsconf/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/gen/dsconf/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/gen/dsconf/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/gen/dsconf/',
    method: 'put',
    data: obj
  })
}

export function handleDown(table) {
  return request({
    url: '/gen/generator/code',
    method: 'post',
    data: table,
    responseType: 'arraybuffer'
  }).then((response) => { // 处理返回的文件流
    const blob = new Blob([response.data], { type: 'application/zip' })
    const filename = table.tableName + '.zip'
    const link = document.createElement('a')
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


export function getForm(tableName, dsName) {
  return request({
    url: '/gen/form/info',
    params: { tableName: tableName, dsName: dsName },
    method: 'get'
  })
}

export function postForm(formInfo, tableName, dsId) {
  return request({
    url: '/gen/form/',
    method: 'post',
    data: Object.assign({ formInfo, tableName, dsId })
  })
}

