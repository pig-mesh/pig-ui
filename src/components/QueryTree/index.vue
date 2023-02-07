<template>
  <div class="head-container">
    <el-input
        v-model="searchName"
        :placeholder="placeholder"
        clearable
        style="margin-bottom: 20px"
        @change="getDeptTree"
    />
    <el-tree
        :data="state.List"
        :props="props"
        :expand-on-click-node="false"
        ref="deptTreeRef"
        :loading="state.localLoading"
        node-key="id"
        highlight-current
        default-expand-all
        @node-click="handleNodeClick"
    />
  </div>
</template>

<script setup lang="ts" name="query-tree">

import {onMounted, reactive, ref, unref} from "vue";

const emit = defineEmits(['search', 'nodeClick'])

const {placeholder, props, query, loading} = defineProps({
  props: {
    type: Object,
    default: () => {
      return {
        label: 'name',
        children: 'children',
        value: 'id'
      }
    }
  },
  placeholder: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  query: {
    type: Function,
    required: true
  }
})

const state = reactive({
  List: [],
  localLoading: loading
})


const searchName = ref()

const handleNodeClick = (item: any) => {
  emit('nodeClick',item)
}

const getDeptTree = () => {
  if(query instanceof Function){
    state.localLoading = true
    const result = query(unref(searchName))
    if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
      result.then((r: any) => {
        state.List = r.data
      })
    }
  }
}
onMounted(() => {
  getDeptTree()
})

</script>

<style scoped>

</style>
