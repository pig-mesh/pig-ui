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

import {getObj} from '@/api/admin/client'

const DIC = {
  vaild: [{
    label: '否',
    value: 'false'
  }, {
    label: '是',
    value: 'true'
  }]
}

var validateClient = (rule, value, callback) => {
  getObj(value).then(response => {
    if (window.boxType === 'edit') {
      return callback()
    }
    const result = response.data.data
    if (result.length !== 0) {
      callback(new Error('客户端已存在'))
    } else {
      callback()
    }
  })
}

export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  align: 'center',
  column: [{
    width: 150,
    label: '编号',
    prop: 'clientId',
    align: 'center',
    sortable: true,
    rules: [{
      required: true,
      message: '请输入clientId',
      trigger: 'blur'
    }, {validator: validateClient, trigger: 'blur'}]
  }, {
    label: '密钥',
    prop: 'clientSecret',
    align: 'center',
    sortable: true,
    overHidden: true,
    width: 120,
    rules: [{
      required: true,
      message: '请输入clientSecret',
      trigger: 'blur'
    }]
  }, {
    label: '域',
    prop: 'scope',
    align: 'center',
    rules: [{
      required: true,
      message: '请输入scope',
      trigger: 'blur'
    }]
  }, {
    label: '授权模式',
    prop: 'authorizedGrantTypes',
    align: 'center',
    overHidden: true,
    rules: [{
      required: true,
      message: '请输入授权模式',
      trigger: 'blur'
    }]
  }, {
    label: '回调地址',
    prop: 'webServerRedirectUri',
    align: 'center',
    hide: true
  }, {
    label: '权限',
    prop: 'authorities',
    align: 'center',
    hide: true
  }, {
    label: '自动放行',
    prop: 'autoapprove',
    align: 'center',
    type: 'radio',
    border: true,
    dicData: DIC.vaild,
    rules: [{
      required: true,
      message: '请选择是否放行',
      trigger: 'blur'
    }]
  }, {
    label: '令牌时效',
    prop: 'accessTokenValidity',
    align: 'center',
  }, {
    label: '刷新时效',
    prop: 'refreshTokenValidity',
    align: 'center',
  }, {
    label: '扩展信息',
    prop: 'additionalInformation',
    align: 'center',
    hide: true
  }, {
    label: '资源ID',
    prop: 'resourceIds',
    align: 'center',
    hide: true
  }]
}
