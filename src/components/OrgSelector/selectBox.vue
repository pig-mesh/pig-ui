<!--
  SelectBox 选择面板组件

  功能：展示组织树数据列表（部门/用户/角色/岗位），支持面包屑导航进入子部门，
  支持搜索用户，checkbox 勾选后通过 v-model:selectedList 同步到父组件。

  注意：此组件通过 defineExpose 暴露了 queryData、changeEvent、refreshData 方法，
  供 employeesDialog 在取消选中和清空时调用。
-->
<template>
  <div class="w-full h-full flex flex-col  rounded-none overflow-hidden relative font-sans antialiased subpixel-antialiased">
    <!-- 搜索框：仅在 user 类型下显示 -->
    <div v-if="effectiveType === 'user'" class="p-4 bg-[var(--next-color-disabled)]">
      <el-input
        v-model="searchVal"
        :placeholder="t('orgSelecotr.search')"
        @input="getDebounceData($event)"
        :prefix-icon="Search"
        clearable
        class="[&_.el-input__wrapper]:bg-white/90 [&_.el-input__wrapper]:border-0 [&_.el-input__wrapper]:rounded-lg [&_.el-input__wrapper]:shadow-md [&_.el-input__wrapper]:transition-all [&_.el-input__wrapper]:duration-300 hover:[&_.el-input__wrapper]:shadow-[0_4px_12px_rgba(29,155,240,0.2)] focus:[&_.el-input__wrapper]:shadow-[0_0_0_2px_rgba(29,155,240,0.2)]"
      />
    </div>

    <!-- 面包屑导航：展示当前部门层级路径，点击可返回上级 -->
    <div v-if="!searchVal && effectiveType !== 'role' && effectiveType !== 'post'" class="px-5 py-3x">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          @click="queryData(0)"
          class="cursor-pointer transition-all duration-300 hover:[&_span]:!text-[#1d9bf0] flex items-center gap-1"
        >
          <el-icon class="text-sm mr-2"><House /></el-icon>
          <span class="text-sm font-medium  antialiased subpixel-antialiased transition-colors duration-300">{{ t('orgSelecotr.rootNode') }}</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item
          v-for="({ id, name }, index) in departments.titleDepartments"
          :key="index + 'a'"
          @click="queryData(id)"
          class="cursor-pointer transition-all duration-300 hover:[&_span]:!text-[#1d9bf0]"
        >
          <span class="text-sm font-medium  antialiased subpixel-antialiased transition-colors duration-300">{{ name }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 列表内容 -->
    <div class="flex-1 overflow-hidden relative">
      <div class="h-full overflow-y-auto py-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[var(--next-border-color)] hover:scrollbar-thumb-[var(--next-text-color-regular)] scrollbar-thumb-rounded">
        <!-- 空状态显示 -->
        <div v-if="!hasData" class="flex flex-col items-center justify-center h-48 text-[var(--next-text-color-placeholder)]">
          <el-icon class="text-5xl mb-4 opacity-60"><Box /></el-icon>
          <p class="text-sm m-0">{{ t('orgSelecotr.noData') }}</p>
        </div>

        <template v-for="(elem, i) in dataList" :key="i">
          <!-- 角色和岗位：仅在对应类型或混合类型下显示 -->
          <template v-if="shouldShowGroup(elem.type)">
            <div v-for="item in elem.data" :key="elem.type + '-' + item.id" class="mx-3 my-0.5 rounded-lg transition-all duration-300 relative hover:bg-[var(--next-color-hover)] hover:translate-x-0.5 has-[.el-checkbox.is-checked]:bg-[rgba(29,155,240,0.1)] has-[.el-checkbox.is-checked]:border has-[.el-checkbox.is-checked]:border-[rgba(29,155,240,0.3)] has-[.el-checkbox.is-disabled]:opacity-60 overflow-hidden before:content-[''] before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-[rgba(29,155,240,0.1)] before:to-transparent before:transition-[left] before:duration-500 before:ease-in-out hover:before:left-full">
              <el-checkbox
                v-model="item.selected"
                @change="changeEvent(item)"
                :disabled="item.status === 0"
                class="w-full [&_.el-checkbox__input_.el-checkbox__inner]:border-2 [&_.el-checkbox__input_.el-checkbox__inner]:border-[var(--next-border-color)] [&_.el-checkbox__input_.el-checkbox__inner]:bg-transparent [&_.el-checkbox__input_.el-checkbox__inner]:rounded [&_.el-checkbox__input_.el-checkbox__inner]:w-4 [&_.el-checkbox__input_.el-checkbox__inner]:h-4 [&_.el-checkbox__input_.el-checkbox__inner]:transition-all [&_.el-checkbox__input_.el-checkbox__inner]:duration-300 hover:[&_.el-checkbox__input_.el-checkbox__inner]:border-[#1d9bf0] [&_.el-checkbox__input_.el-checkbox__inner]:after:border-2 [&_.el-checkbox__input_.el-checkbox__inner]:after:border-white [&_.el-checkbox__input_.el-checkbox__inner]:after:border-l-0 [&_.el-checkbox__input_.el-checkbox__inner]:after:border-t-0 [&_.el-checkbox__input_.el-checkbox__inner]:after:h-2 [&_.el-checkbox__input_.el-checkbox__inner]:after:left-1 [&_.el-checkbox__input_.el-checkbox__inner]:after:top-0.5 [&_.el-checkbox__input_.el-checkbox__inner]:after:w-1 [&_.el-checkbox__input.is-checked_.el-checkbox__inner]:bg-[#1d9bf0] [&_.el-checkbox__input.is-checked_.el-checkbox__inner]:border-[#1d9bf0] [&_.el-checkbox__input.is-disabled_.el-checkbox__inner]:bg-[var(--next-color-disabled)] [&_.el-checkbox__input.is-disabled_.el-checkbox__inner]:border-[var(--next-border-color)] [&_.el-checkbox__input.is-disabled_.el-checkbox__inner]:opacity-50 [&_.el-checkbox__label]:text-transparent [&_.el-checkbox__label]:pl-2"
              >
                <div class="flex items-center w-full min-h-10 py-2 gap-3">
                  <div class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0 bg-primary text-white">
                    <el-icon class="text-base">
                      <Share v-if="elem.type === 'role'" />
                      <Briefcase v-else />
                    </el-icon>
                  </div>
                  <div class="flex-1 text-base font-medium  antialiased subpixel-antialiased transition-colors duration-300 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap has-[.el-checkbox.is-checked]:text-[#1d9bf0] has-[.el-checkbox.is-disabled]:text-[var(--next-text-color-placeholder)]">{{ item.name || item.roleName || item.postName || t('orgSelecotr.unnamed') }}</div>
                </div>
              </el-checkbox>
            </div>
          </template>

          <!-- 部门：可勾选（仅 org/dept 类型），也可点击"下级"进入子部门 -->
          <template v-if="elem.type === 'dept' && (effectiveType === 'org' || effectiveType === 'dept' || effectiveType === 'user')">
            <div v-for="item in elem.data" :key="item.id" class="mx-3 my-0.5 rounded-lg transition-all duration-300 relative hover:bg-[var(--next-color-hover)] hover:translate-x-0.5 has-[.el-checkbox.is-checked]:bg-[rgba(29,155,240,0.1)] has-[.el-checkbox.is-checked]:border has-[.el-checkbox.is-checked]:border-[rgba(29,155,240,0.3)] has-[.el-checkbox.is-disabled]:opacity-60">
              <div class="flex items-center justify-between py-1">
                <el-checkbox
                  v-model="item.selected"
                  @change="changeEvent(item)"
                  :disabled="!(effectiveType === 'org' || effectiveType === 'dept') || item.status == 0"
                  class="flex-1 w-full [&_.el-checkbox__input_.el-checkbox__inner]:border-2 [&_.el-checkbox__input_.el-checkbox__inner]:border-[var(--next-border-color)] [&_.el-checkbox__input_.el-checkbox__inner]:bg-transparent [&_.el-checkbox__input_.el-checkbox__inner]:rounded [&_.el-checkbox__input_.el-checkbox__inner]:w-4 [&_.el-checkbox__input_.el-checkbox__inner]:h-4 [&_.el-checkbox__input_.el-checkbox__inner]:transition-all [&_.el-checkbox__input_.el-checkbox__inner]:duration-300 hover:[&_.el-checkbox__input_.el-checkbox__inner]:border-[#1d9bf0] [&_.el-checkbox__input_.el-checkbox__inner]:after:border-2 [&_.el-checkbox__input_.el-checkbox__inner]:after:border-white [&_.el-checkbox__input_.el-checkbox__inner]:after:border-l-0 [&_.el-checkbox__input_.el-checkbox__inner]:after:border-t-0 [&_.el-checkbox__input_.el-checkbox__inner]:after:h-2 [&_.el-checkbox__input_.el-checkbox__inner]:after:left-1 [&_.el-checkbox__input_.el-checkbox__inner]:after:top-0.5 [&_.el-checkbox__input_.el-checkbox__inner]:after:w-1 [&_.el-checkbox__input.is-checked_.el-checkbox__inner]:bg-[#1d9bf0] [&_.el-checkbox__input.is-checked_.el-checkbox__inner]:border-[#1d9bf0] [&_.el-checkbox__input.is-disabled_.el-checkbox__inner]:bg-[var(--next-color-disabled)] [&_.el-checkbox__input.is-disabled_.el-checkbox__inner]:border-[var(--next-border-color)] [&_.el-checkbox__input.is-disabled_.el-checkbox__inner]:opacity-50 [&_.el-checkbox__label]:text-transparent [&_.el-checkbox__label]:pl-2"
                >
                  <div class="flex items-center w-full min-h-10 py-2 gap-3">
                    <div class="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-300 flex-shrink-0 bg-primary text-white">
                      <el-icon class="text-base"><Grid /></el-icon>
                    </div>
                    <div class="flex-1 text-base font-medium antialiased subpixel-antialiased transition-colors duration-300 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap has-[.el-checkbox.is-checked]:text-[#1d9bf0] has-[.el-checkbox.is-disabled]:text-[var(--next-text-color-placeholder)]">{{ item.name }}</div>
                  </div>
                </el-checkbox>
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click="queryData(item.id)"
                  class="px-3 py-1.5 h-7 text-sm font-medium antialiased subpixel-antialiased rounded-md transition-all duration-300 bg-[rgba(29,155,240,0.1)] border border-[rgba(29,155,240,0.3)] text-[#1d9bf0] hover:bg-[rgba(29,155,240,0.2)] hover:border-[#1d9bf0] hover:text-[#1d9bf0] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(29,155,240,0.3)]"
                >
                  <el-icon class="mr-1 text-xs"><ArrowRight /></el-icon>
                  <span class="font-medium antialiased subpixel-antialiased">{{ t('orgSelecotr.subLevel') }}</span>
                </el-button>
              </div>
            </div>
          </template>

          <!-- 用户：带头像展示，可按 selectSelf 控制是否允许选中自己 -->
          <template v-if="elem.type === 'user' && (effectiveType === 'org' || effectiveType === 'user')">
            <div v-for="item in elem.data" :key="item.id" class="mx-3 my-0.5 rounded-lg transition-all duration-300 relative hover:bg-[var(--next-color-hover)] hover:translate-x-0.5 has-[.el-checkbox.is-checked]:bg-[rgba(29,155,240,0.1)] has-[.el-checkbox.is-checked]:border has-[.el-checkbox.is-checked]:border-[rgba(29,155,240,0.3)] has-[.el-checkbox.is-disabled]:opacity-60 hover:[&_.w-8]:border-[#1d9bf0] hover:[&_.w-8]:shadow-[0_0_0_2px_rgba(29,155,240,0.2)]">
              <el-checkbox
                v-model="item.selected"
                :disabled="item.status === 0 || (!selectSelf && currentUserId === item.id)"
                @change="changeEvent(item)"
              >
                <div class="flex items-center w-full min-h-10 py-2 gap-3">
                  <div class="w-8 h-8 rounded-full overflow-hidden transition-all duration-300 flex-shrink-0 flex items-center justify-center bg-[var(--next-color-hover)]">
                    <upload-img v-model:image-url="item.avatar" disabled width="32px" height="32px"/>
                  </div>
                  <div class="flex-1 text-base font-medium  antialiased subpixel-antialiased transition-colors duration-300 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap has-[.el-checkbox.is-checked]:text-[#1d9bf0] has-[.el-checkbox.is-disabled]:text-[var(--next-text-color-placeholder)]">{{ item.name }}</div>
                </div>
              </el-checkbox>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo';
import { departments, getDebounceData, getDepartmentList, searchVal } from './common';
import other from '/@/utils/other';
import UploadImg from '/@/components/Upload/Image.vue';
import { Grid, Search, Share, Briefcase, House, ArrowRight, Box } from '@element-plus/icons-vue';

const { t } = useI18n();

const props = defineProps({
  /** 已选中项列表，双向绑定 */
  selectedList: {
    type: Array,
    default: () => [],
  },
  /** 选择类型：user / dept / role / post / org */
  type: {
    type: String,
  },
  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: true,
  },
  /** 是否允许选中当前登录用户 */
  selectSelf: {
    type: Boolean,
    default: true,
  },
});

