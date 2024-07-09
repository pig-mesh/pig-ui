<script setup lang="ts">
const emit = defineEmits(['update:modelValue']);

const props = defineProps({
  modelValue: {
    type: String,
  },
});

</script>

<template>
  <div>
    <div class="mb-4">节点任务完成推送接口:</div>
    <el-input type="textarea" show-word-limit maxlength="200" rows="5" :model-value="props.modelValue"
              @input="emit('update:modelValue',$event)"
              placeholder="此节点任务完成后，会往目标接口推送事件通知"/>
  </div>
</template>
