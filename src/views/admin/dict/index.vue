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
      <avue-crud
        ref="crud"
        :page.sync="page"
        :data="tableData"
        :permission="permissionList"
        :table-loading="tableLoading"
        :option="tableOption"
        @on-load="getList"
        @row-update="handleUpdate"
        @row-save="handleSave"
        @search-change="searchChange"
        @size-change="sizeChange"
        @current-change="currentChange"
        @row-del="rowDel">
        <template
          slot-scope="scope"
          slot="menu">
          <el-button
            v-if="permissions.sys_dict_add"
            type="text"
            size="small"
            icon="el-icon-menu"
            @click="handleItem(scope.row,scope.index)">字典项
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog
      :visible.sync="dialogFormVisible"
      title="字典项管理"
      width="90%"
      @close="dictItemVisible">
      <avue-crud
        ref="crudItem"
        :page.sync="itemPage"
        :data="tableDictItemData"
        :permission="permissionList"
        v-model="form"
        :before-open="handleBeforeOpen"
        :option="tableDictItemOption"
        @size-change="itemSizeChange"
        @current-change="itemCurrentChange"
        @row-update="handleItemUpdate"
        @row-save="handleItemSave"
        @row-del="rowItemDel"/>
    </el-dialog>
  </div>
</template>

<script>
  import {addItemObj, addObj, delItemObj, delObj, fetchItemList, fetchList, putItemObj, putObj} from '@/api/admin/dict'
  import {tableDictItemOption, tableOption} from '@/const/crud/admin/dict'
  import {mapGetters} from 'vuex'

  export default {
    name: 'Dict',
    data() {
      return {
        searchForm: {},
        form: {
          type: undefined,
          dictId: undefined
        },
        dictType: undefined,
        dictId: undefined,
        dialogFormVisible: false,
        tableData: [],
        tableDictItemData: [],
        page: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        itemPage: {
          total: 0, // 总页数
          currentPage: 1, // 当前页数
          pageSize: 20 // 每页显示多少条
        },
        tableLoading: false,
        tableOption: tableOption,
        tableDictItemOption: tableDictItemOption
      }
    },
    computed: {
      ...mapGetters(['permissions']),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permissions.sys_dict_add, false),
          delBtn: this.vaildData(this.permissions.sys_dict_del, false),
          editBtn: this.vaildData(this.permissions.sys_dict_edit, false)
        }
      }
    },
    methods: {
      //======字典表格相关=====
      getList(page, params) {
        this.tableLoading = true
        fetchList(Object.assign({
          current: page.currentPage,
          size: page.pageSize
        }, params, this.searchForm)).then(response => {
          this.tableData = response.data.data.records
          this.page.total = response.data.data.total
          this.tableLoading = false
        })
      },
      rowDel: function (row) {
        this.$confirm('是否确认删除数据类型为"' + row.type + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delObj(row)
        }).then(() => {
          this.getList(this.page)
          this.$message.success('删除成功')
        }).catch(function () {
        })
      },
      handleUpdate: function (row, index, done) {
        putObj(row).then(() => {
          this.$message.success('修改成功')
          this.getList(this.page)
          done()
        })
      },
      handleSave: function (row, done) {
        addObj(row).then(() => {
          this.$message.success('添加成功')
          this.getList(this.page)
          done()
        })
      },
      searchChange(form, done) {
        this.searchForm = form
        this.page.currentPage = 1
        this.getList(this.page, form)
        done()
      },
      sizeChange(pageSize) {
        this.page.pageSize = pageSize
      },
      currentChange(current) {
        this.page.currentPage = current
      },
      //======字典项表格相关=====
      dictItemVisible: function () {
        this.dialogFormVisible = false
        this.itemPage.currentPage = 1
      },
      handleItem: function (row) {
        this.dictId = row.id
        this.dictType = row.type
        this.getDictItemList()
      },
      getDictItemList() {
        this.dialogFormVisible = true
        fetchItemList(Object.assign({
          current: this.itemPage.currentPage,
          size: this.itemPage.pageSize
        }, {dictId: this.dictId})).then(response => {
          this.tableDictItemData = response.data.data.records
          this.itemPage.total = response.data.data.total
        })
      },
      handleBeforeOpen(done) {
        this.form.type = this.dictType
        this.form.dictId = this.dictId
        done()
      },
      handleItemSave: function (row, done) {
        addItemObj(row).then(() => {
          this.$message.success('添加成功')
          this.getDictItemList()
          done()
        })
      },
      handleItemUpdate: function (row, index, done) {
        putItemObj(row).then(() => {
          this.$message.success('修改成功')
          this.getDictItemList()
          done()
        })
      },
      itemSizeChange(pageSize) {
        this.itemPage.pageSize = pageSize
        this.getDictItemList()
      },
      itemCurrentChange(current) {
        this.itemPage.currentPage = current
        this.getDictItemList()
      },
      rowItemDel: function (row) {
        this.$confirm('是否确认删除数据为"' + row.label + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          return delItemObj(row.id)
        }).then(() => {
          this.getDictItemList()
          this.$message.success('删除成功')
        }).catch(function () {
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>

