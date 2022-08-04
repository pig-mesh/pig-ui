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
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @refresh-change="refreshChange">
        <template #menuBtn="scope">
          <el-dropdown-item v-if="permissions.act_task_manage"
                            divided
                            @click="audit(scope.row,scope.index)">审批
          </el-dropdown-item>
          <el-dropdown-item v-if="permissions.act_task_manage"
                            divided
                            @click="comment(scope.row,scope.index)">批注
          </el-dropdown-item>
          <el-dropdown-item v-if="permissions.act_task_manage"
                            divided
                            @click="viewPic(scope.row,scope.index)">流程图
          </el-dropdown-item>
        </template>
      </avue-crud>
    </basic-container>
    <el-dialog v-model="showTask"
               title="任务办理">
      <avue-form ref="form"
                 v-model="obj"
                 :option="formOption">
        <template #menuForm="scope">
          <el-button v-for="flag in flagList"
                     :key="flag"
                     icon="el-icon-check"
                     plain
                     @click="handleTask(scope.row,flag)">{{ flag }}
          </el-button>
        </template>
      </avue-form>
    </el-dialog>
    <el-dialog v-model="showComment"
               title="批注列表">
      <avue-crud :data="taskTableData"
                 :option="taskOption" />
    </el-dialog>
    <el-dialog v-model="showPicDialog"
               title="流程图">
      <img v-if="showPicDialog"
           :src="actPicUrl"
           width="100%">
    </el-dialog>
  </div>
</template>

<script>
import { doTask, fetchComment, fetchDetail, fetchList } from '@/api/activiti/task'
import { formOption, tableOption, taskOption } from '@/const/crud/activiti/task'
import { mapGetters } from 'vuex'

export default {
  name: 'Task',
  data () {
    return {
      actPicUrl: '',
      obj: {},
      flagList: [],
      showTask: false,
      showComment: false,
      showPicDialog: false,
      tableData: [],
      taskTableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      formOption: formOption,
      taskOption: taskOption
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
        current: page.currentPage,
        size: page.pageSize
      }, params)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    audit: function (row) {
      fetchDetail(row.taskId).then(response => {
        this.obj = response.data.data
        // 根据连线判断下次的流程
        this.flagList = this.obj.flagList
        this.showTask = true
      })
      this.obj = row
    },
    comment: function (row) {
      fetchComment(row.taskId).then(response => {
        this.taskTableData = response.data.data
      })
      this.showComment = true
    },
    handleTask: function (row, result) {
      this.obj.taskFlag = result
      this.$refs.form.validate(valid => {
        if (valid) {
          doTask(this.obj).then(() => {
            this.$message({
              showClose: true,
              message: '提交成功',
              type: 'success'
            })
            this.showTask = false
            this.getList(this.page)
          })
        }
      })
    },
    viewPic: function (row) {
      this.actPicUrl = `/act/task/view/` + row.taskId
      this.showPicDialog = true
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

<style lang="scss" scoped>
</style>

