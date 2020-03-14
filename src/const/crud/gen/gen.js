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
 * Author: test
 */

export const tableOption = {
  selection: true,
  border: true,
  index: true,
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  searchMenuSpan: 6,
  column: [{
    label: '表名称',
    prop: 'tableName',
    align: 'center'
  }, {
    label: '表注释',
    prop: 'tableComment',
    align: 'center'
  }, {
    label: '表编码',
    prop: 'tableCollation',
    align: 'center'
  }, {
    label: '索引',
    prop: 'engine',
    align: 'center'
  }, {
    type: 'datetime',
    valueFormat: 'timestamp',
    format: 'yyyy-MM-dd hh:mm:ss',
    label: '创建时间',
    prop: 'createTime',
    align: 'center'
  }]
}

export const formOption = {
  submitText: '生成',
  column: [
    {
      label: '表名称',
      prop: 'tableName',
      disabled: true
    }, {
      label: '包名',
      prop: 'packageName',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '作者',
      prop: 'author',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '模块',
      prop: 'moduleName',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '表前缀',
      prop: 'tablePrefix',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '注释',
      prop: 'comments',
      placeholder: '可为空，加载表备注'
    }
  ]
}
export const formBatchOption = {
  submitText: '生成',
  column: [
    {
      label: '表名称',
      prop: 'tableName',
      disabled: true,
      minRows: 2,
      type: 'textarea',
      row: true,
      span: 24
    },
    {
      label: '包名',
      prop: 'packageName',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '作者',
      prop: 'author',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '模块',
      prop: 'moduleName',
      placeholder: '可为空，加载系统默认配置'
    }, {
      label: '注释',
      prop: 'comments',
      placeholder: '可为空，加载表备注'
    }
  ]
}

export const tableDsOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  column: [
    {
      label: '主键',
      prop: 'id',
      hide: true,
      addDisplay: false,
      editDisplay: false
    },
    {
      label: '名称',
      prop: 'name',
      rules: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { max: 32, message: '长度在 32 个字符', trigger: 'blur' }
      ]
    },
    {
      label: 'jdbcUrl',
      prop: 'url',
      type: 'textarea',
      span: 24,
      row: true,
      minRows: 2,
      overHidden: true,
      rules: [
        { required: true, message: '请输入jdbcUrl', trigger: 'blur' }
      ]
    },
    {
      label: '用户名',
      prop: 'username',
      rules: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { max: 32, message: '长度在 32 个字符', trigger: 'blur' }
      ]
    },
    {
      label: '密码',
      prop: 'password',
      rules: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { max: 32, message: '长度在 32 个字符', trigger: 'blur' }
      ]
    },
    {
      label: '创建时间',
      prop: 'createDate',
      addDisplay: false,
      editDisplay: false,
      overHidden: true
    },
    {
      label: '更新时间',
      prop: 'updateDate',
      overHidden: true,
      addDisplay: false,
      editDisplay: false
    }
  ]
}
