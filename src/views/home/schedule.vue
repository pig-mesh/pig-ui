<template>
  <el-calendar v-model="value"/>
</template>

<script setup lang="ts" name="systemSysSchedule">
const value = ref(new Date())
</script>
<style>
.el-calendar-table .el-calendar-day{
  height: 40px;
}
</style>
