<template>
  <div>
    <el-main>
      <el-card shadow="never">
        <el-skeleton :rows="1"></el-skeleton>
      </el-card>
      <el-card shadow="never" style="margin-top: 15px;">
        <el-skeleton></el-skeleton>
      </el-card>
    </el-main>
    <widgets/>
  </div>
</template>

<script setup lang="ts" name="dashboard">
const Widgets = defineAsyncComponent(() => import('./widgets/index.vue'));
</script>
