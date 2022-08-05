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
  viewBtn:false,
  searchMenuSpan: 6,
  editBtn:false,
  saveBtn: false,
  addBtn: true,
  column: [
	  {
      label: '编号',
      prop: 'id',
      hide: true,
      addDisplay: false
    },
    {
      hide: true,
      label: '附件上传',
      prop: 'imgUrl',
      type: 'upload',
      loadText: '附件上传中，请稍等',
      span: 24,
      propsHttp: {
        res: 'data'
      },
      tip: '上传同步至文件服务器',
      action: "/admin/sys-file/upload"
    },
    {
      label: '空间',
      prop: 'bucketName',
      overHidden:true,
      addDisplay: false
    },
	  {
      label: '文件名',
      prop: 'fileName',
      overHidden:true,
      search: true,
      addDisplay: false
    },
	  {
      label: '原文件名',
      prop: 'original',
      overHidden:true,
      addDisplay: false
    },
	  {
      label: '文件类型',
      prop: 'type',
      addDisplay: false
    },
	  {
      label: '文件大小',
      prop: 'fileSize',
      addDisplay: false
    },
    {
      label: '上传人',
      prop: 'createBy',
      addDisplay: false
    },
    {
      width: 180,
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      editDisabled: true,
      addDisplay: false,
      span: 24,
    }
  ]
}