const { selectedList, type, multiple, selectSelf } = toRefs(props);

/** 当前登录用户 ID，用于 selectSelf 判断 */
const currentUserId = computed(() => {
  const { userInfos: { user: { userId } } } = useUserInfo();
  return userId;
});

/** 计算生效的类型，默认为 'user' */
const effectiveType = computed(() => type.value || 'user');

/**
 * 判断某个分组是否应该在当前类型下显示
 * role/post 类型：在 role/post/org/user 类型下显示
 */
const shouldShowGroup = (groupType) => {
  const t = effectiveType.value;
  if (groupType === 'role') {
    return t === 'role' || t === 'org' || t === 'user';
  }
  if (groupType === 'post') {
    return t === 'post' || t === 'org' || t === 'user';
  }
  return false;
};

/**
 * 加载指定父部门下的组织树数据，并同步选中状态
 * @param pid - 父部门 ID，0 表示根节点
 */
const queryData = (pid) => {
  getDepartmentList(pid, effectiveType.value).then(() => {
    syncSelectedState();
  });
};

/** 解构 departments 中的各类数据为独立计算属性 */
const deptList = computed(() => departments.value.childDepartments);
const userList = computed(() => departments.value.employees);
const roleList = computed(() => departments.value.roleList);
const postList = computed(() => departments.value.postList);

