<template>
  <div class="layout-padding">
    <el-card shadow="hover">
      <el-form ref="dataFormRef" :model="dataForm"  label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12" class="mb20">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="dataForm.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item label="图片" prop="username">
              <upload-image v-model="dataForm.image"></upload-image>
            </el-form-item>
          </el-col>

          <el-col :span="24" class="mb20">
            <el-form-item label="文件" prop="username">
              <upload-file v-model="dataForm.fileList"></upload-file>
            </el-form-item>
          </el-col>
          </el-row>
      </el-form>
      {{dataForm}}
    </el-card>
  </div>
</template>

<script setup lang="ts" name="form-demo">

const UploadFile = defineAsyncComponent(() => import('/@/components/Upload/index.vue'))

const UploadImage = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'))

const dataForm = reactive({
  username: '',
  fileList: '',
  image: ''
})

onMounted(() => {
  Object.assign(dataForm,{
    "username": "123123",
    "fileList": "/admin/sys-file/local/f3f2513c46e74448b33f8fbc54a079ec.pdf",
    "image": "/admin/sys-file/local/b7d73a0fb7404ab9baf09a496291bec6.jpg"
  })
})
</script>

<style scoped>

</style>
