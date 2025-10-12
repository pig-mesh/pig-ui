<template>
  <div>
    <widgets/>
    <notice v-model:show="showNotice"/>
  </div>
</template>

<script setup lang="ts" name="dashboard">
const Widgets = defineAsyncComponent(() => import('./widgets/index.vue'));
const Notice = defineAsyncComponent(() => import('./notice/index.vue'));
// 演示环境
const isPreview = import.meta.env.VITE_PREVIEW_MODEL === 'true';
const showNotice = ref(isPreview);
</script>
