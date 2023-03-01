<template>
  <el-tabs v-model="props.objData.repType" type="border-card" @tab-click="handleClick">
    <el-tab-pane name="text" label="text">
      <template #label><i class="el-icon-document"></i> 文本</template>
      <el-input
          v-model="props.objData.repContent"
          type="textarea"
          :rows="5"
          placeholder="请输入内容">
      </el-input>
    </el-tab-pane>

    <el-tab-pane name="image" label="image">
      <template #label><i class="el-icon-picture"></i> 图片</template>
      <el-row>
        <div v-if="objData.repUrl" class="select-item">
          <img class="material-img" :src="objData.repUrl">
          <p v-if="objData.repName" class="item-name">{{ objData.repName }}</p>
          <el-row class="ope-row">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteObj"></el-button>
          </el-row>
        </div>
        <div v-if="!objData.repUrl">
          <el-row style="text-align: center">
            <el-col :span="12" class="col-select">
              <el-button type="success" @click="openMaterial({type: 'image',accountId: props.objData.appId})">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
              </el-button>
            </el-col>
            <el-col :span="12" class="col-add">
              <wx-file-upload :data="uploadData"></wx-file-upload>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-tab-pane>

    <el-tab-pane name="voice" label="voice">
      <template #label><i class="el-icon-phone"></i> 语音</template>
      <el-row>
        <div v-if="objData.repName" class="select-item">
          <p class="item-name">{{ objData.repName }}</p>
          <div class="item-infos">
<!--            <WxVoicePlayer :obj-data="Object.assign(tempPlayerObj,{repMediaId: objData.media_id, repName: objData.repName})"></WxVoicePlayer>-->
          </div>
          <el-row class="ope-row">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteObj"></el-button>
          </el-row>
        </div>
        <div v-if="!objData.repName">
          <el-row style="text-align: center">
            <el-col :span="12" class="col-select">
              <el-button type="success" @click="openMaterial({type: 'voice',accountId: props.objData.appId})">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
              </el-button>
            </el-col>
            <el-col :span="12" class="col-add">
              <wx-file-upload :data="uploadData"></wx-file-upload>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-tab-pane>

    <el-tab-pane name="video" label="video">
      <template #label><i class="el-icon-share"></i> 视频</template>
      <el-row>
        <el-input v-model="objData.repName" placeholder="请输入标题"></el-input>
        <div style="margin: 20px 0;"></div>
        <el-input v-model="objData.repDesc" placeholder="请输入描述"></el-input>
        <div style="margin: 20px 0;"></div>
        <div style="text-align: center;">
          <a v-if="objData.repUrl" target="_blank" :href="objData.repUrl"><i
              class="icon-bofang">&nbsp;播放视频</i></a>
        </div>
        <div style="margin: 20px 0;"></div>
        <div style="text-align: center">
          <el-button type="success" @click="openMaterial({type: 'video',accountId: props.objData.appId})">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
          </el-button>
        </div>
      </el-row>

    </el-tab-pane>

    <el-tab-pane name="news" label="news">
      <template #label><i class="el-icon-news"></i> 图文</template>
      <el-row>
        <div v-if="objData.content" class="select-item">
          <wx-news :obj-data="objData.content.newsItem"></wx-news>
          <el-row class="ope-row">
            <el-button type="danger" icon="el-icon-delete" circle @click="deleteObj"></el-button>
          </el-row>
        </div>
        <div v-if="!objData.content">
          <el-row style="text-align: center">
            <el-col :span="24" class="col-select2">
              <el-button type="success" @click="openMaterial({type: 'news',accountId: props.objData.appId})">素材库选择<i class="el-icon-circle-check el-icon--right"></i>
              </el-button>
            </el-col>
          </el-row>
        </div>
      </el-row>
    </el-tab-pane>
  </el-tabs>

  <wx-material-select ref="dialogNewsRef" @selectMaterial="selectMaterial"></wx-material-select>

</template>

<script setup lang="ts" name="wx-reply">
import {getMaterialVideo} from "/@/api/mp/wx-material";

const WxMaterialSelect = defineAsyncComponent(() => import("/@/components/wechart/wx-material-select/main.vue"))

const WxFileUpload = defineAsyncComponent(() => import("/@/components/wechart/fileUpload/index.vue"))

const WxNews = defineAsyncComponent(() => import("/@/components/wechart/wx-news/index.vue"))

const props = defineProps({
  objData: {
    type: Object,
    default: () => ({
      repType: '',
      repContent: '',
      repName: '',
      repDesc: '',
      repUrl: ''
    })
  }
})

const uploadData = reactive({
    mediaType: props.objData.repType,
    title: '',
    introduction: '',
    appId: props.objData.appId
})

const handleClick = (tab) => {
  uploadData.mediaType = tab.paneName

}

const deleteObj = () => {
  props.objData.repName = ''
  props.objData.repUrl = ''
  props.objData.content = ''
}

const openMaterial = (data: any) => {
  dialogNewsRef.value.openDialog(data)
}

const dialogNewsRef = ref()

const selectMaterial = (item, appId) => {

  const tempObjItem = {
    repType: '',
    repMediaId: '',
    media_id: '',
    content: ''
  }
  tempObjItem.repType = props.objData.repType
  tempObjItem.repMediaId = item.mediaId
  tempObjItem.media_id = item.mediaId
  tempObjItem.content = item.content

  props.objData.repMediaId = item.mediaId
  props.objData.media_id = item.mediaId
  props.objData.content = item.content
  if (props.objData.repType === 'music') {
    tempObjItem.repThumbMediaId = item.mediaId
    tempObjItem.repThumbUrl = item.url
    props.objData.repThumbMediaId = item.mediaId
    props.objData.repThumbUrl = item.url
  } else {
    tempObjItem.repName = item.name
    tempObjItem.repUrl = item.url
    props.objData.repName = item.name
    props.objData.repUrl = item.url
  }
  if (props.objData.repType === 'video') {
    getMaterialVideo({
      mediaId: item.mediaId,
      appId: appId
    }).then(response => {
      const data = response.data.data
      tempObjItem.repDesc = data.description
      tempObjItem.repUrl = data.downUrl
    })
  }
}

</script>

<style scoped lang="scss">
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
  float: right
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
  margin: auto
}
</style>
