<!--
  - Copyright (C) 2018-2019
  - All rights reserved, Designed By www.joolun.com
-->
<template>
  <el-tabs type="border-card"
           v-model="objData.repType"
           @tab-click="handleClick">
    <el-tab-pane name="text">
      <template #label>
        <span><i class="el-icon-document"></i> 文本</span>
      </template>
      <el-input type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="objData.repContent">
      </el-input>
    </el-tab-pane>
    <el-tab-pane name="image">
      <template #label>
        <span><i class="el-icon-picture"></i> 图片</span>
      </template>
      <el-row>
        <div class="select-item"
             v-if="objData.repUrl">
          <img class="material-img"
               :src="objData.repUrl">
          <p class="item-name"
             v-if="objData.repName">{{objData.repName}}</p>
          <el-row class="ope-row">
            <el-button type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteObj"></el-button>
          </el-row>
        </div>
        <div v-if="!objData.repUrl">
          <el-row style="text-align: center">
            <el-col :span="12"
                    class="col-select">
              <el-button type="success"
                         @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
              </el-button>
            </el-col>
            <el-col :span="12"
                    class="col-add">
              <el-upload :action="actionUrl"
                         :headers="headers"
                         multiple
                         :limit="1"
                         :on-success="handleUploadSuccess"
                         :file-list="fileList"
                         :before-upload="beforeImageUpload"
                         :data="uploadData">
                <el-button type="primary">上传图片</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持bmp/png/jpeg/jpg/gif格式，大小不超过2M
                  </div>
                </template>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <el-dialog title="选择图片"
                   v-model="dialogImageVisible"
                   width="90%"
                   append-to-body>
          <WxMaterialSelect :objData="objData"
                            @selectMaterial="selectMaterial"></WxMaterialSelect>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="voice">
      <template #label>
        <span><i class="el-icon-phone"></i> 语音</span>
      </template>
      <el-row>
        <div class="select-item2"
             v-if="objData.repName">
          <p class="item-name">{{objData.repName}}</p>
          <div class="item-infos">
            <WxVoicePlayer :objData="Object.assign(tempPlayerObj,{repMediaId: objData.media_id, repName: objData.repName})"></WxVoicePlayer>
          </div>
          <el-row class="ope-row">
            <el-button type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteObj"></el-button>
          </el-row>
        </div>
        <div v-if="!objData.repName">
          <el-row style="text-align: center">
            <el-col :span="12"
                    class="col-select">
              <el-button type="success"
                         @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
              </el-button>
            </el-col>
            <el-col :span="12"
                    class="col-add">
              <el-upload :action="actionUrl"
                         :headers="headers"
                         multiple
                         :limit="1"
                         :on-success="handleUploadSuccess"
                         :file-list="fileList"
                         :before-upload="beforeVoiceUpload"
                         :data="uploadData">
                <el-button type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    格式支持mp3/wma/wav/amr，文件大小不超过2M，播放长度不超过60s
                  </div>
                </template>
              </el-upload>
            </el-col>
          </el-row>
        </div>
        <el-dialog title="选择语音"
                   v-model="dialogVoiceVisible"
                   width="90%"
                   append-to-body>
          <WxMaterialSelect :objData="objData"
                            @selectMaterial="selectMaterial"></WxMaterialSelect>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="video">
      <template #label>
        <span><i class="el-icon-share"></i> 视频</span>
      </template>
      <el-row>
        <el-input v-model="objData.repName"
                  placeholder="请输入标题"></el-input>
        <div style="margin: 20px 0;"></div>
        <el-input v-model="objData.repDesc"
                  placeholder="请输入描述"></el-input>
        <div style="margin: 20px 0;"></div>
        <div style="text-align: center;">
          <a target="_blank"
             v-if="objData.repUrl"
             :href="objData.repUrl"><i class="icon-bofang">&nbsp;播放视频</i></a>
        </div>
        <div style="margin: 20px 0;"></div>
        <div style="text-align: center">
          <el-button type="success"
                     @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
          </el-button>
        </div>
        <el-dialog title="选择视频"
                   v-model="dialogVideoVisible"
                   width="90%"
                   append-to-body>
          <WxMaterialSelect :objData="objData"
                            @selectMaterial="selectMaterial"></WxMaterialSelect>
        </el-dialog>
      </el-row>
    </el-tab-pane>
    <el-tab-pane name="news">
      <template #label>
        <span><i class="el-icon-news"></i> 图文</span>
      </template>
      <el-row>
        <div class="select-item"
             v-if="objData.content">
          <WxNews :objData="objData.content.articles"></WxNews>
          <el-row class="ope-row">
            <el-button type="danger"
                       icon="el-icon-delete"
                       circle
                       @click="deleteObj"></el-button>
          </el-row>
        </div>
        <div v-if="!objData.content">
          <el-row style="text-align: center">
            <el-col :span="24"
                    class="col-select2">
              <el-button type="success"
                         @click="openMaterial">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
        </div>
        <el-dialog title="选择图文"
                   v-model="dialogNewsVisible"
                   width="90%"
                   append-to-body>
          <WxMaterialSelect :objData="objData"
                            @selectMaterial="selectMaterial"></WxMaterialSelect>
        </el-dialog>
      </el-row>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getMaterialVideo, getPage } from '@/api/mp/wxmaterial'
