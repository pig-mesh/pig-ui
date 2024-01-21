<template>
  <div>
    <div v-if="pageLoading">
      <el-main>
        <el-card shadow="never">
          <el-skeleton :rows="1"></el-skeleton>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px;">
          <el-skeleton></el-skeleton>
        </el-card>
      </el-main>
    </div>
    <widgets/>
  </div>
</template>

<script setup lang="ts" name="dashboard">
const Widgets = defineAsyncComponent(() => import('./widgets/index.vue'));
const pageLoading = ref(true);

onMounted(() => {
  pageLoading.value = false;
});
</script>
