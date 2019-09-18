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
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 150,
  align: 'center',
  refreshBtn: true,
  showClomnuBtn: false,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  viewBtn: true,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '类型',
    prop: 'type',
    type: 'select',
    dicUrl: '/admin/dict/type/log_type',
    search: true
  }, {
    label: '标题',
    prop: 'title'
  }, {
    label: 'IP地址',
    prop: 'remoteAddr'
  }, {
    label: '请求方式',
    prop: 'method'
  }, {
    label: '客户端',
    prop: 'serviceId'
  }, {
    width: 80,
    label: '请求时间',
    prop: 'time'
  }, {
    width: 150,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }]
}
