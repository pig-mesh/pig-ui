<template>
  <el-dialog
      :title="operateMaterial === 'add'?'新建图文':'修改图文'"
      :before-close="dialogNewsClose"
      :close-on-click-modal="false"
      v-model="dialogNewsVisible"
      width="80%"
      top="20px">



  </el-dialog>

</template>

<script setup lang="ts" name="wx-news-form">


import {useMessageBox} from "/@/hooks/message";

const dialogNewsVisible = ref(false)

const operateMaterial = ref("")

const dialogNewsClose = () => {
 useMessageBox().confirm("修改内容可能还未保存，确定关闭吗?").then(() => {
   dialogNewsVisible.value = false
 })
}


</script>

<style scoped>

</style>