import WxNews from '@/components/wechat/WxNews.vue'
import WxMaterialSelect from '@/components/wechat/WxMaterialSelect.vue'
import WxVoicePlayer from '@/components/wechat/WxVoicePlayer.vue'
import store from '@/store'


export default {
  name: "wxReplySelect",
  components: {
    WxNews,
    WxMaterialSelect,
    WxVoicePlayer
  },
  props: {
    objData: {
      type: Object
    }
  },
  data () {
    return {
      tempPlayerObj: {
        type: '2'
      },
      tableData: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        ascs: [],//升序字段
        descs: []//降序字段
      },
      tableLoading: false,
      dialogNewsVisible: false,
      dialogImageVisible: false,
      dialogVoiceVisible: false,
      dialogVideoVisible: false,
      dialogThumbVisible: false,
      tempObj: new Map().set(this.objData.repType, Object.assign({}, this.objData)),
      fileList: [],
      uploadData: {
        "mediaType": this.objData.repType,
        "title": '',
        "introduction": '',
        "appId": this.objData.appId
      },
      actionUrl: '/mp/wxmaterial/materialFileUpload',
      headers: {
        'TENANT-ID': store.getters.userInfo.tenantId,
        Authorization: 'Bearer ' + store.getters.access_token
      }
    }
  },
  methods: {
    beforeThumbImageUpload (file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp' || file.type === 'image/jpg';
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error('上传图片格式不对!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过2M!');
      }
      return isType && isLt;
    },
    deleteObj () {
      this.$delete(this.objData, 'repName')
      this.$delete(this.objData, 'repUrl')
      this.$delete(this.objData, 'content')
    },
    beforeVoiceUpload (file) {
      this.tableLoading = true
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isLt) {
        this.$message.error('上传语音大小不能超过2M!');
      }
      return isLt;
    },
    beforeImageUpload (file) {
      const isType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp' || file.type === 'image/jpg';
      const isLt = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error('上传图片格式不对!');
      }
      if (!isLt) {
        this.$message.error('上传图片大小不能超过2M!');
      }
      return isType && isLt;
    },
    handleUploadSuccess (response, file, fileList) {
      if (response.code == 0) {
        this.fileList = []
        this.uploadData.title = ''
        this.uploadData.introduction = ''
        let item = response.data
        this.selectMaterial(item)
      } else {
        this.$message.error('上传出错：' + response.msg)
      }
    },
    handleClick (tab, event) {
      this.uploadData.mediaType = this.objData.repType
      let tempObjItem = this.tempObj.get(this.objData.repType)
      if (tempObjItem) {
        console.log(tempObjItem)
        this.objData.repName = tempObjItem.repName ? tempObjItem.repName : null
        this.objData.repMediaId = tempObjItem.repMediaId ? tempObjItem.repMediaId : null
        this.objData.media_id = tempObjItem.media_id ? tempObjItem.media_id : null
        this.objData.repUrl = tempObjItem.repUrl ? tempObjItem.repUrl : null
        this.objData.content = tempObjItem.content ? tempObjItem.content : null
        this.objData.repDesc = tempObjItem.repDesc ? tempObjItem.repDesc : null
      } else {
        this.$delete(this.objData, 'repName')
        this.$delete(this.objData, 'repMediaId')
        this.$delete(this.objData, 'media_id')
        this.$delete(this.objData, 'repUrl')
        this.$delete(this.objData, 'content')
        this.$delete(this.objData, 'repDesc')
      }
    },
    selectMaterial (item, appId) {
      let tempObjItem = {}
      tempObjItem.repType = this.objData.repType
      tempObjItem.repMediaId = item.mediaId
      tempObjItem.media_id = item.mediaId
      tempObjItem.content = item.content

      this.dialogNewsVisible = false
      this.dialogImageVisible = false
      this.dialogVoiceVisible = false
      this.dialogVideoVisible = false
      this.objData.repMediaId = item.mediaId
      this.objData.media_id = item.mediaId
      this.objData.content = item.content
      if (this.objData.repType == 'music') {
        tempObjItem.repThumbMediaId = item.mediaId
        tempObjItem.repThumbUrl = item.url
        this.objData.repThumbMediaId = item.mediaId
        this.objData.repThumbUrl = item.url
        this.dialogThumbVisible = false
      } else {
        tempObjItem.repName = item.name
        tempObjItem.repUrl = item.url
        this.objData.repName = item.name
        this.objData.repUrl = item.url
      }
      if (this.objData.repType == 'video') {
        getMaterialVideo({
          mediaId: item.mediaId,
          appId: appId
        }).then(response => {
          let data = response.data.data
          this.$set(this.objData, 'repName', data.title)
          this.$set(this.objData, 'repDesc', data.description)
          this.$set(this.objData, 'repUrl', data.downUrl)
          tempObjItem.repDesc = data.description
          tempObjItem.repUrl = data.downUrl
        })
      }
      this.tempObj.set(this.objData.repType, tempObjItem)
    },
    openMaterial () {
      if (this.objData.repType == 'news') {
        this.dialogNewsVisible = true
      } else if (this.objData.repType == 'image') {
        this.dialogImageVisible = true
      } else if (this.objData.repType == 'voice') {
        this.dialogVoiceVisible = true
      } else if (this.objData.repType == 'video') {
        this.dialogVideoVisible = true
      } else if (this.objData.repType == 'music') {
        this.dialogThumbVisible = true
      }
    },
    getPage (page, params) {
      this.tableLoading = true
      getPage(Object.assign({
        current: page.currentPage,
        size: page.pageSize,
        type: this.objData.repType
      }, params)).then(response => {
        this.tableData = response.data.items
        this.page.total = response.data.totalCount
        this.page.currentPage = page.currentPage
        this.page.pageSize = page.pageSize
        this.tableLoading = false
      })
    },
    sizeChange (val) {
      this.page.currentPage = 1
      this.page.pageSize = val
      this.getPage(this.page)
    }
  }
};
</script>

