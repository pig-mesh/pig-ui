<template>
  <div class="flex flex-wrap items-center gap-2 max-w-full">
    <el-tag
        v-for="tag in tags"
        :key="tag"
        :type="tagType"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
    >
      {{ tag }}
    </el-tag>
    <el-input
        v-if="inputVisible"
        ref="InputRef"
        v-model="inputValue"
        class="w-20"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
    />
    <el-button v-else class="button-new-tag" size="small" @click="showInput">
      {{ buttonText }}
    </el-button>
  </div>
</template>

<script lang="ts" setup>
import {ElInput} from 'element-plus';

const props = defineProps({
  modelValue: {
    type: Array as () => string[],
    default: () => []
  },
  buttonText: {
    type: String,
    default: '+ New Tag'
  },
  tagType: {
    type: String,
    default: 'primary',
    validator: (value: string) => {
      return ['primary', 'success', 'info', 'warning', 'danger'].includes(value);
    }
  }
});

const emits = defineEmits(['update:modelValue']);

const inputValue = ref('');
const inputVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();

const tags = ref([...props.modelValue]);

const handleClose = (tag: string) => {
  tags.value.splice(tags.value.indexOf(tag), 1);
  emits('update:modelValue', tags.value);
};

watch(() => props.modelValue, (val) => {
  tags.value = val;
});

const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    tags.value.push(inputValue.value);
    emits('update:modelValue', tags.value);
  }
  inputVisible.value = false;
  inputValue.value = '';
};
</script>
