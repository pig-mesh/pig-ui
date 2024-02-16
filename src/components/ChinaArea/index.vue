<template>
  <el-cascader :options="areas" :disabled="disabled" :props="optionProps" v-model="selectedOptions"
               filterable
               @change="handleChange"/>
</template>

<script lang="ts" setup>
// https://github.com/modood/Administrative-divisions-of-China/blob/master/dist/pca-code.json
import allAreas from './pca-code.json'

// 定义props
const props = defineProps({
  // 当前的值
  modelValue: String,
  // 是否禁用
  disabled: {
    type: Boolean,
    default: () => false,
  },
  // 子级是否必选
  plus: {
    type: Boolean,
    default: () => false,
  },
});

// 定义optionProps
const optionProps = {
  checkStrictly: props.plus,
  label: 'name',
  value: 'code'
}

// 所有省市区的数据
let areas = ref(allAreas)
const emit = defineEmits(['update:modelValue', 'change']);

// 计算属性selectedOptions
const selectedOptions = computed({
  get: () => {
    return props.modelValue?.split(',');
  },
  set: (val) => {
    emit('update:modelValue', val?.join(','));
  },
});

// 处理change事件的函数
const handleChange = (value: String[]) => {
  emit('change', value.join(','));
};

</script>
