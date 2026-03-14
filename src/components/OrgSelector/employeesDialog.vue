<!--
  EmployeesDialog 组织选择弹窗组件

  功能：弹窗内左侧为选择面板（SelectBox），右侧为已选结果面板（SelectResult）。
  当未传入 type 时，显示选项卡（用户/部门/角色/岗位）切换；
  传入 type 时，直接显示对应类型的选择面板。

  Props：
  - visible    : boolean - 弹窗是否可见（v-model:visible）
  - data       : OrgItem[] - 已选中的数据（用于初始化）
  - type       : string  - 选择类型，不传则显示选项卡
  - multiple   : boolean - 是否多选
  - selectSelf : boolean - 是否允许选择当前用户

  Events：
  - update:visible - 关闭弹窗
  - change         - 确认选择，返回选中项列表
-->
<template>
  <el-dialog
    :title="$t('orgSelecotr.select')"
    v-model="visibleDialog"
    :width="800"
    append-to-body
  >
    <div class="flex h-[600px]">
      <!-- 左侧选择区域 - 6/10 宽度 -->
      <div class="w-3/5">
        <!-- 选项卡切换：仅在未指定 type 时显示 -->
        <div v-if="!props.type">
            <el-tabs v-model="currentType" @tab-change="handleTypeChange">
              <el-tab-pane :label="$t('orgSelecotr.user')" name="user">
                  <selectBox
                    :key="`user-${tabKey}`"
                    :ref="(el) => selectBoxRefs.user = el"
                    :selectSelf="selectSelf"
                    :list="list"
                    :multiple="multiple"
                    v-model:selectedList="selectedList"
                    :type="'user'"
                  />
              </el-tab-pane>
              <el-tab-pane :label="$t('orgSelecotr.dept')" name="dept">
                  <selectBox
                    :key="`dept-${tabKey}`"
                    :ref="(el) => selectBoxRefs.dept = el"
                    :selectSelf="selectSelf"
                    :list="list"
                    :multiple="multiple"
                    v-model:selectedList="selectedList"
                    :type="'dept'"
                  />
              </el-tab-pane>
              <el-tab-pane :label="$t('orgSelecotr.role')" name="role">
                  <selectBox
                    :key="`role-${tabKey}`"
                    :ref="(el) => selectBoxRefs.role = el"
                    :selectSelf="selectSelf"
                    :list="list"
                    :multiple="multiple"
                    v-model:selectedList="selectedList"
                    :type="'role'"
                  />
              </el-tab-pane>
              <el-tab-pane :label="$t('orgSelecotr.post')" name="post">
                  <selectBox
                    :key="`post-${tabKey}`"
                    :ref="(el) => selectBoxRefs.post = el"
                    :selectSelf="selectSelf"
                    :list="list"
                    :multiple="multiple"
                    v-model:selectedList="selectedList"
                    :type="'post'"
                  />
              </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 指定 type 时，直接显示单个 selectBox -->
        <selectBox v-else ref="selectBoxRef" :selectSelf="selectSelf" :list="list" :multiple="multiple"
        v-model:selectedList="selectedList" :type="currentType"/>
      </div>
      <!-- 右侧结果区域 - 4/10 宽度 -->
      <div class="w-2/5">
        <selectResult :total="total" @del="delList" :list="resList"/>
      </div>
    </div>
    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="$emit('update:visible', false)" class="px-5 py-2 rounded-md font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">{{ $t('common.cancelButtonText') }}</el-button>
        <el-button type="primary" @click="saveDialog" class="px-5 py-2 rounded-md font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">{{ $t('common.confirmButtonText') }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>


<script setup>
import selectBox from './selectBox.vue';
import selectResult from './selectResult.vue';
import { computed, watch, ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { departments, searchVal, getDepartmentList } from './common';
import other from '/@/utils/other';

/** 单一类型模式下的 selectBox 引用 */
const selectBoxRef = ref();

/** 选项卡模式下各类型 selectBox 的引用 */
const selectBoxRefs = ref({
  user: ref(),
  dept: ref(),
  role: ref(),
  post: ref()
});

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  /** 初始已选中的数据 */
  data: {
    type: Array,
    default: () => [],
  },
  /** 选择类型，不传则显示选项卡切换 */
  type: {
    type: String,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  selectSelf: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:visible', 'change']);

const { data, type, multiple } = toRefs(props);

/** 使用 useVModel 简化弹窗 visible 的双向绑定 */
const visibleDialog = useVModel(props, 'visible', emit);

/** 弹窗内部的已选列表（独立于外部数据，确认时才同步） */
const selectedList = ref([]);

/** 当前激活的选择类型 */
const currentType = ref(type.value || 'user');

/** 用于强制重新渲染选项卡内容的 key */
const tabKey = ref(0);

/** 选项卡切换时清空搜索并重新加载对应类型数据 */
const handleTypeChange = (newType) => {
  currentType.value = newType;
  searchVal.value = '';
  getDepartmentList(0, newType);
};

/** 检查某项是否已被选中 */
const isChecked = (id, itemType) => {
  return selectedList.value.some((res) => res.id === id && res.type === itemType);
};

/** 按类型分组的列表数据，传递给 selectBox */
const list = computed(() => {
  const value = departments.value;
  const { childDepartments = [], roleList = [], postList = [], employees = [] } = value ?? {};
  return [
    { type: 'dept', data: childDepartments },
    { type: 'role', data: roleList },
    { type: 'post', data: postList },
    {
      type: 'user',
      data: employees,
      change: (item) => {
        if (!isChecked(item.id, item.type)) {
          if (!multiple.value) {
            selectedList.value = [];
          }
          selectedList.value.push(item);
        } else {
          selectedList.value = selectedList.value.filter(({ id, type: t }) => !(id === item.id && t === item.type));
        }
      },
    },
  ];
});

/**
 * 获取当前类型对应的 selectBox ref
 * 单一类型模式用 selectBoxRef，选项卡模式用 selectBoxRefs
 */
const getSelectBoxRef = (itemType) => {
  return type.value ? selectBoxRef.value : selectBoxRefs.value[itemType];
};

/**
 * 取消选中某项：标记为未选中并通知 selectBox 同步状态
 */
const cancelItem = (item) => {
  item.selected = false;
  getSelectBoxRef(item.type)?.changeEvent(item);
};

/** 右侧已选结果列表，按类型分组并附带取消回调 */
const resList = computed(() => {
  const groups = ['dept', 'role', 'post', 'user'];
  return groups
    .map((groupType) => ({
      type: groupType,
      data: selectedList.value.filter(({ type: t }) => t === groupType),
      cancel: cancelItem,
    }))
    .filter(({ data: groupData }) => groupData.length > 0);
});

// 弹窗打开时，用外部数据初始化内部已选列表
watch(
  () => props.visible,
  (val) => {
    if (val) {
      selectedList.value = data.value;
      searchVal.value = '';
      tabKey.value = 0;
      if (type.value) {
        currentType.value = type.value;
      }
    }
  }
);

// 同步外部 type 变化
watch(type, (newType) => {
  if (newType) {
    currentType.value = newType;
  }
});

/** 已选项总数 */
const total = computed(() => {
  if (!departments.value) return 0;
  return selectedList.value.length;
});

/** 确认选择：深拷贝并精简字段后通知父组件 */
const saveDialog = () => {
  const checkedList = other.deepClone(selectedList.value).map(({ type: t, id, name, avatar }) => ({
    type: t, id, name, avatar,
  }));
  emit('change', checkedList);
};

/** 清空所有已选项 */
const delList = () => {
  for (const item of other.deepClone(selectedList.value)) {
    item.selected = false;
    getSelectBoxRef(item.type)?.changeEvent(item);
  }
  selectedList.value = [];
};
</script>
