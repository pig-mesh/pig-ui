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
  searchMenuSpan: 6,
  align: 'center',
  column: [
	  {
      label: '主键',
      prop: 'id'
    },
	  {
      label: '父ID',
      prop: 'parentId'
    },
	  {
      label: '菜单名称',
      prop: 'menuName'
    },
	  {
      label: '菜单类型 1文本消息；2图文消息；3网址链接；4小程序',
      prop: 'menuType'
    },
	  {
      label: '菜单等级',
      prop: 'menuLevel'
    },
	  {
      label: '模板ID',
      prop: 'tplId'
    },
	  {
      label: '菜单URL',
      prop: 'menuUrl'
    },
	  {
      label: '排序',
      prop: 'menuSort'
    },
	  {
      label: '微信账号ID',
      prop: 'wxAccountId'
    },
	  {
      label: '小程序appid',
      prop: 'miniprogramAppid'
    },
	  {
      label: '小程序页面路径',
      prop: 'miniprogramPagepath'
    },
	  {
      label: '创建时间',
      prop: 'createTime'
    },
	  {
      label: '更新时间',
      prop: 'updateTime'
    }
  ]
}
