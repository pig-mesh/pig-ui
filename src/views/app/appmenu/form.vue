<template>
  <el-dialog :title="state.ruleForm.menuId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
    <el-form ref="menuDialogFormRef" :model="state.ruleForm" :rules="dataRules"  label-width="90px" v-loading="loading">
      <el-row :gutter="20">
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('sysmenu.menuType')" prop="menType">
            <el-radio-group v-model="state.ruleForm.menuType">
              <el-radio-button label="0">页面</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('sysmenu.parentId')" prop="parentId">
            <el-tree-select v-model="state.ruleForm.parentId" :data="state.parentData" default-expand-all
              :props="{ value: 'id', label: 'name', children: 'children' }" class="w100" clearable check-strictly
              placeholder="请选择上级菜单">
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('sysmenu.name')" prop="name">
            <el-input v-model="state.ruleForm.name" clearable placeholder="请输入菜单名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType !== '1'">
          <el-form-item :label="$t('sysmenu.path')" prop="path">
            <el-input v-model="state.ruleForm.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('sysmenu.permission')" prop="permission">
            <el-input v-model="state.ruleForm.permission" maxlength="50" placeholder="请权限标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="$t('sysmenu.sortOrder')" prop="sortOrder">
            <el-input-number v-model="state.ruleForm.sortOrder" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType !== '1'">
          <el-form-item :label="$t('sysmenu.visible')" prop="visible">
            <el-radio-group v-model="state.ruleForm.visible">
              <el-radio-button label="1">显示</el-radio-button>
              <el-radio-button label="0">隐藏</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" >{{ $t('common.cancelButtonText') }}</el-button>
        <el-button type="primary" @click="onSubmit" >{{ $t('common.confirmButtonText') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { info, pageList, update, addObj } from "/@/api/app/appmenu";
import {useMessage} from "/@/hooks/message";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 引入组件

const visible = ref(false)
const loading = ref(false)
// 定义变量内容
const menuDialogFormRef = ref();
// 定义需要的数据
const state = reactive({
  ruleForm: {
    menuId: '',
    name: '',
    permission: '',
    parentId: '',
    icon: '',
    path: '',
    sortOrder: 0,
    menuType: '0',
    visible: '',
    id: ''
  },
  parentData: [] as any[], // 上级菜单数据
});

// 从后端获取菜单信息
const getMenuData = () => {
  state.parentData = []
  loading.value = true
  pageList().then(res => {
    let menu = {
      createBy: "",
      createTime: "",
      delFlag: "",
      icon: "",
      keepAlive: "",
      menuId: "",
      menuType: "",
      parentId: "",
      path: "",
      sortOrder: 0,
      updateBy: "",
      updateTime: "",
      visible: "",
      id: '-1', name: '根菜单', children: [] as any[]
    };
    menu.children = res.data;
    state.parentData.push(menu)
  }).finally(() => {
    loading.value = false
  })

};

const dataRules = reactive({
  menType: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  parentId: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  path: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  permission: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  sortOrder: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  keepAlive: [{ required: true, message: "姓名不能为空", trigger: "blur" }]
})
// 打开弹窗
const openDialog = (type: string, row?: any) => {
  if (row?.id && type === 'edit') {
    state.ruleForm.id = row.id
    // 模拟数据，实际请走接口
    loading.value = true
    info(row.id).then(res => {
      Object.assign(state.ruleForm,res.data)
    }).finally(() => {
      loading.value = false
    })
  } else {
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      menuDialogFormRef?.value?.resetFields();
      state.ruleForm.parentId = row?.id || '-1'
    });
  }
  visible.value = true;
  getMenuData();
};

// 保存数据
const onSubmit = () => {
  // 保存 调用刷新
  if (state.ruleForm.id) {
    loading.value = true
    update(state.ruleForm).then(() => {
      visible.value = false;
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    }).finally(() => {
      loading.value = false
    })
  } else {
    loading.value = true
    addObj(state.ruleForm).then(() => {
      visible.value = false;
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    }).finally(() => {
      loading.value = false
    })
  }

};

// 暴露变量 只有暴漏出来的变量 父组件才能使用
defineExpose({
  openDialog,
});
</script>
