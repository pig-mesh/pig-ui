<template>
  <div>
    <el-input
        v-model="searchVal"
        class="w-50 m-2"
        style="width: 100%"
        v-if="type !== 'role'"
        placeholder="搜索成员"
        @input="getDebounceData($event)"
        :prefix-icon="Search"
    />
    <p class="ellipsis tree_nav" v-if="!searchVal && type !== 'role'">
      <span @click="queryData(0)" class="ellipsis">根节点</span>
      <span v-for="(item, index) in departments.titleDepartments" class="ellipsis" :key="index + 'a'" @click="queryData(item.id)">{{
          item.name
        }}</span>
    </p>

    <ul class="select-box">
      <template v-for="(elem, i) in dataList" :key="i">
        <template v-if="elem.type === 'role'">
          <li v-for="item in elem.data" :key="item.id">
            <el-checkbox v-model="item.selected" @change="changeEvent(item)" :disabled="item.status === 0">
              <div style="display: flex; flex-direction: row">
                <div class="f11">
                  <el-icon style="font-size: 20px">
                    <Share />
                  </el-icon>
                </div>
                <div class="f12">{{ item.name }}</div>
              </div>
            </el-checkbox>
          </li>
        </template>
        <template v-if="elem.type === 'dept' && (type === 'org' || type === 'dept' || type === 'user')">
          <li v-for="item in elem.data" :key="item.id">
            <div style="display: flex; flex-direction: row">
              <div class="d11">
                <el-checkbox v-model="item.selected" @change="changeEvent(item)" :disabled="!(type === 'org' || type === 'dept') || item.status == 0">
                  <div style="display: flex; flex-direction: row">
                    <div class="f11">
                      <el-icon style="font-size: 20px">
                        <Grid />
                      </el-icon>
                    </div>
                    <div class="f12">{{ item.name }}</div>
                  </div>
                </el-checkbox>
              </div>
              <div class="d22" @click="queryData(item.id)">下级</div>
            </div>
          </li>
        </template>
        <template v-if="elem.type === 'user' && (type === 'org' || type === 'user')">
          <li v-for="item in elem.data" :key="item.id" class="check_box">
            <el-checkbox
                v-model="item.selected"
                :disabled="item.status === 0 || (!selectSelf && currentUserId === item.id)"
                @change="changeEvent(item)"
            >
              <div style="display: flex; flex-direction: row">
                <div class="f11">
                  <upload-img v-model:image-url="item.avatar" disabled width="20px" height="20px"/>
                </div>
                <div class="f12">{{ item.name }}</div>
              </div>
            </el-checkbox>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>
<script setup>
import { useUserInfo } from '/@/stores/userInfo';

var props = defineProps({
  selectedList: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'org',
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
const currentUserId = computed(() => {
  return useUserInfo().userInfos.user.userId;
});

import { Delete, Edit, Search, Share, OfficeBuilding, Grid } from '@element-plus/icons-vue';

const queryData = (pid) => {
  getDepartmentList(pid, props.type).then((res) => {
    let selectedList = props.selectedList;

    for (var it of dataList.value) {
      for (var item of it.data) {
        var b = selectedList.filter((res) => res.id === item.id && res.type === item.type).length > 0;
        item.selected = b;
      }
    }
  });
};

let deptList = computed(() => {
  return departments.value.childDepartments;
});

let userList = computed(() => {
  return departments.value.employees;
});
let roleList = computed(() => {
  return departments.value.roleList;
});

var dataList = computed(() => {
  let newVar = [
    {
      type: 'dept',
      data: deptList.value,
    },
    {
      type: 'user',
      data: userList.value,
    },
    {
      type: 'role',
      data: roleList.value,
    },
  ];
  return newVar;
});

const { proxy } = getCurrentInstance();

import { computed, reactive, watch, onMounted, defineExpose } from 'vue';

import { departments, getDebounceData, getDepartmentList, searchVal } from './dialog/common';
import other, { deepClone } from '/@/utils/other';
import UploadImg from "/@/components/Upload/Image.vue";

let emits = defineEmits(['update:selectedList']);

onMounted(() => {
  queryData(0);
});

const changeEvent = (e) => {
  let selectedList = other.deepClone(props.selectedList);

  if (e.selected) {
    if (!props.multiple) {
      userList.value.forEach((res) => (res.selected = false));
      selectedList = [];
    }
    e.selected = true;
    selectedList.push(e);
  } else {
    for (var it of dataList.value) {
      let filter = it.data.filter((res) => res.id === e.id && res.type === e.type);
      if (filter.length > 0) {
        filter[0].selected = false;
      }
    }
    selectedList = selectedList.filter((res) => !(res.id === e.id && res.type === e.type));
  }
  emits('update:selectedList', selectedList);
};

const refreshData = () => {
  let selectedList = props.selectedList;

  for (var it of dataList.value) {
    for (var item of it.data) {
      var b = selectedList.filter((res) => res.id === item.id && res.type === item.type).length > 0;
      item.selected = b;
    }
  }
};
defineExpose({ queryData, changeEvent, refreshData });

watch(
    () => props.selectedList,
    (val) => {
      refreshData();
    }
);
</script>
<style scoped lang="scss">
@import '../css/dialog.css';

.select-box {
  height: 420px;
  overflow-y: auto;

  li {
    padding: 5px 0;
  }
}

.radio_box a,
.check_box a {
  font-size: 12px;
  position: relative;
  padding-left: 20px;
  margin-right: 30px;
  cursor: pointer;
  color: #333;
  white-space: pre;
}

.check_box.not a:hover {
  color: #333;
}

.check_box.not a::before,
.check_box.not a:hover::before {
  border: none;
}

.check_box.not.active {
  background: #f3f3f3;
}

.radio_box a:hover::before,
.check_box a:hover::before {
  border: 1px solid #46a6fe;
}

.radio_box a::before,
.check_box a::before {
  position: absolute;
  width: 14px;
  height: 14px;
  border: 1px solid #dcdfe6;
  border-radius: 2px;
  left: 0;
  top: 1px;
  content: '';
}

.radio_box a::before {
  border-radius: 50%;
}

.check-dot.active::after,
.radio_box a.active::after,
.check_box a.active::after {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 3px;
  left: 3px;
  content: '';
}

.radio_box a.active::after {
  background: #46a6fe;
}

.check_box a.active::after {
  background: url(../assets/images/check_box.png) no-repeat center;
}

.f11 {
  width: 30px;
}

.f12 {
  width: calc(100% - 30px);
  height: 20px;
  line-height: 20px;
}

.d11 {
  width: calc(100% - 30px);
}

.d22 {
  width: 30px;
  line-height: 41px;
  cursor: pointer;
}
</style>
