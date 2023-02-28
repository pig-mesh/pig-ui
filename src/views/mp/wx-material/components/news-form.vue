<template>
  <el-dialog
      :title="operateMaterial === 'add'?'新建图文':'修改图文'"
      :before-close="dialogNewsClose"
      :close-on-click-modal="false"
      v-model="dialogNewsVisible"
      width="80%"
      top="20px">
    <div class="left">
      <div class="select-item">
        <div v-for="(news, index) in articlesAdd" :key="news.id">
          <div
              v-if="index==0"
              class="news-main father"
              :class="{'activeAddNews': isActiveAddNews === index}"
              @click="activeNews(index)">
            <div class="news-content">
              <img v-if="news.thumbUrl" class="material-img" :src="news.thumbUrl" />
              <div class="news-content-title">{{ news.title }}</div>
            </div>
            <div v-if="articlesAdd.length>1" class="child">
              <el-button type="mini" icon="el-icon-sort-down" @click="downNews(index)">下移</el-button>
              <el-button
                  v-if="operateMaterial=='add'"
                  type="mini"
                  icon="el-icon-delete"
                  @click="minusNews(index)">删除
              </el-button>
            </div>
          </div>
          <div
              v-if="index>0"
              class="news-main-item father"
              :class="{'activeAddNews': isActiveAddNews === index}"
              @click="activeNews(index)">
            <div class="news-content-item">
              <div class="news-content-item-title ">{{ news.title }}</div>
              <div class="news-content-item-img">
                <img v-if="news.thumbUrl" class="material-img" :src="news.thumbUrl" height="100%" />
              </div>
            </div>
            <div class="child">
              <el-button
                  v-if="articlesAdd.length > index+1"
                  type="mini"
                  icon="el-icon-sort-down"
                  @click="downNews(index)">下移
              </el-button>
              <el-button type="mini" icon="el-icon-sort-up" @click="upNews(index)">上移</el-button>
              <el-button
                  v-if="operateMaterial=='add'"
                  type="mini"
                  icon="el-icon-delete"
                  @click="minusNews(index)">删除
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="articlesAdd.length<8 && operateMaterial=='add'" class="news-main-plus" @click="plusNews">
          <i class="el-icon-circle-plus icon-plus"></i>
        </div>
      </div>
    </div>
    <div v-loading="addMaterialLoading" class="right">
      <!--富文本编辑器组件-->
      <el-row>
        <editor v-model:get-html="articlesAdd[isActiveAddNews].content" style="margin-top: 20px"></editor>
      </el-row>
      <br><br><br><br>
      <div class="input-tt">封面和摘要：</div>
      <div>
        <div class="thumb-div">
          <img v-if="articlesAdd[isActiveAddNews].thumbUrl" class="material-img" :src="articlesAdd[isActiveAddNews].thumbUrl" :class="isActiveAddNews === 0 ? 'avatar':'avatar1'">
          <i v-else class="el-icon-plus avatar-uploader-icon" :class="isActiveAddNews === 0 ? 'avatar':'avatar1'"></i>
          <div class="thumb-but">
            <upload-file type="simple" :uploadFileUrl="actionUrl" :data="uploadData"></upload-file>
            <el-button size="mini" type="primary" style="margin-left: 5px" @click="openMaterial">素材库选择
            </el-button>
          </div>
        </div>
        <el-input
            v-model="articlesAdd[isActiveAddNews].digest"
            :rows="8"
            type="textarea"
            placeholder="请输入摘要"
            class="digest"
            maxlength="120"></el-input>
      </div>
      <div class="input-tt">标题：</div>
      <el-input v-model="articlesAdd[isActiveAddNews].title" placeholder="请输入标题"></el-input>
      <div class="input-tt">作者：</div>
      <el-input v-model="articlesAdd[isActiveAddNews].author" placeholder="请输入作者"></el-input>
      <div class="input-tt">原文地址：</div>
      <el-input v-model="articlesAdd[isActiveAddNews].contentSourceUrl" placeholder="请输入原文地址"></el-input>
    </div>


    <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogNewsVisible = false" >{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit" >{{ $t('common.confirmButtonText') }}</el-button>
        </span>
    </template>
  </el-dialog>

  <wx-material-select ref="WxMaterialSelectRef"></wx-material-select>

</template>

<script setup lang="ts" name="wx-news-form">


import {useMessageBox} from "/@/hooks/message";

const WxMaterialSelect = defineAsyncComponent(() => import("/@/components/wechart/wx-material-select/main.vue"))

const WxMaterialSelectRef = ref()

const dialogNewsVisible = ref(false)

const operateMaterial = ref("")

