<template>
  <div class="layout-padding">
    <el-row :gutter="20">
      <el-col :md="4">
        <el-card class="layout-padding-auto" shadow="hover">
          <query-tree :query="deptData.queryList"
                      @node-click="handleNodeClick"/>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card class="layout-padding-auto" shadow="hover">
          <el-tabs v-model="materialType" @tab-click="handleClick">
            <el-tab-pane name="image" label="image">
              <template #label><i class="el-icon-picture"></i> 图片</template>
              <div class="add_but">
                <wx-file-upload @success="getDataList" :uploadData="uploadData" :type="['image/jpeg','image/png','image/gif','image/bmp','image/jpg']"></wx-file-upload>
              </div>
              <div v-loading="state.loading" class="waterfall">
                <div v-for="item in state.dataList" :key="item.id" class="waterfall-item">
                  <a target="_blank" :href="item.url">
                    <img class="material-img" :src="item.url">
                    <div class="item-name">{{ item.name }}</div>
                  </a>
                  <el-row class="ope-row">
                    <el-button type="danger" icon="el-icon-delete" circle @click="delMaterial(item)"></el-button>
                  </el-row>
                </div>
              </div>
              <div v-if="state.dataList.length <=0 && !state.loading" class="el-table__empty-block">
                <span class="el-table__empty-text">暂无数据</span>
              </div>
              <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
            </el-tab-pane>
            <el-tab-pane name="voice" label="voice">
              <template #label><i class="el-icon-microphone"></i> 语音</template>
              <div class="add_but">
                <wx-file-upload @success="getDataList" :uploadData="uploadData"></wx-file-upload>
              </div>
              <el-table
                  v-loading="state.loading"
                  :data="state.dataList"
                  stripe
                  border>
                <el-table-column
                    prop="mediaId"
                    label="media_id">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                  <template v-slot="scope">
                    <el-button
                        type="text"
                        icon="el-icon-download"
                        size="small"
                        plain
                        @click="handleDown(scope.row)">下载
                    </el-button>
                    <el-button
                        type="text"
                        icon="el-icon-delete"
                        size="small"
                        plain
                        @click="delMaterial(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-bind="state.pagination" @size-change="sizeChangeHandle" @current-change="currentChangeHandle"/>
            </el-tab-pane>
            <el-tab-pane name="video" label="video">
              <template #label><i class="el-icon-video-play"></i> 视频</template>
              <div class="add_but">
                <el-button size="mini" type="primary" @click="handleAddVideo">新建</el-button>
              </div>
              <el-dialog v-loading="addMaterialLoading" title="新建视频" v-model="dialogVideoVisible">
                <wx-file-upload @success="getDataList" :uploadData="uploadData" auto-upload="false" ref="uploadFileVideo" :type="['video/mp4']"></wx-file-upload>
                <el-form
                    ref="uploadForm"
                    :model="uploadData"
                    :rules="uploadRules">
                  <el-form-item label="标题" prop="title">
                    <el-input v-model="uploadData.title" placeholder="标题将展示在相关播放页面，建议填写清晰、准确、生动的标题"></el-input>
                  </el-form-item>
                  <el-form-item label="描述" prop="introduction">
                    <el-input
                        v-model="uploadData.introduction"
                        :rows="3"
                        type="textarea"
                        placeholder="介绍语将展示在相关播放页面，建议填写简洁明确、有信息量的内容"></el-input>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <el-button @click="dialogVideoVisible = false">取 消</el-button>
                  <el-button type="primary" @click="subVideo">提 交</el-button>
                </template>
              </el-dialog>
              <el-table
                  v-loading="state.loading"
                  :data="state.dataList"
                  stripe
                  border>
                <el-table-column
                    prop="mediaId"
                    label="media_id">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="名称">
                </el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="更新时间">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作">
                  <template v-slot="scope">
                    <el-button
                        type="text"
                        icon="el-icon-view"
                        size="small"
                        plain
                        @click="handleInfo(scope.row)">查看
                    </el-button>
                    <el-button
                        type="text"
                        icon="el-icon-delete"
                        size="small"
                        plain
                        @click="delMaterial(scope.row)">删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane name="news" label="news">
              <template #label><i class="el-icon-news"></i> 图文</template>
              <div class="add_but">
                <el-button type="primary" @click="handleAddNews">新 增</el-button>
              </div>
              <news-form ref="dialogNewsRef" @ok="getDataList"></news-form>
              <div v-loading="state.loading" class="waterfall">
                <div
                    v-for="item in state.dataList"
                    :key="item.id"
                    class="waterfall-item">
                  <wx-news :obj-data="item.content.newsItem"></wx-news>
                  <el-row class="ope-row">
                    <el-button type="primary" icon="el-icon-edit" circle @click="handleEditNews(item)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle @click="delMaterial(item)"></el-button>
                  </el-row>
                </div>
              </div>
              <div v-if="state.dataList.length <=0 && !state.loading" class="el-table__empty-block">
                <span class="el-table__empty-text">暂无数据</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>


