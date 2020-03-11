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
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  viewBtn: true,
  editBtn: false,
  addBtn: false,
  searchMenuSpan: 6,
  column: [
    {
      label: 'ID',
      prop: 'id',
      hide: true,
    },
    {
      label: '表名称',
      prop: 'tableName'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '表单信息',
      prop: 'formInfo',
      overHidden: true,
      width: 500,
      type: 'textarea',
      minRows: 3,
      row: true,
      span: 24
    }
  ]
}
