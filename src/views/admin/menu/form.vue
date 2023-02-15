<template>
  <div>
    <el-dialog :title="state.ruleForm.menuId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="60%">
      <el-form ref="menuDialogFormRef" :model="state.ruleForm" :rules="dataRules"  label-width="200px">
        <el-row :gutter="24">
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysmenu.menuType')" prop="menType">
              <el-radio-group v-model="state.ruleForm.menuType">
                <el-radio-button label="0">左菜单</el-radio-button>
                <el-radio-button label="1">按钮</el-radio-button>
                <el-radio-button label="2">顶菜单</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysmenu.parentId')" prop="parentId">
              <el-tree-select v-model="state.ruleForm.parentId" :data="state.parentData"
                              default-expand-all
                              :props="{ value: 'id', label: 'name', children: 'children' }" class="w100" clearable check-strictly
                              :placeholder="$t('sysmenu.inputParentIdTip')">
              </el-tree-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysmenu.name')" prop="name">
              <el-input v-model="state.ruleForm.name" clearable placeholder="格式：router.xxx"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0'">
            <el-form-item :label="$t('sysmenu.path')" prop="path">
              <el-input v-model="state.ruleForm.path" :placeholder="$t('sysmenu.inputPathTip')" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '1'">
            <el-form-item :label="$t('sysmenu.permission')" prop="permission">
              <el-input v-model="state.ruleForm.permission" maxlength="50" :placeholder="$t('sysmenu.inputPermissionTip')" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysmenu.sortOrder')" prop="sortOrder">
              <el-input-number v-model="state.ruleForm.sortOrder" :min="0" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysmenu.icon')" prop="icon">
              <IconSelector :placeholder="$t('sysmenu.inputIconTip')" v-model="state.ruleForm.icon" />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0' && showembedded">
            <el-form-item :label="$t('sysmenu.embedded')" prop="embedded">
              <el-radio-group v-model="state.ruleForm.embedded">
                <el-radio-button label="0">否</el-radio-button>
                <el-radio-button label="1">是</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0'">
            <el-form-item :label="$t('sysmenu.keepAlive')" prop="keepAlive">
              <el-radio-group v-model="state.ruleForm.keepAlive">
                <el-radio-button label="0">否</el-radio-button>
                <el-radio-button label="1">是</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20" v-if="state.ruleForm.menuType === '0'">
            <el-form-item :label="$t('sysmenu.visible')" prop="visible">
              <el-radio-group v-model="state.ruleForm.visible">
                <el-radio-button label="0">否</el-radio-button>
                <el-radio-button label="1">是</el-radio-button>
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
  </div>

</template>

<script setup lang="ts" name="systemMenuDialog">
import { info, pageList, update, addObj } from "/@/api/admin/menu";
import {useMessage} from "/@/hooks/message";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/iconSelector/index.vue'));

const visible = ref(false)
// 定义变量内容
const menuDialogFormRef = ref();
// 定义需要的数据
const state = reactive({
  ruleForm: {
    id: '',
    name: '',
    permission: '',
    parentId: '',
    icon: '',
    path: '',
    sortOrder: 0,
    menuType: '0',
    keepAlive: '0',
    visible: '0',
    embedded: '0',
  } ,
  parentData: [] as any[], // 上级菜单数据
});

// 从后端获取菜单信息
const getMenuData = () => {
  state.parentData = []
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
      id: '-1', name: '根菜单', children: []
    };
    menu.children = res.data;
    state.parentData.push(menu)
  })
};


const showembedded = ref(false)



watch(() => state.ruleForm.path,(val) => {
  if(val.startsWith('http')){
    showembedded.value = true
  }else{
    showembedded.value = false
  }
})

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
  if (row?.id) {
    state.ruleForm.id = row.id
    // 模拟数据，实际请走接口
    info(row.id).then(res => {
      Object.assign(state.ruleForm,res.data)
    })
  } else {
    // 清空表单，此项需加表单验证才能使用
    nextTick(() => {
      menuDialogFormRef?.value?.resetFields();
    });
  }
  visible.value = true;
  getMenuData();
};

// 保存数据
const onSubmit = () => {
  // 保存 调用刷新
  if (state.ruleForm.id) {
    update(state.ruleForm).then(() => {
      visible.value = false;
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  } else {
    addObj(state.ruleForm).then(() => {
      visible.value = false;
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
