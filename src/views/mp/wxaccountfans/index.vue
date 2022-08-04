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
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-select v-model="q.wxAccountAppid"
                       placeholder="请选择公众号">
              <el-option v-for="item in wxAccountList"
                         :key="item.appid"
                         :label="item.name"
                         :value="item.appid" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="q.nickname"
                      placeholder="请输入昵称" />
          </div>
        </el-col>

        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">搜索</el-button>
            <el-button v-if="permissions.mp_wxaccountfans_sync"
                       type="primary"
                       icon="el-icon-sort"
                       @click="asyncFans">同步</el-button>
          </div>
        </el-col>
      </el-row>
      <avue-crud ref="crud"
                 v-model:page="page"
                 :data="tableData"
                 :permission="permissionList"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel" />
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, putObj, sync } from '@/api/mp/wxaccountfans'
import { fetchAccountList } from '@/api/mp/wxaccount'
import { tableOption } from '@/const/crud/mp/wxaccountfans'
import { mapGetters } from 'vuex'

export default {
  name: 'Wxaccountfans',
  data () {
    return {
      q: {},
      tableData: [],
      wxAccountList: [],
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
    this.getAccountList()
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList () {
      return {
        addBtn: this.validData(this.permissions.mp_wxaccountfans_add, false),
        delBtn: this.validData(this.permissions.mp_wxaccountfans_del, false),
        editBtn: this.validData(this.permissions.mp_wxaccountfans_edit, false)
      }
    }
  },
  methods: {
    getAccountList () {
      fetchAccountList().then(response => {
        this.wxAccountList = response.data.data
      })
    },
    getList (page, params) {
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
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row.id)
      }).then(() => {
        _this.tableData.splice(index, 1)
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getList(this.page)
      }).catch(function () {
      })
    },
    /**
       * @title 数据更新
       * @param row 为当前的数据
       * @param index 为当前更新数据的行数
       * @param done 为表单关闭函数
       *
       **/
    handleUpdate: function (row, index, done) {
      putObj(row).then(() => {
        this.tableData.splice(index, 1, Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      })
    },
    /**
       * @title 数据添加
       * @param row 为当前的数据
       * @param done 为表单关闭函数
       *
       **/
    handleSave: function (row, done) {
      addObj(row).then(() => {
        this.tableData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      })
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize
    },
    currentChange (current) {
      this.page.currentPage = current
    },
    refreshChange () {
      this.getList(this.page)
    },
    search () {
      this.getList(this.page, this.q)
    },
    asyncFans () {
      if (this.q.wxAccountAppid) {
        sync(this.q.wxAccountAppid).then(() => {
          this.$message({
            showClose: true,
            message: '已开始从微信同步粉丝信息，建议等待后查询',
            type: 'success'
          })
        })
        this.getList(this.page)
      } else {
        this.$message.error('请选择公众号')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
