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
      <avue-crud ref="dscrud"
                 v-model="dsForm"
                 v-model:page="dsPage"
                 :data="tableDsData"
                 :option="tableDsOption"
                 :before-open="handleOpenBefore"
                 @row-update="handleUpdate"
                 @row-save="handleSave"
                 @row-del="rowDel"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @refresh-change="refreshDsChange"
                 @on-load="getDsList" />
    </basic-container>
  </div>
</template>

<script>
import { addObj, delObj, fetchDsList, putObj } from "@/api/gen/gen";
import { formOption, tableDsOption, tableOption } from "@/const/crud/gen/gen";

export default {
  name: "CodeGenerator",
  data () {
    return {
      dataSourceList: [],
      tableDsData: [],
      box: false,
      dsPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
      },
      dsForm: {},
      tableLoading: false,
      tableOption: tableOption,
      tableDsOption: tableDsOption,
      formOption: formOption,
    };
  },
  watch: {
    "dsForm.confType" () {
      this.$refs.dscrud.option.column.filter((item) => {
        if (item.prop === "url") {
          item.addDisplay = this.dsForm.confType === 1;
          item.editDisplay = this.dsForm.confType === 1;
        }

        if (item.prop === "host") {
          item.addDisplay = this.dsForm.confType !== 1;
          item.editDisplay = this.dsForm.confType !== 1;
        }

        if (item.prop === "port") {
          item.addDisplay = this.dsForm.confType !== 1;
          item.editDisplay = this.dsForm.confType !== 1;
        }

        if (item.prop === "dsName") {
          item.addDisplay = this.dsForm.confType !== 1;
          item.editDisplay = this.dsForm.confType !== 1;
        }

        if (item.prop === "instance") {
          item.addDisplay =
            this.dsForm.dsType === "mssql" && this.dsForm.confType === 0;
          item.editDisplay =
            this.dsForm.dsType === "mssql" && this.dsForm.confType === 0;
        }
      });
    },
    "dsForm.dsType" () {
      this.$refs.dscrud.option.column.filter((item) => {
        if (item.prop === "instance") {
          item.addDisplay =
            this.dsForm.dsType === "mssql" && this.dsForm.confType === 0;
          item.editDisplay =
            this.dsForm.dsType === "mssql" && this.dsForm.confType === 0;
        }

        if (item.prop === "port") {
          if (this.dsForm.dsType === "mysql") {
            this.dsForm.port = 3306;
          }

          if (this.dsForm.dsType === "oracle") {
            this.dsForm.port = 1521;
          }

          if (this.dsForm.dsType === "pg") {
            this.dsForm.port = 5432;
          }

          if (this.dsForm.dsType === "mssql") {
            this.dsForm.port = 1433;
          }

          if (this.dsForm.dsType === "db2") {
            this.dsForm.port = 50000;
          }
        }
      });
    },
  },
  methods: {
    rowDel: function (row, index) {
      this.$confirm("是否确认删除ID为" + row.id, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delObj(row.id);
        })
        .then(() => {
          this.$message.success("删除成功");
          this.getDsList(this.dsPage);
        });
    },
    handleOpenBefore: function (show) {
      this.dsForm.password = undefined;
      show();
    },
    handleUpdate: function (row, index, done) {
      putObj(row).then((res) => {
        if (res.data.data) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败，数据源不可访问");
        }
        done();
        this.getDsList(this.dsPage);
      });
    },
    handleSave: function (row, done) {
      addObj(row).then((res) => {
        if (res.data.data) {
          this.$message.success("添加成功");
        } else {
          this.$message.error("添加失败，数据源不可访问");
        }
        done();
        this.getDsList(this.dsPage);
      });
    },
    getDsList (page, params) {
      fetchDsList(
        Object.assign(
          {
            current: page.currentPage,
            size: page.pageSize,
          },
          params
        )
      ).then((response) => {
        this.tableDsData = response.data.data.records;
        this.dsPage.total = response.data.data.total;
      });
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    currentChange (current) {
      this.page.currentPage = current;
    },
    refreshDsChange () {
      this.getDsList(this.dsPage);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