<style lang="scss" scoped>
.public-account-management {
  .el-input {
    width: 70%;
    margin-right: 2%;
  }
}

.pagination {
  text-align: right;
  margin-right: 25px;
}

.select-item {
  width: 280px;
  padding: 10px;
  margin: 0 auto 10px auto;
  border: 1px solid #eaeaea;
}

.select-item2 {
  padding: 10px;
  margin: 0 auto 10px auto;
  border: 1px solid #eaeaea;
}

.ope-row {
  padding-top: 10px;
  text-align: center;
}

.item-name {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.el-form-item__content {
  line-height: unset !important;
}

.col-select {
  border: 1px solid rgb(234, 234, 234);
  padding: 50px 0px;
  height: 160px;
  width: 49.5%;
}

.col-select2 {
  border: 1px solid rgb(234, 234, 234);
  padding: 50px 0px;
  height: 160px;
}

.col-add {
  border: 1px solid rgb(234, 234, 234);
  padding: 50px 0px;
  height: 160px;
  width: 49.5%;
  float: right;
}

.avatar-uploader-icon {
  border: 1px solid #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 100px !important;
  height: 100px !important;
  line-height: 100px !important;
  text-align: center;
}

.material-img {
  width: 100%;
}

.thumb-div {
  display: inline-block;
  text-align: center;
}

.item-infos {
  width: 30%;
  margin: auto;
}
</style>
