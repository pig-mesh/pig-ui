<!-- excel 导入组件 -->
<template>
  <el-dialog :title="prop.title" v-model="state.upload.open" width="60%">
    <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="headers" :action="url"
      :disabled="state.upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
      :on-error="handleFileError" :auto-upload="false" drag>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
            @click="downExcelTemp" v-if="tempUrl">下载模板
          </el-link>
        </div>
      </template>
    </el-upload>
    <template #footer>
      <el-button type="primary" @click="submitFileForm">确 定</el-button>
      <el-button @click="state.upload.open = false">取 消</el-button>
    </template>
  </el-dialog>

  <!--校验失败错误数据-->
  <el-dialog title="校验失败数据" v-model="state.errorVisible">
    <el-table :data="state.errorData">
      <el-table-column property="lineNum" label="行号" width="100"></el-table-column>
      <el-table-column property="errors" label="错误描述" show-overflow-tooltip>
        <template v-slot="scope">
          <el-tag type="danger" v-for="error in scope.row.errors" :key="error">{{ error }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script setup lang="ts" name="upload-excel">
import { Local } from "/@/utils/storage";
import { useMessage } from "/@/hooks/message";
import other from '/@/utils/other'
import { Session } from '/@/utils/storage';

const emit = defineEmits(['sizeChange', 'refreshDataList'])
const prop = defineProps({
  url: {
    type: String
  },
  title: {
    type: String
  },
  tempUrl: {
    type: String
  }
})

const uploadRef = ref()


const state = reactive({
  errorVisible: false,
  errorData: [],
  dialog: {
    title: '',
    isShowDialog: false
  },
  upload: {
    open: false,
    isUploading: false
  }
})

const downExcelTemp = () => {
  other.downBlobFile(prop.tempUrl, {}, "temp.xlsx");
}


const handleFileUploadProgress = () => {
  state.upload.isUploading = true;
}

const handleFileError = () => {
  useMessage().error('上传失败,数据格式不合法!')
  state.upload.open = false;
}
const handleFileSuccess = (response: any) => {
  state.upload.isUploading = false;
  state.upload.open = false;
  uploadRef.value.clearFiles();

  // 校验失败
  if (response.code === 1) {
    useMessage().error("导入失败，以下数据不合法");
    state.errorVisible = true;
    state.errorData = response.data;
    uploadRef.value.clearFiles();
    // 刷新表格
    emit("refreshDataList");
  } else {
    useMessage().success(response.msg ? response.msg : "导入成功");
    // 刷新表格
    emit("refreshDataList");
  }
}
const submitFileForm = () => {
  uploadRef.value.submit();
}
const show = () => {
  state.upload.isUploading = false;
  state.upload.open = true;
}


const headers = computed(() => {
  const tenantId = Local.get("tenantId") ? Local.get("tenantId") : 1
  return {
    'Authorization': "Bearer " + Session.get("token"),
    'TENANT-ID': tenantId
  };
})

// 暴露变量
defineExpose({
  show,
});

</script>

<style scoped>

</style>
