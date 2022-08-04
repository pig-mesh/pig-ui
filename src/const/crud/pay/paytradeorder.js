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
  searchMenuSpan: 6,
  column: [
    {
      label: '订单号',
      prop: 'orderId',
      overHidden: true,
      width: 150
    },
    {
      label: '渠道ID',
      prop: 'channelId',
      width: 120
    },
    {
      label: '渠道商户',
      prop: 'channelMchId',
      width: 120
    },
    {
      label: '渠道订单',
      prop: 'channelOrderNo',
      width: 150,
    },
    {
      label: '商品描述',
      prop: 'body',
      overHidden: true
    },
    {
      label: '金额/元',
      prop: 'amount',
      slot: true
    },
    {
      label: '币种',
      prop: 'currency'
    },
    {
      label: '支付状态',
      prop: 'status',
      type: 'select',
      search: true,
      dicUrl: '/admin/dict/type/order_status'
    },
    {
      label: '客户端IP',
      prop: 'clientIp',
      width: 120,
    },
    {
      label: '成功时间',
      prop: 'paySuccTime',
      width: 150
    },
    {
      label: '创建时间',
      width: 150,
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
