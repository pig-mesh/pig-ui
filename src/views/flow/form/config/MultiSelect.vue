<script setup lang="ts">
import {computed, defineExpose} from "vue";

let props = defineProps({
  id: {
    type: String,
    default: "",
  },
});

import {useFlowStore} from "../../workflow/stores/flow";

let flowStore = useFlowStore();

var config = computed(() => {
  let step2 = flowStore.step2;
  var idObjList = step2.filter(res => res.id === props.id);
  if (idObjList.length > 0) {
    return idObjList[0];
  }

  let list = step2.filter(res => res.type === 'Layout');
  for (var item of list) {
    let value = item.props.value;
    var valueList = value.filter(res => res.id === props.id);
    if (valueList.length > 0) {
      return valueList[0];
    }
  }

  return undefined;
});
var options = computed(() => {
  return config.value.props.options;
});

const {proxy} = getCurrentInstance();


import {Delete, Edit, Search, Share, Upload} from "@element-plus/icons-vue";

const addOption = () => {
  options.value.push({
    key: "",
    value: "",
  });
};
const deleteOption = (index) => {
  options.value.splice(index, 1);
};

var formValue = computed({
  get() {
    let value = config.value.props.value;
    return (value && value.length > 0) ? (value.map(res => res.key)) : undefined;
  },
  set(t) {
    let filterElement = options.value.filter(res => t.indexOf(res.key) >= 0);
    config.value.props.value = filterElement
  }
})
</script>

<template>
  <div v-if="config">

    <el-form-item label="选项" required>
      <div v-for="(item, index) in options" :key="index" class="class_option">
        <div class="f1">
          <el-input v-model="item.key" placeholder="选项值key"/>
        </div>
        <div class="f2">
          <el-input v-model="item.value" placeholder="选项标签value"/>
        </div>
        <div class="f3">
          <el-icon :size="20" @click.stop="deleteOption(index)">
            <Delete/>
          </el-icon>
        </div>
      </div>
      <el-link type="primary" @click.stop="addOption">添加选项</el-link>
    </el-form-item>

    <el-form-item label="默认值">
      <el-select
          v-model="formValue"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder=""
          style="width: 100%"
      >
        <el-option
            v-for="item in options"
            :key="item.key"
            :label="item.value"
            :value="item.key"
        />
      </el-select>
    </el-form-item>
  </div>
</template>

<style scoped lang="scss">
$width-f1: 150px;
$width-f3: 40px;

.class_option {
  display: flex;
  flex-direction: row;
  width: 100%;

  .f1 {
    width: $width-f1;
  }

  .f2 {
    margin-left: 5px;
    width: calc(100% - #{$width-f1} - #{$width-f3} - 5px);
  }

  .f3 {
    width: $width-f3;
    text-align: center;
    padding-top: 5px;
    height: 35.6px;
  }
}
</style>
