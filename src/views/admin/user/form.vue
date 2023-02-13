<template>
  <div class="system-user-dialog-container">
    <el-dialog :title="dataForm.userId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
      :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="dataForm" :rules="dataRules" size="default" label-width="90px">
        <el-row :gutter="24">
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.username')" prop="username">
              <el-input v-model="dataForm.username" placeholder="请输入用户名" :disabled="dataForm.userId !== ''"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.password')" prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="请输入密码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.name')" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.phone')" prop="phone">
              <el-input v-model="dataForm.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.role')" prop="role">
              <el-select v-model="dataForm.role" placeholder="请选择角色" clearable class="w100" multiple>
                <el-option v-for="item in roleData" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.post')" prop="post">
              <el-select v-model="dataForm.post" placeholder="请选择岗位" clearable class="w100" multiple>
                <el-option v-for="item in postData" :key="item.postId" :label="item.postName" :value="item.postId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.dept')" prop="dept">
              <el-tree-select v-model="dataForm.deptId" :data="deptData"
                :props="{ value: 'id', label: 'name', children: 'children' }" class="w100" clearable check-strictly
                placeholder="请选择所属部门">
              </el-tree-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.email')" prop="email">
              <el-input v-model="dataForm.email" placeholder="请输入邮箱" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.nickname')" prop="nickname">
              <el-input v-model="dataForm.nickname" placeholder="请输入昵称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.lockFlag')" prop="lockFlag">
              <el-radio-group v-model="dataForm.lockFlag">
                <el-radio :label="item.value" v-for="(item, index) in lock_flag" border :key="index">{{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" size="default">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit" size="default">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemUserDialog">
import { getObj, addObj, putObj, getDetails, getDetailsByPhone } from '/@/api/admin/user'
import { list as roleList } from '/@/api/admin/role'
import { list as postList } from '/@/api/admin/post'
import { depttree } from '/@/api/admin/dept'
import { useDict } from "/@/hooks/dict";
import { useI18n } from "vue-i18n";
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

const { t } = useI18n()

// 定义刷新表格emit
const emit = defineEmits(['refresh']);
// @ts-ignore
const { lock_flag } = useDict('lock_flag')

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const deptData = ref<any[]>([])
const roleData = ref<any[]>([])
const postData = ref<any[]>([])

const dataForm = reactive({
  userId: '',
  username: '',
  password: '' as String | undefined,
  salt: '',
  wxOpenid: '',
  qqOpenid: '',
  lockFlag: '0',
  phone: '' as String | undefined,
  deptId: '',
  roleList: [],
  postList: [],
  nickname: '',
  name: '',
  email: '',
  post: [] as String[],
  role: [] as String[],
});

const validateUsername = (rule: any, value: any, callback: any) => {
  const flag = new RegExp(/^([a-z\u4e00-\u9fa5\d]+?)$/).test(value)
  if (!flag) {
    callback(new Error('用户名支持小写英文、数字、中文'))
  }

  getDetails(value).then(response => {
    if (dataForm.userId !== '') callback()
    const result = response.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}

const validatePhone = (rule: any, value: any, callback: any) => {
  getDetailsByPhone(value).then(response => {
    if (dataForm.userId !== '') callback()
    const result = response.data
    if (result !== null) {
      callback(new Error('手机号已经存在'))
    } else {
      callback()
    }
  })
}

const dataRules = ref(
  {
    username: [{ required: true, message: "用户名不能为空", trigger: "blur" }, {
      min: 5,
      max: 20,
      message: "用户名称长度必须介于 5 和 20 之间",
      trigger: "blur"
    }, { validator: validateUsername, trigger: 'blur' }],
    password: [{ required: true, message: "密码不能为空", trigger: "blur" }, {
      min: 6,
      max: 20,
      message: "用户密码长度必须介于 6 和 20 之间",
      trigger: "blur"
    }],
    name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
    dept: [{ required: true, message: "部门不能为空", trigger: "blur" }],
    role: [{ required: true, message: "角色不能为空", trigger: "blur" }],
    post: [{ required: true, message: "岗位不能为空", trigger: "blur" }],
    phone: [{ required: true, message: "手机号不能为空", trigger: "blur" }, { validator: rule.validatePhone, trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }],
    email: [{ type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }]
  }
)

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  dataForm.userId = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 修改获取用户信息
  if (id) {
    dataForm.userId = id
    getUserData(id)
  }

  // 加载使用的数据
  getDeptData()
  getPostData()
  getRoleData()
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    // 更新方法
    if (dataForm.userId) {
      if (dataForm.phone && dataForm.phone.indexOf("*") >= 0) {
        dataForm.phone = undefined
      }
      if (dataForm.password && dataForm.password.indexOf("******") >= 0) {
        dataForm.password = undefined
      }
      putObj(dataForm).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false; // 关闭弹窗
        emit('refresh');
      }).catch(err => {
        useMessage().error(err.msg)
      })
    } else {  // 新增方法
      if (dataForm.phone && dataForm.phone.indexOf("*") > 0) {
        dataForm.phone = undefined
      }
      addObj(dataForm).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch(err => {
        useMessage().error(err.msg)
      })
    }
  })

};

// 初始化部门数据
const getUserData = (id: string) => {
  // 获取部门数据
  getObj(id).then(res => {
    Object.assign(dataForm, res.data)
    if (res.data.roleList) {
      dataForm.role = []
      res.data.roleList.map((item: any) => {
        dataForm.role.push(item.roleId)
      })
    }
    if (res.data.postList) {
      dataForm.post = []
      res.data.postList.map((item: any) => {
        dataForm.post.push(item.postId)
      })
    }
  })
};

// 初始化部门数据
const getDeptData = () => {
  // 获取部门数据
  depttree().then(res => {
    deptData.value = res.data
  })
};

// 岗位数据
const getPostData = () => {
  postList().then(res => {
    postData.value = res.data
  })
}
// 角色数据
const getRoleData = () => {
  roleList().then(res => {
    roleData.value = res.data
  })
}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
