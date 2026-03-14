<!--
  RoleDialog 角色选择弹窗组件（独立版本）

  功能：弹窗内提供角色搜索和单选功能，用于工作流等场景中选择审批角色。
  与 employeesDialog 不同，此组件仅支持角色选择且为单选模式。

  注意：此组件目前未被项目引用，保留供未来扩展使用。

  Props：
  - visible : boolean - 弹窗是否可见（v-model:visible）
  - data    : Array   - 已选中的角色数据（用于初始化）

  Events：
  - update:visible - 关闭弹窗
  - change         - 确认选择，返回选中角色列表 [{ type: 2, targetId, name }]
-->
<template>
  <el-dialog :title="$t('orgSelecotr.select')" v-model="visibleDialog" :width="600" append-to-body>
    <div class="flex h-[500px]">
      <div class="w-3/5 flex flex-col">
        <div class="p-4 bg-[var(--next-color-disabled)]">
          <el-input
            v-model="searchVal"
            :placeholder="$t('orgSelecotr.search')"
            @input="getDebounceData($event, 2)"
            clearable
          />
        </div>
        <selectBox :list="list"/>
      </div>
      <div class="w-2/5">
        <selectResult :total="total" @del="delList" :list="resList"/>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="closeDialog">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button type="primary" @click="saveDialog">{{ $t('common.confirmButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup>
import { computed, watch, ref } from 'vue';
import { useVModel } from '@vueuse/core';
import selectBox from './selectBox.vue';
import selectResult from './selectResult.vue';
import { roles, getDebounceData, getRoleList, searchVal } from './common';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  /** 初始已选中的角色数据 */
  data: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:visible', 'change']);

/** 使用 useVModel 简化弹窗 visible 双向绑定 */
const visibleDialog = useVModel(props, 'visible', emit);

/** 已选中的角色列表（单选模式，数组长度 0 或 1） */
const checkedRoleList = ref([]);

/** 检查某个角色是否已被选中 */
const isChecked = (arr, elem, key = 'id') => {
  return arr.some((item) => item[key] === elem[key]);
};

/** 从数组中移除指定角色 */
const removeItem = (arr, elem, key = 'id') => {
  const index = arr.findIndex((item) => item[key] === elem[key]);
  if (index !== -1) {
    arr.splice(index, 1);
  }
};

/** 角色列表数据，单选模式 */
const list = computed(() => [
  {
    type: 'role',
    not: true,
    data: roles.value,
    isActive: (item) => isChecked(checkedRoleList.value, item, 'roleId'),
    change: (item) => {
      checkedRoleList.value = [item];
    },
  },
]);

/** 已选结果列表 */
const resList = computed(() => [
  {
    type: 'role',
    data: checkedRoleList.value,
    cancel: (item) => removeItem(checkedRoleList.value, item, 'roleId'),
  },
]);

// 弹窗打开时加载角色列表并初始化已选数据
watch(
  () => props.visible,
  (val) => {
    if (val) {
      getRoleList();
      searchVal.value = '';
      checkedRoleList.value = props.data.map(({ name, targetId }) => ({
        roleName: name,
        roleId: targetId,
      }));
    }
  }
);

const total = computed(() => checkedRoleList.value.length);

/** 确认选择：转换数据格式后通知父组件 */
const saveDialog = () => {
  const checkedList = checkedRoleList.value.map(({ roleId, roleName }) => ({
    type: 2,
    targetId: roleId,
    name: roleName,
  }));
  emit('change', checkedList);
};

/** 清空所有已选角色 */
const delList = () => {
  checkedRoleList.value = [];
};

const closeDialog = () => {
  emit('update:visible', false);
};
</script>
