<template>
  <el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
    <el-form ref="menuDialogFormRef" :model="state.ruleForm" size="default" label-width="80px">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="state.ruleForm.menType">
              <el-radio-button label="0">左菜单</el-radio-button>
              <el-radio-button label="1">按钮</el-radio-button>
              <el-radio-button label="2">顶菜单</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="上级菜单">
            <el-tree-select v-model="state.ruleForm.parentId" :data="state.parentData"
              :props="{ value: 'id', label: 'name', children: 'children' }" class="w100" clearable check-strictly
              placeholder="请选择上级菜单">
            </el-tree-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="菜单名称">
            <el-input v-model="state.ruleForm.name" clearable placeholder="格式：router.xxx"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType !== '1'">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="state.ruleForm.path" placeholder="请输入路由地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '1'">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="state.ruleForm.permission" maxlength="50" placeholder="请权限标识" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="排序" prop="sortOrder">
            <el-input-number v-model="state.ruleForm.sortOrder" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType !== '1'">
          <el-form-item label="路由缓冲" prop="keepAlive">
            <el-radio-group v-model="state.ruleForm.keepAlive">
              <el-radio-button label="0">否</el-radio-button>
              <el-radio-button label="1">是</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancel" size="default">取 消</el-button>
        <el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="systemMenuDialog">
import { info, pageList, update, addObj } from "/@/api/admin/menu";
import type { menuData } from './menu'
import {useMessage} from "/@/hooks/message";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

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
    keepAlive: '',
    visible: ''
  } as menuData,
  parentData: [] as menuData[], // 上级菜单数据
  dialog: {
    isShowDialog: false,
    type: '',
    title: '',
    submitTxt: '',
  },
});

// 从后端获取菜单信息
const getMenuData = async () => {
  pageList().then(res => {
    let menu: menuData;
    menu = {
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
      id: '-1', name: '根菜单', children: [] as menuData[]
    };
    menu.children = res.data;
    state.parentData.push(menu)
  })

};
// 打开弹窗
const openDialog = (type: string, row?: any) => {
  if (type === 'edit') {
    // 模拟数据，实际请走接口
    info(row.id).then(res => {
      state.ruleForm = (res.data as menuData)
    })
    state.dialog.title = '修改菜单';
    state.dialog.submitTxt = '修 改';
  } else {
    state.dialog.title = '新增菜单';
    state.dialog.submitTxt = '新 增';
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      menuDialogFormRef.value.resetFields();
    });
  }
  state.dialog.type = type;
  state.dialog.isShowDialog = true;
  getMenuData();
};
// 关闭弹窗
const closeDialog = () => {
  state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
  closeDialog();
};
// 保存数据
const onSubmit = () => {
  // 保存 调用刷新
  if (state.dialog.type === 'edit') {
    update(state.ruleForm).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  } else {
    addObj(state.ruleForm).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  }

};

// 暴露变量 只有暴漏出来的变量 父组件才能使用
defineExpose({
  openDialog,
});
</script>
