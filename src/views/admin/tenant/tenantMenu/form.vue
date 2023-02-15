<template>
  <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules"  label-width="90px">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('tenant.name')" prop="name">
            <el-input v-model="form.name" :placeholder="t('tenant.inputnameTip')" />
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item :label="t('tenant.status')" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="item.value" border v-for="(item,index) in status_type" :key="index">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item prop="menuIds">
            <el-tree show-checkbox ref="menuTreeRef"
                     :check-strictly="false"
                     v-loading="treeLoading"
                     :data="menuData"
                     :props="defaultProps"
                     :default-checked-keys="checkedMenu"
                     node-key="id"
                     highlight-current
                     default-expand-all
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false" >{{ $t('common.cancelButtonText') }}</el-button>
        <el-button type="primary" @click="onSubmit"  :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="tenant-menu-form">


import {getObj} from "/@/api/admin/tenant-menu";
import {useDict} from "/@/hooks/dict";
import {useI18n} from "vue-i18n";
const { status_type } = useDict('status_type')
const { t } = useI18n()
import { treemenu, addObj, putObj } from '/@/api/admin/tenant-menu'
import {useMessage} from "/@/hooks/message";
const emit = defineEmits(['refresh']);

const dataFormRef = ref();
const visible = ref(false)
const menuTreeRef = ref()

const form = reactive({
  id: '',
  status: '',
  name: '',
  menuIds: ''
});

const dataRules = reactive({
  name: [{ required: true, message: '套餐名称不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '套餐状态不能为空', trigger: 'blur' }],
  menuIds: [{ required: true, message: '套餐菜单不能为空', trigger: 'blur' }]
})

const menuData = ref<any[]>([])

const defaultProps = reactive({
  label: 'name',
  value: 'id'
})

const checkedMenu = ref<any[]>([])

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }
  checkedMenu.value = []
  // 获取Tenant信息
  if (id) {
    form.id = id
    getTenantMenuData(id)
  }
  getMenuData()
};


const loading = ref(false)

const onSubmit = () => {
  loading.value = true
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      loading.value = false
      return false
    }
    form.menuIds = [...menuTreeRef.value.getCheckedKeys(),...menuTreeRef.value.getHalfCheckedKeys()].join(",")
    if (form.id) {
      putObj(form).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false // 关闭弹窗
        loading.value = false
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
        loading.value = false
      })
    } else {
      addObj(form).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        loading.value = false
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
        loading.value = false
      })
    }
  })
}

const treeLoading = ref(false)
const getMenuData = () => {
  treeLoading.value = true
  treemenu().then(res =>{
    menuData.value = res.data
    if (form.menuIds) {
      checkedMenu.value = resolveAllEunuchNodeId(menuData.value,form.menuIds.split(','),[])
    } else {
      checkedMenu.value = []
    }
    treeLoading.value = false
  })
}
const resolveAllEunuchNodeId = (json: any[], idArr: any[], temp: any[]) => {
  for (let i = 0; i < json.length; i++) {
    const item = json[i]
    // 国际化
    item.name = t(item.name)
    // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
    if (item.children && item.children.length !== 0) {
      resolveAllEunuchNodeId(item.children, idArr, temp)
    } else {
      temp.push(idArr.filter(id => id === item.id))
    }
  }
  return temp
}

const getTenantMenuData = (id: string) => {
  // 获取部门数据
  getObj(id).then((res: any) => {
    Object.assign(form, res.data[0])
  })
}

// 暴露变量
defineExpose({
  openDialog
});

</script>

<style scoped>

</style>
