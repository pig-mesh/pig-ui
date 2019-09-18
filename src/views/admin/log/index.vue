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
  <div class="log">
    <basic-container>
      <avue-crud ref="crud"
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 :permission="permissionList"
                 @on-load="getList"
                 @search-change="searchChange"
                 @refresh-change="refreshChange"
                 @row-del="rowDel">
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
  import {delObj, fetchList} from '@/api/admin/log'
  import {tableOption} from '@/const/crud/admin/log'
  import {mapGetters} from 'vuex'

  export default {
    name: 'log',
    data() {
      return {
        tableData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption
      }
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
          return {
              delBtn: this.vaildData(this.permissions.sys_log_del, false),
          }
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          descs: 'create_time',
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },
      rowDel: function (row, index) {
        var _this = this
        this.$confirm('是否确认删除ID为"' + row.id + '"的日志?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.id)
        }).then(data => {
          this.getList(this.page)
          _this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          })
        }).catch(function (err) {
        })
      },
      /**
       * 搜索回调
       */
      searchChange(form) {
        this.getList(this.page, form)
      },
      /**
       * 刷新回调
       */
      refreshChange() {
        this.getList(this.page)
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

