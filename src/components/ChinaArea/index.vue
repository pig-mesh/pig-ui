<template>
  <el-cascader :options="areas" :disabled="disabled" :props="optionProps" v-model="selectedOptions"
               filterable
               @change="handleChange">
    <template #default="{ node, data }">
      <span>{{ data.name }}</span>

      <!-- 图标 -->
      <svg v-if="data.hot === '1'" t="1708145002710" class="icon ml-4" viewBox="0 0 1024 1024" version="1.1"
           xmlns="http://www.w3.org/2000/svg"
           p-id="6040" width="12" height="12">
        <path
            d="M760.591059 332.739765L681.682824 409.6s0-307.2-263.107765-409.539765c0 0-26.262588 281.6-157.816471 383.939765-131.553882 102.460235-394.721882 409.6 131.433412 639.939765 0 0-263.168-281.6 78.908235-486.27953 0 0-26.322824 102.339765 105.231059 204.8 131.614118 102.4 0 281.6 0 281.6s631.506824-153.6 184.32-691.260235z"
            fill="#EA322B" p-id="6041"></path>
      </svg>
    </template>
  </el-cascader>
</template>

<script lang="ts" setup>
import {fetchTree} from "/@/api/admin/sysArea";
import {CascaderProps, Resolve} from "element-plus";

const emit = defineEmits(['update:modelValue', 'change']);

// 定义props
const props = defineProps({
  // 当前的值
  modelValue: String,
  // 层级
  type: {
    type: Number,
    default: () => 4,
  },
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
  // lazy
  lazy: {
    type: Boolean,
    default: () => true,
  },
});

// 定义optionProps
const optionProps: CascaderProps = {
  checkStrictly: props.plus,
  label: 'name',
  value: 'adcode',
  lazy: props.lazy,
  lazyLoad: async (node: Node, resolve: Resolve) => {
    // 初始化数据
    const {level} = node
    if (level < props.type) {
      const {data} = await fetchTree({pid: node.data.id || 100000})
      resolve(data)
    } else {
      resolve([])
    }
  }
}

// 所有省市区的数据
let areas = ref()

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

// 初始化数据
onMounted(async () => {
  if (!props.lazy) {
    const {data} = await fetchTree({type: props.type})
    areas.value = data
  }
})
</script>
