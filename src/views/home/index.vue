<template>
  <div>
    <widgets/>
  </div>
</template>

<script setup lang="ts" name="dashboard">
const Widgets = defineAsyncComponent(() => import('./widgets/index.vue'));
</script>
