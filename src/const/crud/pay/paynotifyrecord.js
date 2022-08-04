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
  viewBtn: true,
  searchMenuSpan: 6,
  column: [
    {
      label: 'ID',
      prop: 'id',
      hide: true,
      editDisabled: true,
      addDisplay: false
    },
    {
      label: '响应ID',
      prop: 'notifyId'
    },
    {
      label: '订单号',
      prop: 'orderNo',
      search: true
    },
    {
      label: '回调报文',
      prop: 'request',
      overHidden: true,
      type: 'textarea',
      span: 24,
      minRows: 5
    },
    {
      label: '响应报文',
      prop: 'response'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisplay: false,
      overHidden: true,
      addDisplay: false
    }
  ]
}
