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
                 :permission="permissionList"
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
        <template #menu-left="scope">
          <el-button
            v-if="permissions.sys_post_add"
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="$refs.crud.rowAdd()">添加
          </el-button>
          <el-button
            v-if="permissions.sys_post_import_export"
            class="filter-item"
            plain
            type="primary"
            icon="el-icon-upload"
            @click="$refs.excelUpload.show()"
          >导入
          </el-button>
          <el-button
            v-if="permissions.sys_post_import_export"
            class="filter-item"
            plain
            type="primary"
            icon="el-icon-download"
            @click="exportExcel"
          >导出
          </el-button>
        </template>
      </avue-crud>

      <!--excel 模板导入 -->
      <excel-upload
        ref="excelUpload"
        title="岗位信息导入"
        url="/admin/post/import"
        temp-name="岗位信息.xlsx"
        temp-url="/admin/sys-file/local/post.xlsx"
        @refreshDataList="handleRefreshChange"
      ></excel-upload>
    </basic-container>
  </div>
</template>

<script>
import {addObj, delObj, fetchList, putObj} from '@/api/admin/post'
import {tableOption} from '@/const/crud/admin/post'
import {mapGetters} from 'vuex'
import ExcelUpload from "@/components/ExcelUpload/index.vue";

export default {
  name: 'post',
  components: { ExcelUpload },
  data() {
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
  computed: {
    ...mapGetters(['permissions']),
    permissionList() {
      return {
        addBtn: this.validData(this.permissions.sys_post_add, false),
        delBtn: this.validData(this.permissions.sys_post_del, false),
        editBtn: this.validData(this.permissions.sys_post_edit, false)
      };
    }
  },
  methods: {
    exportExcel() {
      this.downBlobFile("/admin/post/export",{}, "post.xlsx");
    },
    handleRefreshChange() {
      this.getList(this.page)
    },
    getList(page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
      })
    },
    rowDel: function (row, index) {
      this.$confirm('是否确认删除' + row.postName, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.postId)
      }).then(data => {
        this.$message.success('删除成功')
        this.getList(this.page)
      })
    },
    handleUpdate: function (row, index, done, loading) {
      putObj(row).then(data => {
        this.$message.success('修改成功')
        done()
        this.getList(this.page)
      }).catch(() => {
        loading();
      });
    },
    handleSave: function (row, done, loading) {
      addObj(row).then(data => {
        this.$message.success('添加成功')
        done()
        this.getList(this.page)
      }).catch(() => {
        loading();
      });
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange(current) {
      this.page.currentPage = current
    },
    searchChange(form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    },
    refreshChange() {
      this.getList(this.page)
    }
  }
}
</script>
