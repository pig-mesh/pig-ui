<template>
  <el-dialog :title="form.roleId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
    :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules"  label-width="90px">
      <el-row :gutter="35">
        <el-col :span="12" class="mb20">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="角色标识" prop="roleCode">
            <el-input v-model="form.roleCode" placeholder="请输入角色标识" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="form.roleDesc" type="textarea" placeholder="请输入角色描述" maxlength="150"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
          <el-form-item label="菜单权限" prop="dsType">
            <el-select v-model="form.dsType" placeholder="请选择" clearable class="w100">
              <el-option v-for="item in dictType" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20" v-if="form.dsType === 1">
          <el-form-item>
            <el-tree show-checkbox ref="deptTreeRef" :check-strictly="true" :data="dataForm.deptData"
              :props="dataForm.deptProps" :default-checked-keys="dataForm.checkedDsScope" node-key="id"
              highlight-current default-expand-all />
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

<script setup lang="ts" name="systemRoleDialog">
import { rule } from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import { depttree } from '/@/api/admin/dept'
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj, getObjByCode } from '/@/api/admin/role'
import { useI18n } from "vue-i18n"

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const deptTreeRef = ref()
const visible = ref(false)

// 提交表单数据
const form = reactive({
  roleId: '',
  roleName: '',
  roleCode: '',
  roleDesc: '',
  dsType: 0,
  dsScope: ''
});

// 页面对应元数据
const dataForm = reactive({
  deptData: [],
  checkedDsScope: [],
  deptProps: {
    children: 'children',
    label: 'name',
    value: 'id'
  }
});

// 判断ROLE_CODE 是否存在
const validateRoleCode = (rule: any, value: any, callback: any) => {
  getObjByCode(value).then((response: any) => {
    if (form.roleId !== '') callback()
    const result = response.data
    if (result && result.length !== 0) {
      callback(new Error('同名角色标识已存在'))
    } else {
      callback()
    }
  })
}

// 定义校验规则
const dataRules = ref(
  {
    roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    roleCode: [
      { required: true, message: '角色标识不能为空', trigger: 'blur' },
      { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
      { validator: rule.validatorKey, trigger: 'blur' },
      { validator: validateRoleCode, trigger: 'blur' }
    ],
    roleDesc: [{ max: 128, message: '长度在 128 个字符内', trigger: 'blur' }],
    dsType: [{ required: true, message: "请选择数据权限类型", trigger: "blur" }]
  }
)

const dictType = ref([{
  label: '全部',
  value: 0
}, {
  label: '自定义',
  value: 1
}, {
  label: '本级及子级',
  value: 2
}, {
  label: '本级',
  value: 3
}])


// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.roleId = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取角色信息
  if (id) {
    form.roleId = id
    getRoleData(id)
  }

  getDeptData();
};

// 提交
const onSubmit = () => {
  if (form.dsType === 1) {
    form.dsScope = deptTreeRef.value.getCheckedKeys().join(',')
  } else {
    form.dsScope = ''
  }

  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }

    // 更新
    if (form.roleId) {
      putObj(form).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    } else {
      addObj(form).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      })
    }
  })


};

// 初始化角色数据
const getRoleData = (id: string) => {
  // 获取部门数据
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
    if (res.data.dsScope) {
      dataForm.checkedDsScope = (res.data.dsScope).split(',')
    } else {
      dataForm.checkedDsScope = []
    }
  })
};


// 获取菜单结构数据
const getDeptData = () => {
  depttree().then((res: any) => {
    dataForm.deptData = res.data
  })
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
