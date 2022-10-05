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
                 :permission="permissionList"
                 @on-load="getList"
                 :before-open="beforeOpen"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template #menu-left="scope">
          <el-button
            v-if="permissions.sys_client_del"
            class="filter-item"
            type="primary"
            icon="el-icon-refresh-left"
            @click="handleClearClientCache"
          >缓存
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
  </div>
</template>

<script>
import {addObj, clearClientCache, delObj, fetchList, putObj} from '@/api/admin/client'
  import {tableOption} from '@/const/crud/admin/client'
  import {mapGetters} from 'vuex'
  import {clearDictCache} from "@/api/admin/dict";

  export default {
    name: 'client',
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
    created() {
    },
    mounted: function () {
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.validData(this.permissions.sys_client_add, false),
          delBtn: this.validData(this.permissions.sys_client_del, false),
          editBtn: this.validData(this.permissions.sys_client_edit, false)
        }
      }
    },
    methods: {
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },
      rowDel: function (row, index) {
        this.$confirm('是否确认删除ID为' + row.clientId, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row.clientId)
        }).then(data => {
          this.$message.success('删除成功')
          this.refreshChange()
        })
      },
      handleUpdate: function (row, index, done) {
        putObj(row).then(() => {
          this.$message.success('修改成功')
          this.refreshChange()
          done()
        }).catch(()=>{
          done()
        })
      },
      handleSave: function (row, done) {
        addObj(row).then(() => {
          this.$message.success('添加成功')
          this.refreshChange()
          done()
        }).catch(()=>{
          done()
        })
      },
      refreshChange() {
        this.getList(this.page)
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
      beforeOpen(show, type) {
        window.boxType = type
        show()
      },
      handleClearClientCache: function () {
        clearClientCache().then(() => {
          this.$message.success('清除缓存成功')
        }).catch(function () {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