</template>

<script setup lang="ts" name="wx-material">

import { fetchAccountList } from "/@/api/mp/wx-account";
import {useMessage, useMessageBox} from "/@/hooks/message";
import {BasicTableProps, useTable} from "/@/hooks/table";
import {delObj, getMaterialVideo, getPage} from '/@/api/mp/wx-material'

const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'))
const NewsForm = defineAsyncComponent(() => import("./components/news-form.vue"))
const WxFileUpload = defineAsyncComponent(() => import("/@/components/wechart/fileUpload/index.vue"))
const WxNews = defineAsyncComponent(() => import("/@/components/wechart/wx-news/index.vue"))

const deptData = reactive({
  queryList: () => {
    return fetchAccountList()
  }
})


const checkAppId = ref()

const uploadData = ref({
  appId: '',
  mediaType: 'image',
  title: '',
  introduction: '',
})

const materialType = ref("image")

// 点击树
const handleNodeClick = (data: any) => {
  checkAppId.value = data.appid
  uploadData.value.appId = data.appid
  state.queryForm.appId = data.appid
  state.queryForm.type = materialType.value
  getDataList()
}


const handleClick = (tab) =>  {
  if (checkAppId.value) {
    // getPage(this.page)
  } else {
    useMessage().error("请选择公众号")
  }
  materialType.value = tab.paneName
  uploadData.value.mediaType = tab.paneName
  state.queryForm.type = materialType.value
  getDataList()
}

const state: BasicTableProps = reactive<BasicTableProps>({
  queryForm: {
    appId: '',
    type: ''
  },
  pageList: getPage,
  createdIsNeed: false,
  props: {
    item: 'items',
    totalCount: 'totalCount'
  }
})


const {
  getDataList,
  currentChangeHandle,
  sizeChangeHandle,
} = useTable(state)

const delMaterial = (item: any) => {
  useMessageBox().confirm("此操作将永久删除该文件, 是否继续?").then(() => {
    delObj({
      id: item.mediaId,
      appId: checkAppId.value
    }).then(() => {
        getDataList()
    })
  })
}


// 视频

const dialogVideoVisible = ref(false)

const addMaterialLoading = ref(false)

const handleAddVideo = () => {
  dialogVideoVisible.value = true
}

const uploadRules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  introduction: [
    { required: true, message: '请输入描述', trigger: 'blur' }
  ]
})

const uploadForm = ref()

const uploadFileVideo = ref()

const subVideo = () => {
  uploadForm.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    uploadFileVideo.value.submit()
  }).finally(() => {
    dialogVideoVisible.value = false
  })
}


// 图文

const dialogNewsRef = ref()

const handleAddNews = () => {
  dialogNewsRef.value.openDialog({
    accountId: checkAppId.value
  })
}

const handleEditNews = (item) => {
  dialogNewsRef.value.openDialog({
    accountId: checkAppId.value,
  },JSON.parse(JSON.stringify(item.content.newsItem)),item.mediaId,'edit')
}

const handleInfo = (row) => {
  getMaterialVideo({
    mediaId: row.mediaId,
    appId: checkAppId.value
  }).then((response) => {
    const downUrl = response.data.downUrl
    window.open(downUrl, '_blank')
  })
}

</script>

<style scoped>

</style>
