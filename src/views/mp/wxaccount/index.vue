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
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @refresh-change="refreshChange"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template #menu="scope">
          <el-button v-if="permissionList.addBtn"
                     type="text"
                     icon="el-icon-upload"
                     @click="access(scope.row,scope.index)">
            接入
          </el-button>
          <el-button v-if="permissionList.addBtn"
                     type="text"
                     icon="el-icon-check"
                     @click="generateQr(scope.row,scope.index)">二维码
          </el-button>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog v-model="dialogFormVisible"
               title="接入">
      <el-row :gutter="20">
        <el-col :span="6">服务器地址(URL)</el-col>
        <el-col id="target"
                :span="12">{{ wxurl }}</el-col>
        <el-col :span="6">
          <el-button id="btn"
                     type="primary"
                     style="float: right;"
                     @click="copyLink">点击复制</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addObj, delObj, fetchList, generateQr, putObj } from '@/api/mp/wxaccount'
import { tableOption } from '@/const/crud/mp/wxaccount'
import { mapGetters } from 'vuex'
import Clipboard from 'clipboard'

export default {
  name: 'Wxaccount',
  data () {
    return {
      wxurl: '',
      dialogFormVisible: false,
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
    permissionList () {
      return {
        addBtn: this.validData(this.permissions.mp_wxaccount_add, false),
        delBtn: this.validData(this.permissions.mp_wxaccount_del, false),
        editBtn: this.validData(this.permissions.mp_wxaccount_edit, false)
      }
    }
  },
  methods: {
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
        _this.$message.success('删除成功')
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
      if (row.appsecret && row.appsecret.indexOf('*') > 0) {
        row.appsecret = undefined
      }

      putObj(row).then(() => {
        this.$message.success('删除成功')
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
      row.qrUrl = undefined
      addObj(row).then(() => {
        this.$message.success('保存成功')
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
    generateQr: function (row) {
      generateQr(row.appid).then(() => {
        this.$message.success('获取成功')
        this.getList(this.page)
      })
    },
    access: function (row) {
      this.dialogFormVisible = true
      this.wxurl = row.url + '/mp/' + row.appid + '/portal'
    },
    copyLink () {
      const clipboard = new Clipboard('#btn', {
        target: () => document.querySelector('#target')
      })
      // 复制成功执行的回调
      clipboard.on('success', () => {
        this.$message.success('复制成功')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
