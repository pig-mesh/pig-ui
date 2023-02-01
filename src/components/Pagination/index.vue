<template>
  <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      class="mt15"
      :pager-count="5"
      :page-sizes="prop.pageSizes"
      v-model:current-page="prop.current"
      background
      v-model:page-size="prop.size"
      :layout="prop.layout"
      :total="prop.total"
  >
  </el-pagination>
</template>

<script setup lang="ts" name="pagination">

const emit = defineEmits(['sizeChange', 'currentChange'])

const prop = defineProps({
  current: {
    type: Number,
    default: 1,
  },
  size: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
  pageSizes: {
    type: Array,
    default: [1, 10, 20, 50, 100, 200],
  },
  layout: {
    type: String,
    default: "total, sizes, prev, pager, next, jumper",
  }
})
// 分页改变
const sizeChangeHandle = (val: number) => {
  emit('sizeChange',val)
};
// 分页改变
const currentChangeHandle = (val: number) => {
  emit('currentChange',val)
};

</script>

<style scoped>

</style>
