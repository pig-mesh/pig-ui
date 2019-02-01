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
  align: 'center',
  refreshBtn: false,
  showClomnuBtn: false,
  searchSize: 'mini',
  editBtn: false,
  delBtn: false,
  column: [{
    width: 150,
    label: '数据值',
    prop: 'value',
    rules: [{
      required: true,
      message: '请输入数据值',
      trigger: 'blur'
    }]
  }, {
    label: '标签名',
    prop: 'label',
    rules: [{
      required: true,
      message: '请输入标签名',
      trigger: 'blur'
    }]
  }, {
    label: '类型',
    prop: 'type',
    'search': true,
    rules: [{
      required: true,
      message: '请输入字典类型',
      trigger: 'blur'
    }]
  }, {
    label: '描述',
    prop: 'description',
    rules: [{
      required: true,
      message: '请输入字典描述',
      trigger: 'blur'
    }]
  }, {
    label: '排序',
    prop: 'sort',
    type: 'number',
    rules: [{
      required: true,
      message: '请输入排序',
      trigger: 'blur'
    }]
  }, {
    label: '备注信息',
    prop: 'remarks'
  }]
}
