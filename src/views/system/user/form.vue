<template>
	<div class="system-user-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="60%">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.username')">
							<el-input v-model="state.ruleForm.username" placeholder="请输入用户名" :disabled="state.dialog.type === 'edit'"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.password')">
							<el-input v-model="state.ruleForm.password" type="password" placeholder="请输入密码" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.name')">
              <el-input v-model="state.ruleForm.name" placeholder="请输入姓名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.phone')">
              <el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
          </el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.role')">
							<el-select v-model="state.role" placeholder="请选择" clearable class="w100" multiple>
                <el-option
                    v-for="item in state.roleData"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                />
							</el-select>
						</el-form-item>
					</el-col>
          <el-col :span="12" class="mb20">
            <el-form-item :label="$t('sysuser.post')">
              <el-select v-model="state.post" placeholder="请选择" clearable class="w100" multiple>
                <el-option
                    v-for="item in state.postData"
                    :key="item.postId"
                    :label="item.postName"
                    :value="item.postId"
                />
              </el-select>
            </el-form-item>
          </el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.dept')">
              <el-tree-select
                  v-model="state.ruleForm.deptId"
                  :data="state.deptData"
                  :props="{  value: 'id', label: 'name', children: 'children' }"
                  class="w100"
                  clearable
                  check-strictly
                  placeholder="请选择所属部门"
              >
              </el-tree-select>
						</el-form-item>
					</el-col>

					<el-col :span="12" class="mb20">
						<el-form-item label="邮箱">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :span="12" class="mb20">
						<el-form-item label="昵称">
							<el-input v-model="state.ruleForm.nickname" placeholder="请输入昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" class="mb20">
						<el-form-item :label="$t('sysuser.lockFlag')">
              <el-radio-group v-model="state.ruleForm.lockFlag">
                <el-radio :label="item.value" v-for="(item,index) in lock_flag" border :key="index">{{item.label}}</el-radio>
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
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import {  addObj, putObj } from '/@/api/admin/user'
import { list as roleList } from '/@/api/admin/role'
import { list as postList } from '/@/api/admin/post'
import { depttree } from '/@/api/admin/dept'
import { ElMessage } from 'element-plus';
import {useDict} from "/@/hooks/dict";
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);


// @ts-ignore
const { lock_flag } = useDict('lock_flag')
// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
	ruleForm: {
    userId: '',
    username: '',
    password: '' as String | undefined,
    salt: '',
    wxOpenid: '',
    qqOpenid: '',
    lockFlag: '',
    phone: '' as String | undefined,
    deptId: '',
    roleList: [],
    postList: [],
    nickname: '',
    name: '',
    email: '',
    post: [] as String[],
    role: [] as String[],
	},
  post: [] as String[],
  role: [] as String[],
	deptData: [], // 部门数据
  postData: [], //岗位数据
  roleData: [], //角色数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: any) => {
	if (type === 'edit') {
		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
    state.role = []
    state.post = []
    state.ruleForm = Object.assign(state.ruleForm,row)
    row.roleList.map((item: any) => {
      state.role.push(item.roleId)
    })
    row.postList.map((item: any) => {
      state.post.push(item.postId)
    })
    state.ruleForm.password = "******"
	} else {
		state.dialog.title = '新增用户';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			userDialogFormRef.value.resetFields();
      state.ruleForm = Object.assign({})
      state.role = []
      state.post = []
		});
	}
  state.dialog.type = type;
	state.dialog.isShowDialog = true;
  // 加载使用的数据
	getDeptData();
  getPostData();
  getRoleData();
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	closeDialog();
	emit('refresh');
	if (state.dialog.type === 'edit') {
    // 处理数据
    if (state.ruleForm.phone && state.ruleForm.phone.indexOf("*") >= 0) {
      state.ruleForm.phone = undefined;
    }
    if (state.ruleForm.password && state.ruleForm.password.indexOf("******") >= 0) {
      state.ruleForm.password = undefined;
    }
    putObj(state.ruleForm).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      ElMessage.error(err.msg)
    })
  }else{
    if (state.ruleForm.phone && state.ruleForm.phone.indexOf("*") > 0) {
      state.ruleForm.phone = undefined;
    }
    addObj(state.ruleForm).then(() => {
      ElMessage.success("保存成功")
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      ElMessage.error(err.msg)
    })
  }
};

watchEffect(() => {
  state.ruleForm.post = state.post;
  state.ruleForm.role = state.role
})
// 初始化部门数据
const getDeptData = () => {
  // 获取部门数据
  depttree().then(res => {
    state.deptData = res.data
  })
};
// 岗位数据
const getPostData =() => {
  postList().then(res => {
    state.postData = res.data
  })
}
// 角色数据
const getRoleData =() => {
  roleList().then(res => {
    state.roleData = res.data
  })
}

// 暴露变量
defineExpose({
	openDialog,
});
</script>
