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
  menuBtn: true,
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  menuType: 'menu',
  searchMenuSpan: 6,
  column: [{
    fixed: true,
    label: '流程ID',
    prop: 'processonDefinitionId'
  }, {
    fixed: true,
    label: '模型标识',
    prop: 'key',
    editDisabled: true
  }, {
    label: '流程分类',
    prop: 'category',
    search: true
  }, {
    label: '模型名称',
    prop: 'name'
  }, {
    label: '版本号',
    prop: 'revision',
    editDisabled: true,
    addDisplay: false
  }, {
    label: '部署时间',
    prop: 'deploymentTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'timestamp',
    editDisabled: true,
    addDisplay: false
  }]
}
