<template>
  <div v-if="props.objData.type === 'image'">
    <div class="waterfall" v-loading="state.loading">
      <div class="waterfall-item" v-for="item in state.dataList" :key="item.mediaId">
        <img class="material-img" :src="item.url" />
        <p class="item-name">{{ item.name }}</p>
        <el-row class="ope-row">
          <el-button size="mini" type="success" @click="selectMaterial(item)"
          >选择
            <el-icon class="el-icon--right"><el-icon-circle-check /></el-icon>
          </el-button>
        </el-row>
      </div>
    </div>
    <pagination v-bind="state.pagination"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"/>
  </div>
  <div v-else-if="props.objData.type === 'voice'">
    <!-- 列表 -->
    <el-table v-loading="state.loading" :data="state.dataList">
      <el-table-column label="编号" align="center" prop="mediaId" />
      <el-table-column label="文件名" align="center" prop="name" />
      <el-table-column label="语音" align="center">
        <template v-slot="scope">
          <wx-voice-player :url="scope.row.url" />
        </template>
      </el-table-column>
      <el-table-column
          label="上传时间"
          align="center"
          prop="createTime"
          width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-plus"
              @click="selectMaterial(scope.row)"
          >选择</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination v-bind="state.pagination"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"/>
  </div>
  <div v-else-if="props.objData.type === 'video'">
    <!-- 列表 -->
    <el-table v-loading="state.loading" :data="state.dataList">
      <el-table-column label="编号" align="center" prop="mediaId" />
      <el-table-column label="文件名" align="center" prop="name" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="介绍" align="center" prop="introduction" />
      <el-table-column label="视频" align="center" prop="url">
      </el-table-column>
      <el-table-column
          label="上传时间"
          align="center"
          prop="createTime"
          width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-plus"
              @click="selectMaterial(scope.row)"
          >选择</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination v-bind="state.pagination"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"/>
  </div>
  <div v-else-if="props.objData.type === 'news'">
    <div class="waterfall" v-loading="state.loading">
      <template v-for="item in state.dataList">
        <div v-if="item.content && item.content.newsItem" class="waterfall-item" :key="item.id">
<!--          <wx-news :articles="item.content.newsItem" />-->

          <el-row class="ope-row">
            <el-button size="mini" type="success" @click="selectMaterial(item)">
              选择<el-icon class="el-icon--right"
            ><el-icon-circle-check
            /></el-icon>
            </el-button>
          </el-row>
        </div>
      </template>
    </div>
    <pagination v-bind="state.pagination"
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"/>
  </div>

</template>

<script setup lang="ts" name="wx-material-select">

import {defineEmits} from "vue";
import {BasicTableProps, useTable} from "/@/hooks/table";
import {getPage} from "/@/api/mp/wx-material";

const emit = defineEmits(["selectMaterial"])

const props = defineProps({
  objData: {
    type: Object, // type - 类型；accountId - 公众号账号编号
    required: true,
  },
  newsType: {
    // 图文类型：1、已发布图文；2、草稿箱图文
    type: String,
    default: '1',
  },
})

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    type: props.objData.repType,
    appId: props.objData.accountId
  },
  pageList: getPage
})

const {
  currentChangeHandle,
  sizeChangeHandle
} = useTable(state)


const selectMaterial = (item : any) => {
  emit('selectMaterial', item,props.objData.accountId)
}


</script>