/** 将四种类型数据统一为数组结构，供模板遍历 */
const dataList = computed(() => [
  { type: 'dept', data: deptList.value },
  { type: 'user', data: userList.value },
  { type: 'role', data: roleList.value },
  { type: 'post', data: postList.value },
]);

/** 检查当前类型下是否有可展示的数据 */
const hasData = computed(() => {
  const currentType = effectiveType.value;
  return dataList.value.some(({ type: elemType, data }) => {
    if (elemType === currentType || currentType === 'org' || currentType === 'user') {
      return data?.length > 0;
    }
    return false;
  });
});

const emit = defineEmits(['update:selectedList']);

// 监听类型变化重新加载数据
watch(type, (newType) => {
  if (newType) {
    queryData(0);
  }
}, { immediate: true });

onMounted(() => {
  // 未指定类型时，在挂载时加载默认数据
  if (!type.value) {
    queryData(0);
  }
});

/**
 * checkbox 勾选/取消事件处理
 * 单选模式下会先清空已选列表，再添加当前项
 */
const changeEvent = (e) => {
  let list = other.deepClone(selectedList.value);

  if (e.selected) {
    // 单选模式：先清空所有已选
    if (!multiple.value) {
      userList.value.forEach((item) => (item.selected = false));
      list = [];
    }
    e.selected = true;
    list.push(e);
  } else {
    // 取消选中：在数据列表中同步状态
    for (const { data } of dataList.value) {
      const match = data?.find((item) => item.id === e.id && item.type === e.type);
      if (match) {
        match.selected = false;
      }
    }
    list = list.filter(({ id, type: itemType }) => !(id === e.id && itemType === e.type));
  }
  emit('update:selectedList', list);
};

/** 根据 selectedList 同步数据列表中各项的 selected 状态 */
const syncSelectedState = () => {
  for (const { data } of dataList.value) {
    for (const item of data) {
      item.selected = selectedList.value.some(({ id, type: itemType }) => id === item.id && itemType === item.type);
    }
  }
};

// 暴露方法供父组件（employeesDialog）调用
defineExpose({ queryData, changeEvent, refreshData: syncSelectedState });

// selectedList 变化时同步选中状态
watch(selectedList, () => {
  syncSelectedState();
});
</script>
