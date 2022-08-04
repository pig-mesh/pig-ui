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
                 @refresh-change="refreshChange"
                 @search-change="searchChange"
                 @size-change="sizeChange"
                 @current-change="currentChange"
                 @row-save="handleSave"
                 @row-del="rowDel">
        <template #appName="scope">
          <el-tag type="success"
                  size="mini">{{scope.row.appName}}</el-tag>
        </template>
        <template #nickName="scope">
          <el-badge :value="scope.row.countMsg"
                    class="count-msg">
            <img class="head-img"
                 :src="scope.row.headimgUrl" />
          </el-badge>
        </template>
        <template #readFlag="scope">
          <el-tag :type="scope.row.readFlag == '1' ? 'success' : 'danger'"
                  size="mini">{{scope.row.$readFlag}}</el-tag>
        </template>
        <template #repContent="scope">
          <div class="nick-name">{{scope.row.nickName}}</div>
          <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'subscribe'">
            <el-tag type="success"
                    size="mini">关注</el-tag>
          </div>
          <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'unsubscribe'">
            <el-tag type="danger"
                    size="mini">取消关注</el-tag>
          </div>
          <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'CLICK'">
            <el-tag size="mini">点击菜单</el-tag>：【{{scope.row.repName}}】
          </div>
          <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'VIEW'">
            <el-tag size="mini">点击菜单链接</el-tag>：【{{scope.row.repUrl}}】
          </div>
          <div v-if="scope.row.repType == 'event' && scope.row.repEvent == 'scancode_waitmsg'">
            <el-tag size="mini">扫码结果：</el-tag>：【{{scope.row.repContent}}】
          </div>
          <div v-if="scope.row.repType == 'text'">{{scope.row.repContent}}</div>
          <div v-if="scope.row.repType == 'image'">
            <a target="_blank"
               :href="scope.row.repUrl"><img :src="scope.row.repUrl"
                   style="width: 100px"></a>
          </div>
          <div v-if="scope.row.repType == 'voice'">
            <WxVoicePlayer :objData="scope.row"></WxVoicePlayer>
          </div>
          <div v-if="scope.row.repType == 'video'">
            <WxVideoPlayer :objData="scope.row"
                           style="margin-top: 40px"></WxVideoPlayer>
          </div>
          <div v-if="scope.row.repType == 'shortvideo'">
            <WxVideoPlayer :objData="scope.row"
                           style="margin-top: 40px"></WxVideoPlayer>
          </div>
          <div v-if="scope.row.repType == 'link'">
            <el-tag size="mini">链接</el-tag>：<a :href="scope.row.repUrl"
               target="_blank">{{scope.row.repName}}</a>
          </div>
        </template>
        <template #menu="scope">
          <el-button type="text"
                     icon="el-icon-chat-line-round"
                     plain
                     @click="wxMsgDo(scope.row,scope.index)">消息</el-button>
        </template>
      </avue-crud>
      <el-dialog title="用户消息"
                 v-model="dialogMsgVisible"
                 width="40%">
        <WxMsg :wxUserId="wxUserId"
               :appId="appId"
               v-if="dialogMsgVisible"></WxMsg>
      </el-dialog>
    </basic-container>
  </div>
</template>

<script>
import { addObj, addResObj, delObj, delResObj, fetchList, fetchResList } from '@/api/mp/wxfansmsg'
import { tableOption } from '@/const/crud/mp/wxfansmsg'
import WxMsg from '@/components/wechat/WxMsg.vue'
import WxVideoPlayer from '@/components/wechat/WxVideoPlayer.vue'
import WxVoicePlayer from '@/components/wechat/WxVoicePlayer.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Wxfansmsg',
  components: {
    WxMsg,
    WxVideoPlayer,
    WxVoicePlayer
  },
  data () {
    return {
      appId: undefined,
      wxUserId: undefined,
      searchForm: {},
      dialogMsgVisible: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      pageRes: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      tableLoading: false,
      tableOption: tableOption,
      msgId: undefined
    }
  },
  computed: {
    ...mapGetters(['permissions']),
    permissionList () {
      return {
        addBtn: this.validData(this.permissions.mp_wxfansmsg_add, false),
        delBtn: this.validData(this.permissions.mp_wxfansmsg_del, false),
        editBtn: this.validData(this.permissions.mp_wxfansmsg_edit, false)
      }
    }
  },
  methods: {
    wxMsgDo (row) {
      this.wxUserId = row.wxUserId
      this.appId = row.appId
      this.dialogMsgVisible = true
    },
    getList (page, params) {
      this.tableLoading = true
      fetchList(Object.assign({
        current: page.currentPage,
        size: page.pageSize,
        descs: 'create_time'
      }, params, this.searchForm)).then(response => {
        this.tableData = response.data.data.records
        this.page.total = response.data.data.total
        this.tableLoading = false
      })
    },
    getResList (pageRes, params) {
      fetchResList(Object.assign({
        current: pageRes.currentPage,
        size: pageRes.pageSize
      }, params)).then(response => {
        this.tableResData = response.data.data.records
        this.pageRes.total = response.data.data.total
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
    handleSave: function (row, done) {
      addObj(row).then(() => {
        this.tableResData.push(Object.assign({}, row))
        this.$message({
          showClose: true,
          message: '添加成功',
          type: 'success'
        })
        done()
        this.getList(this.page)
      })
    },
    rowResDel: function (row) {
      var _this = this
      this.$confirm('是否确认删除ID为' + row.id, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delResObj(row.id)
      }).then(() => {
        _this.$message({
          showClose: true,
          message: '删除成功',
          type: 'success'
        })
        this.getResList(this.pageRes, { fansMsgId: this.msgId })
      }).catch(function () {
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
    searchChange (form, done) {
      this.searchForm = form
      this.page.currentPage = 1
      this.getList(this.page, form)
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
