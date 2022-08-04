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
      <avue-crud ref="crud"
                 v-model:page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @search-change="searchChange"
                 @refresh-change="refreshChange"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template #menuLeft="{}">
          <el-button v-if="permissions.act_leavebill_add"
                     type="primary"
                     @click="handleAdd">新 增
          </el-button>
        </template>
        <template #menuBtn="scope">
          <el-dropdown-item v-if="permissions.act_leavebill_edit && scope.row.state == 0"
                            divided
                            @click="handleSubmit(scope.row,scope.index)">提交
          </el-dropdown-item>
          <el-dropdown-item v-if="permissions.act_leavebill_edit"
                            divided
                            @click="handleEdit(scope.row,scope.index)">编辑
          </el-dropdown-item>

          <el-dropdown-item v-if="permissions.act_leavebill_del"
                            divided
                            @click="handleDel(scope.row,'suspend')">删除
          </el-dropdown-item>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj, submit } from '@/api/activiti/leave-bill'
import { tableOption } from '@/const/crud/activiti/leave-bill'
import { mapGetters } from 'vuex'

export default {
  name: 'LeaveBill',
  data () {
    return {
      searchForm: {},
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
  created () {
  },
  mounted: function () {
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  methods: {
    getList (page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        descs: 'create_time',
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    handleAdd: function () {
      this.$refs.crud.rowAdd()
    },
    handleEdit (row, index) {
      this.$refs.crud.rowEdit(row, index)
    },
    handleDel (row, index) {
      this.$refs.crud.rowDel(row, index)
    },
    rowDel: function (row, index) {
      this.$confirm('是否确认删除ID为' + row.leaveId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.leaveId)
      }).then(() => {
        this.$message.success('删除成功')
      })
    },
    handleSubmit: function (row, index) {
      this.$confirm('是否确认提交ID为' + row.leaveId, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return submit(row.leaveId)
      }).then(() => {
        this.$message.success('提交成功')
        this.getList(this.page)
      })
    },
    handleUpdate: function (row, index, done) {
      putObj(row).then(() => {
        this.$message.success('修改成功')
        done()
        this.getList(this.page)
      })
    },
    handleSave: function (row, done) {
      addObj(row).then(() => {
        this.$message.success('添加成功')
        done()
        this.getList(this.page)
      })
    },
    searchChange (form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange (current) {
      this.page.currentPage = current
    },
    refreshChange () {
      this.getList(this.page)
    }
  }
}
</script>