const addMaterialLoading = ref(false)

const dialogNewsClose = () => {
 useMessageBox().confirm("修改内容可能还未保存，确定关闭吗?").then(() => {
   dialogNewsVisible.value = false
 })
}

const actionUrl = ref("/admin/wx-material/materialFileUpload")

const accountId = ref()

const articlesAdd = ref([
  {
    'title': '',
    'thumbMediaId': '',
    'author': '',
    'digest': '',
    'showCoverPic': '',
    'content': '',
    'contentSourceUrl': '',
    'needOpenComment': '',
    'onlyFansCanComment': '',
    'thumbUrl': ''
  }
])

const isActiveAddNews = ref(0)

const openDialog = (data: any) => {
  accountId.value = data.accountId
  dialogNewsVisible.value = true
}

const uploadData = reactive({
  mediaType: 'image',
  title: '',
  introduction: '',
  appId: ''
})

const openMaterial = () => {
  WxMaterialSelectRef.value.openDialog({
    type: 'image',
    accountId: accountId.value
  })
}

const onSubmit = () => {
  console.log('22222')
}

const activeNews = (index) => {
  isActiveAddNews.value = index
}

const minusNews = (index) => {
  useMessageBox().confirm("确定删除该图文吗?").then(() => {
    articlesAdd.value.splice(index, 1)
    if (isActiveAddNews.value === index) {
      isActiveAddNews.value = 0
    }
  })
}

const plusNews = () => {
  articlesAdd.value.push({
    'title': '',
    'thumbMediaId': '',
    'author': '',
    'digest': '',
    'showCoverPic': '',
    'content': '',
    'contentSourceUrl': '',
    'needOpenComment': '',
    'onlyFansCanComment': '',
    'thumbUrl': ''
  })
  isActiveAddNews.value = articlesAdd.value.length -1
}



// 暴露变量
defineExpose({
  openDialog,
});
</script>


<style lang="scss" scoped>
.tree-position {
  margin: 12px 20px 0 0
}

.pagination {
  float: right;
  margin-right: 25px;
}

.add_but {
  padding: 10px;
}

.ope-row {
  margin-top: 5px;
  text-align: center;
  border-top: 1px solid #eaeaea;
  padding-top: 5px;
}

.item-name {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.el-upload__tip {
  margin-left: 5px;
}

/*新增图文*/
.left {
  display: inline-block;
  width: 35%;
  vertical-align: top;
  margin-top: 200px;
}

.right {
  display: inline-block;
  width: 60%;
  margin-top: -40px;
}

.avatar-uploader {
  width: 20%;
  display: inline-block;
}

.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: unset !important;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  border: 1px solid #d9d9d9;
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 230px;
  height: 120px;
}

.avatar1 {
  width: 120px;
  height: 120px;
}

.digest {
  width: 60%;
  display: inline-block;
  vertical-align: top;
}

/*新增图文*/
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
.news-main {
  background-color: #FFFFFF;
  width: 100%;
  margin: auto;
  height: 120px;
}

.news-content {
  background-color: #acadae;
  width: 100%;
  height: 120px;
  position: relative;
}

.news-content-title {
  display: inline-block;
  font-size: 15px;
  color: #FFFFFF;
  position: absolute;
  left: 0px;
  bottom: 0px;
  background-color: black;
  width: 98%;
  padding: 1%;
  opacity: 0.65;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  height: 25px;
}

.news-main-item {
  background-color: #FFFFFF;
  padding: 5px 0px;
  border-top: 1px solid #eaeaea;
  width: 100%;
  margin: auto;
}

.news-content-item {
  position: relative;
  margin-left: -3px
}

.news-content-item-title {
  display: inline-block;
  font-size: 12px;
  width: 70%;
}

.news-content-item-img {
  display: inline-block;
  width: 25%;
  background-color: #acadae
}

.input-tt {
  padding: 5px;
}

.activeAddNews {
  border: 5px solid #2bb673;
}

.news-main-plus {
  width: 280px;
  text-align: center;
  margin: auto;
  height: 50px;
}

.icon-plus {
  margin: 10px;
  font-size: 25px;
}

.select-item {
  width: 60%;
  padding: 10px;
  margin: 0 auto 10px auto;
  border: 1px solid #eaeaea;
}

.father .child {
  display: none;
  text-align: center;
  position: relative;
  bottom: 25px;
}

.father:hover .child {
  display: block;
}

.thumb-div {
  display: inline-block;
  width: 30%;
  text-align: center;
}

.thumb-but {
  margin: 5px;
}

.material-img {
  width: 100%;
  height: 100%;
}
</style>

