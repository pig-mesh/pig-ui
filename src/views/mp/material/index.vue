<template>
  <div class="app-container">
    <doc-alert title="公众号素材" url="https://doc.iocoder.cn/mp/material/" />

    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="公众号" prop="accountId">
        <el-select v-model="queryParams.accountId" placeholder="请选择公众号">
          <el-option
            v-for="item in accounts"
            :key="parseInt(item.id)"
            :label="item.name"
            :value="parseInt(item.id)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="ElIconSearch" @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="ElIconRefresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="type" @tab-click="handleClick">
      <!-- tab 1：图片  -->
      <el-tab-pane name="image">
        <template v-slot:label>
          <span
            ><el-icon><el-icon-picture /></el-icon> 图片</span
          >
        </template>
        <div class="add_but" v-hasPermi="['mp:material:upload-permanent']">
          <el-upload
            :action="actionUrl"
            :headers="headers"
            multiple
            :limit="1"
            :file-list="fileList"
            :data="uploadData"
            :before-upload="beforeImageUpload"
            :on-success="handleUploadSuccess"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
            <template v-slot:tip>
              <sapn class="el-upload__tip" style="margin-left: 5px"
                >支持 bmp/png/jpeg/jpg/gif 格式，大小不超过 2M</sapn
              >
            </template>
          </el-upload>
        </div>
        <div class="waterfall" v-loading="loading">
          <div class="waterfall-item" v-for="item in list" :key="item.id">
            <a target="_blank" :href="item.url">
              <img class="material-img" :src="item.url" />
              <div class="item-name">{{ item.name }}</div>
            </a>
            <el-row class="ope-row">
              <el-button
                type="danger"
                :icon="ElIconDelete"
                circle
                @click="handleDelete(item)"
                v-hasPermi="['mp:material:delete']"
              />
            </el-row>
          </div>
        </div>
        <!-- 分页组件 -->
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <!-- tab 2：语音  -->
      <el-tab-pane name="voice">
        <template v-slot:label>
          <span
            ><el-icon><el-icon-microphone /></el-icon> 语音</span
          >
        </template>
        <div class="add_but" v-hasPermi="['mp:material:upload-permanent']">
          <el-upload
            :action="actionUrl"
            :headers="headers"
            multiple
            :limit="1"
            :file-list="fileList"
            :data="uploadData"
            :on-success="handleUploadSuccess"
            :before-upload="beforeVoiceUpload"
          >
            <el-button size="mini" type="primary">点击上传</el-button>
            <template v-slot:tip>
              <span class="el-upload__tip" style="margin-left: 5px"
                >格式支持 mp3/wma/wav/amr，文件大小不超过 2M，播放长度不超过
                60s</span
              >
            </template>
          </el-upload>
        </div>
        <el-table
          :data="list"
          stripe
          border
          v-loading="loading"
          style="margin-top: 10px"
        >
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
            class-name="small-padding fixed-width"
          >
            <template v-slot="scope">
              <el-button
                type="text"
                :icon="ElIconDownload"
                size="small"
                plain
                @click="handleDownload(scope.row)"
                >下载</el-button
              >
              <el-button
                type="text"
                :icon="ElIconDelete"
                size="small"
                plain
                @click="handleDelete(scope.row)"
                v-hasPermi="['mp:material:delete']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>

      <!-- tab 3：视频 -->
      <el-tab-pane name="video">
        <template v-slot:label>
          <span
            ><el-icon><el-icon-video-play /></el-icon> 视频</span
          >
        </template>
        <div class="add_but" v-hasPermi="['mp:material:upload-permanent']">
          <el-button size="mini" type="primary" @click="handleAddVideo"
            >新建视频</el-button
          >
        </div>
        <!-- 新建视频的弹窗 -->
        <el-dialog
          title="新建视频"
          v-model="dialogVideoVisible"
          append-to-body
          width="600px"
          v-loading="addMaterialLoading"
        >
          <el-upload
            :action="actionUrl"
            :headers="headers"
            multiple
            :limit="1"
            :file-list="fileList"
            :data="uploadData"
            :before-upload="beforeVideoUpload"
            :on-success="handleUploadSuccess"
            ref="uploadVideo"
            :auto-upload="false"
          >
            <template v-slot:trigger>
              <el-button size="mini" type="primary">选择视频</el-button>
            </template>
            <span class="el-upload__tip" style="margin-left: 10px"
              >格式支持 MP4，文件大小不超过 10MB</span
            >
          </el-upload>
          <el-form
            :model="uploadData"
            :rules="uploadRules"
            ref="uploadForm"
            label-width="80px"
          >
            <el-row>
              <el-form-item label="标题" prop="title">
                <el-input
                  v-model="uploadData.title"
                  placeholder="标题将展示在相关播放页面，建议填写清晰、准确、生动的标题"
                />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="描述" prop="introduction">
                <el-input
                  :rows="3"
                  type="textarea"
                  v-model="uploadData.introduction"
                  placeholder="介绍语将展示在相关播放页面，建议填写简洁明确、有信息量的内容"
                />
              </el-form-item>
            </el-row>
          </el-form>
          <template v-slot:footer>
            <div class="dialog-footer">
              <el-button @click="cancelVideo">取 消</el-button>
              <el-button type="primary" @click="submitVideo">提 交</el-button>
            </div>
          </template>
        </el-dialog>
        <el-table
          :data="list"
          stripe
          border
          v-loading="loading"
          style="margin-top: 10px"
        >
          <el-table-column label="编号" align="center" prop="mediaId" />
          <el-table-column label="文件名" align="center" prop="name" />
          <el-table-column label="标题" align="center" prop="title" />
          <el-table-column label="介绍" align="center" prop="introduction" />
          <el-table-column label="视频" align="center">
            <template v-slot="scope">
              <wx-video-player :url="scope.row.url" />
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
                type="text"
                :icon="ElIconDownload"
                size="small"
                plain
                @click="handleDownload(scope.row)"
                >下载</el-button
              >
              <el-button
                type="text"
                :icon="ElIconDelete"
                size="small"
                plain
                @click="handleDelete(scope.row)"
                v-hasPermi="['mp:material:delete']"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  Picture as ElIconPicture,
  Microphone as ElIconMicrophone,
  VideoPlay as ElIconVideoPlay,
  Search as ElIconSearch,
  Refresh as ElIconRefresh,
  Delete as ElIconDelete,
  Download as ElIconDownload,
} from '@element-plus/icons'
import WxVoicePlayer from '@/views/mp/components/wx-voice-play/main.vue'
import WxVideoPlayer from '@/views/mp/components/wx-video-play/main.vue'
import { getSimpleAccounts } from '@/api/mp/account'
import { getMaterialPage, deletePermanentMaterial } from '@/api/mp/material'
import { getAccessToken } from '@/utils/auth'

