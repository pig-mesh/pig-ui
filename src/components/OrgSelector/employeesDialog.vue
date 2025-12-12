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
        <!-- 选项卡切换 - 只有当不传 type 的时候才显示 -->
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
        <!-- 当传了 type 时，直接显示 selectBox -->
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
import {computed, watch, ref, onMounted} from 'vue';
import {departments, searchVal, getDepartmentList} from './common';
import other from '/@/utils/other';

const selectBoxRef = ref();
const selectBoxRefs = ref({
  user: ref(),
  dept: ref(),
  role: ref(),
  post: ref()
});

let props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Array,
    default: () => [],
  },
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

//已选择的集合
let selectedList = ref([]);

// 当前选中的类型
const currentType = ref(props.type || 'user');

// 用于强制重新渲染的 key
const tabKey = ref(0);

// 处理类型切换
const handleTypeChange = (type) => {
  currentType.value = type;
  // 清空搜索框
  searchVal.value = '';
  // 只重新加载当前类型的数据，避免重复调用
  getDepartmentList(0, type);
};

let emits = defineEmits(['update:visible', 'change']);
let visibleDialog = computed({
  get() {
    return props.visible;
  },
  set() {
    closeDialog();
  },
});
const isChecked = (id, type) => {
  return selectedList.value.filter((res) => res.id === id && res.type === type).length > 0;
};

let list = computed(() => {
  let value = departments.value;
  return [
    {
      type: 'dept',
      data: value === undefined ? [] : value.childDepartments,
    },
    {
      type: 'role',
      data: value === undefined ? [] : value.roleList,
    },
    {
      type: 'post',
      data: value === undefined ? [] : value.postList,
    },
    {
      type: 'user',
      data: value === undefined ? [] : value.employees,
      change: (item) => {
        if (!isChecked(item.id, item.type)) {
          if (!props.multiple) {
            //单选
            selectedList.value = [];
          }

          selectedList.value.push(item);
        } else {
          selectedList.value = selectedList.value.filter((res) => !(res.id === item.id && res.type === item.type));
        }
      },
    },
  ];
});
let resList = computed(() => {
  let userData = selectedList.value.filter((res) => res.type === 'user');
  let deptData = selectedList.value.filter((res) => res.type === 'dept');
  let roleData = selectedList.value.filter((res) => res.type === 'role');
  let postData = selectedList.value.filter((res) => res.type === 'post');

  let data = [];
  
  // 始终显示所有已选择的项目，不根据 currentType 过滤
  if (deptData.length > 0) {
    data.push({
      type: 'dept',
      data: deptData,
      cancel: (item) => {
        item.selected = false;
        // 处理两种 ref 结构：单一类型模式使用 selectBoxRef，标签页模式使用 selectBoxRefs
        const currentRef = props.type ? selectBoxRef.value : selectBoxRefs.value[item.type];
        if (currentRef) {
          currentRef.changeEvent(item);
        }
      },
    });
  }
  
  if (roleData.length > 0) {
    data.push({
      type: 'role',
      data: roleData,
      cancel: (item) => {
        item.selected = false;
        // 处理两种 ref 结构：单一类型模式使用 selectBoxRef，标签页模式使用 selectBoxRefs
        const currentRef = props.type ? selectBoxRef.value : selectBoxRefs.value[item.type];
        if (currentRef) {
          currentRef.changeEvent(item);
        }
      },
    });
  }
  
  if (postData.length > 0) {
    data.push({
      type: 'post',
      data: postData,
      cancel: (item) => {
        item.selected = false;
        // 处理两种 ref 结构：单一类型模式使用 selectBoxRef，标签页模式使用 selectBoxRefs
        const currentRef = props.type ? selectBoxRef.value : selectBoxRefs.value[item.type];
        if (currentRef) {
          currentRef.changeEvent(item);
        }
      },
    });
  }
  
  if (userData.length > 0) {
    data.push({
      type: 'user',
      data: userData,
      cancel: (item) => {
        item.selected = false;
        // 处理两种 ref 结构：单一类型模式使用 selectBoxRef，标签页模式使用 selectBoxRefs
        const currentRef = props.type ? selectBoxRef.value : selectBoxRefs.value[item.type];
        if (currentRef) {
          currentRef.changeEvent(item);
        }
      },
    });
  }
  
  return data;
});

watch(
    () => props.visible,
    (val) => {
      if (val) {
        selectedList.value = props.data;
        searchVal.value = '';
        // 重置 tabKey 确保组件重新渲染
        tabKey.value = 0;
        // 如果有传入 type，则设置为当前类型
        if (props.type) {
          currentType.value = props.type;
        }
      }
    }
);

// 监听 props.type 变化
watch(
    () => props.type,
    (newType) => {
      if (newType) {
        currentType.value = newType;
      }
    }
);

const closeDialog = () => {
  emits('update:visible', false);
};

let total = computed(() => {
  let v = departments.value;
  if (!v) {
    return 0;
  }
  return selectedList.value.length;
});

let saveDialog = () => {
  const v = selectedList.value;

  let checkedList = other.deepClone(v).map((item) => ({
    type: item.type,
    id: item.id,
    name: item.name,
    avatar: item.avatar,
  }));
  emits('change', checkedList);
  //selectedList.value=[]
};
const delList = () => {
  for (const item of other.deepClone(selectedList.value)) {
    item.selected = false;
    // 处理两种 ref 结构：单一类型模式使用 selectBoxRef，标签页模式使用 selectBoxRefs
    const currentRef = props.type ? selectBoxRef.value : selectBoxRefs.value[item.type];
    if (currentRef) {
      currentRef.changeEvent(item);
    }
  }
  selectedList.value = [];
};
</script>
