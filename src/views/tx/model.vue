<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="execution">
    <basic-container>
      <avue-crud :data="data" :option="option"/>
    </basic-container>
  </div>
</template>
<script>
import request from '@/router/axios'

export default {
  data() {
    return {
      obj: {},
      data: [],
      option: {
        menu: false,
        page: false,
        addBtn: false,
        align: 'center',
        menuAlign: 'center',
        column: [
          {
            label: '模块名称',
            prop: 'model'
          },
          {
            label: '唯一标示',
            prop: 'uniqueKey'
          },
          {
            label: '模块地址',
            prop: 'ipAddress'
          },
          {
            label: '管道名称',
            prop: 'channelName'
          }
        ]
      }
    }
  },
  created() {
    request({
      url: '/tx/admin/onlines',
      method: 'get'
    }).then((resp) => {
      this.data = resp.data
    })
  }
}
</script>
