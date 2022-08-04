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
import { rule } from "@/util/validateRules";
export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  searchMenuSpan: 6,
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  viewBtn: true,
  column: [{
    label: '角色名称',
    prop: 'roleName',
    span: 24,
    rules: [
      { required: true, message: '角色名称不能为空', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    'search': true,
  }, {
    label: '角色标识',
    prop: 'roleCode',
    span: 24,
    editDisabled: true,
    rules: [
      { required: true, message: '角色标识不能为空', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'},
      { validator: rule.validatorKey, trigger: 'blur'}
    ],
    'search': true,
  }, {
    width: 150,
    label: '角色描述',
    prop: 'roleDesc',
    overHidden: true,
    type: 'textarea',
    span: 24,
    row: true,
    minRows: 2,
    rules: [
      { max: 128, message: '长度在 128 个字符内', trigger: 'blur' }
    ]
  }, {
    width: 120,
    label: '数据权限',
    prop: 'dsType',
    type: 'select',
    span: 24,
    rules: [
      { required: true, message: '请选择数据权限类型', trigger: 'blur'}
    ],
    dicData: [{
      label: '全部',
      value: 0
    }, {
      label: '自定义',
      value: 1
    }, {
      label: '本级及子级',
      value: 2
    }, {
      label: '本级',
      value: 3
    }],
    'search': true,
  }, {
    label: '',
    prop: 'dsScope',
    formslot: true,
    showClomnu: false,
    hide: true
  }, {
    width: 120,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    editDisplay: false,
    addDisplay: false,
    span: 24
  }]
}