export default {
  data() {
    return {
      type: 'image',
      // 遮罩层
      loading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 数据列表
      list: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        accountId: undefined,
        permanent: true,
      },
      actionUrl:
        process.env.VUE_APP_BASE_API +
        '/admin-api/mp/material/upload-permanent',
      // 设置上传的请求头部
      headers: { Authorization: 'Bearer ' + getAccessToken() },
      fileList: [],
      uploadData: {
        type: 'image',
        title: '',
        introduction: '',
      },
      // === 视频上传，独有变量 ===
      dialogVideoVisible: false,
      addMaterialLoading: false,
      uploadRules: {
        // 视频上传的校验规则
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        introduction: [
          { required: true, message: '请输入描述', trigger: 'blur' },
        ],
      },
      // 公众号账号列表
      accounts: [],
      ElIconSearch,
      ElIconRefresh,
      ElIconDelete,
      ElIconDownload,
    }
  },
  components: {
    WxVoicePlayer,
    WxVideoPlayer,
    ElIconPicture,
    ElIconMicrophone,
    ElIconVideoPlay,
  },
  name: 'MpMaterial',
  created() {
    getSimpleAccounts().then((response) => {
      this.accounts = response.data
      // 默认选中第一个
      if (this.accounts.length > 0) {
        this.setAccountId(this.accounts[0].id)
      }
      // 加载数据
      this.getList()
    })
  },
  methods: {
    // ======================== 列表查询 ========================
    /** 设置账号编号 */
    setAccountId(accountId) {
      this.queryParams.accountId = accountId
      this.uploadData.accountId = accountId
    },
    /** 查询列表 */
    getList() {
      // 如果没有选中公众号账号，则进行提示。
      if (!this.queryParams.accountId) {
        this.$message.error('未选中公众号，无法查询草稿箱')
        return false
      }

      this.loading = true
      getMaterialPage({
        ...this.queryParams,
        type: this.type,
      })
        .then((response) => {
          this.list = response.data.list
          this.total = response.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1
      // 默认选中第一个
      if (this.queryParams.accountId) {
        this.setAccountId(this.queryParams.accountId)
      }
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      // 默认选中第一个
      if (this.accounts.length > 0) {
        this.setAccountId(this.accounts[0].id)
      }
      this.handleQuery()
    },
    handleClick(tab, event) {
      // 设置 type
      this.uploadData.type = tab.name
      // 从第一页开始查询
      this.handleQuery()
    },

    // ======================== 文件上传 ========================
    beforeImageUpload(file) {
      const isType =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif' ||
        file.type === 'image/bmp' ||
        file.type === 'image/jpg'
      if (!isType) {
        this.$message.error('上传图片格式不对!')
        return false
      }
      const isLt = file.size / 1024 / 1024 < 2
      if (!isLt) {
        this.$message.error('上传图片大小不能超过 2M!')
        return false
      }
      this.loading = true
      return true
    },
    beforeVoiceUpload(file) {
      const isType =
        file.type === 'audio/mp3' ||
        file.type === 'audio/wma' ||
        file.type === 'audio/wav' ||
        file.type === 'audio/amr'
      const isLt = file.size / 1024 / 1024 < 2
      if (!isType) {
        this.$message.error('上传语音格式不对!')
        return false
      }
      if (!isLt) {
        this.$message.error('上传语音大小不能超过 2M!')
        return false
      }
      this.loading = true
      return true
    },
    beforeVideoUpload(file) {
      const isType = file.type === 'video/mp4'
      if (!isType) {
        this.$message.error('上传视频格式不对!')
        return false
      }
      const isLt = file.size / 1024 / 1024 < 10
      if (!isLt) {
        this.$message.error('上传视频大小不能超过 10M!')
        return false
      }
      this.addMaterialLoading = true
      return true
    },
    handleUploadSuccess(response, file, fileList) {
      this.loading = false
      this.addMaterialLoading = false
      if (response.code !== 0) {
        this.$message.error('上传出错：' + response.msg)
        return false
      }

      // 清空上传时的各种数据
      this.dialogVideoVisible = false
      this.fileList = []
      this.uploadData.title = ''
      this.uploadData.introduction = ''

      // 加载数据
      this.getList()
    },
    // 下载文件
    handleDownload(row) {
      window.open(row.url, '_blank')
    },
    // 提交 video 新建的表单
    submitVideo() {
      this.$refs['uploadForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$refs.uploadVideo.submit()
      })
    },
    handleAddVideo() {
      this.resetVideo()
      this.dialogVideoVisible = true
    },
    /** 取消按钮 */
    cancelVideo() {
      this.dialogVideoVisible = false
      this.resetVideo()
    },
    /** 表单重置 */
    resetVideo() {
      this.fileList = []
      this.uploadData.title = ''
      this.uploadData.introduction = ''
      this.resetForm('uploadForm')
    },

    // ======================== 其它操作 ========================
    handleDelete(item) {
      const id = item.id
      this.$modal
        .confirm('此操作将永久删除该文件, 是否继续?')
        .then(function () {
          return deletePermanentMaterial(id)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
  },
}
</script>

<style lang="scss" scoped>
.waterfall {
  width: 100%;
  column-gap: 10px;
  column-count: 5;
  margin-top: 10px;
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
</style>
