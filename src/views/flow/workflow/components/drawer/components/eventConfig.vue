<script setup lang="ts">
import { useVModel } from '@vueuse/core';

const props = defineProps({
  modelValue: {
    type: String,
  },
});
const emit = defineEmits(['update:modelValue']);

const modelValue = useVModel(props, 'modelValue', emit);
</script>

<template>
  <div>
    <div class="mb-4">节点任务完成推送接口:</div>
    <el-input type="textarea" show-word-limit maxlength="200" :rows="5" v-model="modelValue"
              placeholder="此节点任务完成后，会往目标接口推送事件通知"/>
  </div>
</template>
