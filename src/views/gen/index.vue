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
            <el-select v-model="q.dsName"
                       placeholder="请选择数据源"
                       @change="search">
              <el-option v-for="item in dataSourceList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.name" />
            </el-select>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">
            <el-input v-model="q.tableName"
                      placeholder="表名称" />
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-button type="primary"
                       icon="el-icon-search"
                       @click="search">搜索</el-button>
            <el-button type="primary"
                       icon="el-icon-document"
                       @click="downDocument">导出文档</el-button>
            <el-button type="primary"
                       icon="el-icon-download"
                       @click="openBatch">批量生成</el-button>
          </div>
        </el-col>
      </el-row>
      <avue-crud ref="crud"
                 v-model:page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @refresh-change="refreshChange">
        <template #menu="scope">
          <el-button type="text"
                     icon="el-icon-view"
                     @click="handleTable(scope.row,scope.index)">字段
          </el-button>
          <el-button type="text"
                     icon="el-icon-check"
                     @click="handleDown(scope.row,scope.index)">生成
          </el-button>
          <el-button type="text"
                     icon="el-icon-edit"
                     @click="handleDesign(scope.row,scope.index)">设计
          </el-button>
        </template>
      </avue-crud>

      <el-dialog v-model="box"
                 title="生成配置"
                 width="50%"
                 lock-scroll>
        <div class="pull-auto">
          <avue-form ref="formData"
                     :option="formOption"
                     v-model="formData">
            <template #menuForm="{}">
              <el-button type="primary"
                         icon="el-icon-view"
                         plain
                         @click="handleView()">预览
              </el-button>
              <el-button type="info"
                         icon="el-icon-check"
                         plain
                         @click="gen()">下载
              </el-button>
            </template>
          </avue-form>
        </div>
      </el-dialog>
      <el-dialog v-model="boxBatch"
                 title="批量生成"
                 width="50%"
                 lock-scroll>
        <div class="pull-auto">
          <avue-form ref="formBatchData"
                     :option="formBatchOption"
                     v-model="formBatchData"
                     @submit="batchGen" />
        </div>
      </el-dialog>

    </basic-container>
    <!-- 预览界面 -->
    <el-dialog :title="preview.title"
               v-model="preview.open"
               width="80%"
               top="5vh"
               append-to-body>
      <Preview :queryData="this.formData"
               v-if="preview.open" />
    </el-dialog>
    <!--表字段-->
    <el-dialog :title="table.title"
               v-model="table.open"
               width="80%"
               top="5vh"
               append-to-body>
      <Table :queryData="this.formData"
             v-if="table.open" />
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchSelectDsList, handleDown } from '@/api/gen/gen'
import { formBatchOption, formOption, tableOption } from '@/const/crud/gen/gen'
import Preview from './preview.vue'
import Table from './table.vue'

export default {
  name: 'CodeGenerator',
  components: { Preview, Table },
  data () {
    return {
      q: {},
      dataSourceList: [],
      tableData: [],
      formData: {},
      formBatchData: {},
      box: false,
      boxBatch: false,
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      formOption: formOption,
      formBatchOption: formBatchOption,
      // 预览参数
      preview: {
        open: false,
        title: "代码预览"
      },
      table: {
        open: false,
        title: "字段预览"
      }
    }
  },
  created () {
    this.getDataSourceList()
  },
  methods: {
    getList (page) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize
      }, this.q)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    handleView: function () {
      this.formData.dsName = this.q.dsName
      this.preview.open = true
      this.table.open = false
    },
    handleDesign: function (row) {
      this.$router.push({ path: '/gen/design', query: { tableName: row.tableName, dsName: this.q.dsName } })
    },
    handleTable: function (row) {
      this.formData.tableName = row.tableName
      this.formData.dsName = this.q.dsName
      this.table.open = true
      this.preview.open = false
    },
    handleDown: function (row) {
      this.formData.tableName = row.tableName
      this.box = true
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
    gen () {
      this.formData.dsName = this.q.dsName
      handleDown(this.formData).then(() => {
        this.box = false
      })
    },
    getDataSourceList () {
      fetchSelectDsList().then(response => {
        this.dataSourceList = response.data.data
      })
    },
    search () {
      this.getList(this.page)
    },
    openBatch () {
      if (this.$refs.crud.tableSelect.length <= 1 || this.$refs.crud.tableSelect.length > 10) {
        this.$message.error('选中表数量不合法，数量最少2个或最多为10个')
        return false
      }
      let tableName = []
      for (const table of this.$refs.crud.tableSelect) {
        tableName.push(table.tableName)
      }
      this.formBatchData.tableName = tableName.join('-')
      this.boxBatch = true
    },
    batchGen (form, done) {
      this.formBatchData.dsName = this.q.dsName
      handleDown(this.formBatchData).then(() => {
        done()
        this.boxBatch = false
      }).catch(() => {
        done()
      })
    },
    downDocument () {
      let tableNames = []
      for (const table of this.$refs.crud.tableSelect) {
        tableNames.push(table.tableName)
      }
      let queryParams = { dsName: this.q.dsName, tableNames: tableNames }
      this.downBlobFile("/gen/generator/doc", queryParams, this.q.dsName + ".html");
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

