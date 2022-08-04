<!--
  - Copyright (C) 2018-2019
  - All rights reserved, Designed By www.joolun.com
-->
<template>
  <div v-if="objData.repType == 'image'">
    <div class="waterfall"
         v-loading="tableLoading">
      <div class="waterfall-item"
           v-for="item in tableData"
           :key="item.mediaId">
        <img class="material-img"
             :src="item.url">
        <p class="item-name">{{item.name}}</p>
        <el-row class="ope-row">
          <el-button size="mini"
                     type="success"
                     @click="selectMaterial(item,objData.appId)">选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
        </el-row>
      </div>
    </div>
    <div v-if="tableData.length <=0 && !tableLoading"
         class="el-table__empty-block">
      <span class="el-table__empty-text">暂无数据</span>
    </div>
    <span class="dialog-footer">
      <el-pagination @size-change="sizeChange"
                     @current-change="currentChange"
                     v-model="page.currentPage"
                     :page-sizes="[10, 20]"
                     :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"
                     class="pagination">
      </el-pagination>
    </span>
  </div>
  <div v-else-if="objData.repType == 'voice'">
    <avue-crud ref="crud"
               v-model:page="page"
               :data="tableData"
               :table-loading="tableLoading"
               :option="tableOptionVoice"
               @on-load="getPage"
               @size-change="sizeChange"
               @refresh-change="refreshChange">
      <template #menu="scope">
        <el-button type="text"
                   icon="el-icon-circle-plus"
                   plain
                   @click="selectMaterial(scope.row,objData.appId)">选择</el-button>
      </template>
    </avue-crud>
  </div>
  <div v-else-if="objData.repType == 'video'">
    <avue-crud ref="crud"
               v-model:page="page"
               :data="tableData"
               :table-loading="tableLoading"
               :option="tableOptionVideo"
               @on-load="getPage"
               @size-change="sizeChange"
               @refresh-change="refreshChange">
      <template #menu="scope">
        <el-button type="text"
                   icon="el-icon-circle-plus"
                   plain
                   @click="selectMaterial(scope.row,objData.appId)">选择</el-button>
      </template>
    </avue-crud>
  </div>
  <div v-else-if="objData.repType == 'news'">
    <div class="waterfall"
         v-loading="tableLoading">
      <template v-for="item in tableData">
        <div class="waterfall-item"
             :key="item.mediaId"
             v-if="item.content && item.content.articles">
          <WxNews :objData="item.content.articles"></WxNews>
          <el-row class="ope-row">
            <el-button size="mini"
                       type="success"
                       @click="selectMaterial(item,objData.appId)">选择<i class="el-icon-circle-check el-icon--right"></i></el-button>
          </el-row>
        </div>
      </template>
    </div>
    <div v-if="tableData.length <=0 && !tableLoading"
         class="el-table__empty-block">
      <span class="el-table__empty-text">暂无数据</span>
    </div>
    <span class="dialog-footer">
      <el-pagination @size-change="sizeChange"
                     v-model="page.currentPage"
                     :page-sizes="[10, 20]"
                     :page-size="page.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="page.total"
                     class="pagination">
      </el-pagination>
    </span>
  </div>
</template>

<script>
import { getPage, getMaterialVideo } from '@/api/mp/wxmaterial'
import { tableOptionVoice } from '@/const/crud/mp/wxmaterial_voice'
import { tableOptionVideo } from '@/const/crud/mp/wxmaterial_video'
import WxNews from '@/components/wechat/WxNews.vue'

export default {
  name: "wxMaterialSelect",
  components: {
    WxNews
  },
  props: {
    objData: {
      type: Object
    }
  },
  data () {
    return {
      tableLoading: false,
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        ascs: [],//升序字段
        descs: []//降序字段
      },
      tableOptionVoice: tableOptionVoice,
      tableOptionVideo: tableOptionVideo,
    }
  },
  created () {
    this.getPage(this.page)
  },
  methods: {
    selectMaterial (item, appId) {
      this.$emit('selectMaterial', item, appId)
    },
    getPage (page, params) {
      this.tableLoading = true
      getPage(Object.assign({
        current: page.currentPage,
        size: page.pageSize,
        type: this.objData.repType,
        appId: this.objData.appId
      }, params)).then(response => {
        this.tableData = response.data.data.items
        this.page.total = response.data.data.totalCount
        this.page.currentPage = page.currentPage
        this.page.pageSize = page.pageSize
        this.tableLoading = false
      })
    },
    sizeChange (val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getPage(this.page)
    },
    currentChange (val) {
      this.page.currentPage = val
      this.getPage(this.page)
    },
    /**
     * 刷新回调
     */
    refreshChange (page) {
      this.getPage(page)
    }
  }
};
</script>

<style lang="scss" scoped>
/*瀑布流样式*/
.waterfall {
  width: 100%;
  column-gap: 10px;
  column-count: 5;
  margin: 0 auto;
}
.waterfall-item {
  padding: 10px;
  margin-bottom: 10px;
  break-inside: avoid;
  border: 1px solid #eaeaea;
}
.material-img {
  width: 100%;
}
p {
  line-height: 30px;
}
@media (min-width: 992px) and (max-width: 1300px) {
  .waterfall {
    column-count: 3;
  }
  p {
    color: red;
  }
}
@media (min-width: 768px) and (max-width: 991px) {
  .waterfall {
    column-count: 2;
  }
  p {
    color: orange;
  }
}
@media (max-width: 767px) {
  .waterfall {
    column-count: 1;
  }
}
/*瀑布流样式*/
</style>
