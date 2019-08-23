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
                 :page="page"
                 :data="tableData"
                 :table-loading="tableLoading"
                 :option="tableOption"
                 @on-load="getList"
                 @refresh-change="refreshChange"
                 @search-change="searchChange">
        <template slot-scope="scope"
                  slot="menu">
          <el-button type="text"
                     icon="el-icon-check"
                     size="mini"
                     plain
                     @click="handleDown(scope.row,scope.index)">生成
          </el-button>
        </template>
      </avue-crud>

      <el-dialog title="生成配置"
                 :visible.sync="box"
                 width="50%"
                 lock-scroll>
        <div class="pull-auto">
          <avue-form :option="formOption"
                     ref="formData"
                     v-model="formData"
                     @submit="gen">
          </avue-form>
        </div>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
    import {fetchList, handleDown} from '@/api/gen/gen'
    import {formOption, tableOption} from '@/const/crud/gen/gen'
    import {mapGetters} from 'vuex'

    export default {
        name: 'code-generator',
        data() {
            return {
                tableData: [],
                formData: {},
                box: false,
                page: {
                    total: 0, // 总页数
                    currentPage: 1, // 当前页数
                    pageSize: 20 // 每页显示多少条
                },
                tableLoading: false,
                tableOption: tableOption,
                formOption: formOption
            }
        },
        created() {
        },
        mounted: function () {
        },
        computed: {
            ...mapGetters(['permissions'])
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
            handleDown: function (row, index) {
                this.formData.tableName = row.tableName
                this.box = true
            },
            /**
             * 刷新回调
             */
            refreshChange() {
                this.getList(this.page)
            },
            searchChange(form) {
                this.getList(this.page, form)
            },
            gen(form, done) {
                handleDown(this.formData).then(() => {
                    this.box = true
                })
                done()
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>

