<template>
	<div class="system-role-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色名称">
							<el-input v-model="state.ruleForm.roleName" placeholder="请输入角色名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色标识">
							<el-input v-model="state.ruleForm.roleCode" placeholder="请输入角色标识" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="角色描述">
							<el-input v-model="state.ruleForm.roleDesc" type="textarea" placeholder="请输入角色描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单权限">
              <el-select v-model="state.dsType" placeholder="请选择" clearable class="w100">
                <el-option
                    v-for="item in dictType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
						</el-form-item>
					</el-col>
          <el-col :span="24" class="mb20">
            <el-form-item>
              <el-tree
                  show-checkbox
                  :check-strictly="false"
                  :data="state.deptData"
                  :props="state.deptProps"
                  :default-checked-keys="state.checkedDsScope"
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
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemRoleDialog">
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import { depttree } from '/@/api/admin/dept'

// 定义变量内容
const roleDialogFormRef = ref();
const state = reactive({
	ruleForm: {
    roleName: '',
    roleCode: '',
    roleDesc: '',
    dsType: ''
	},
	deptData: [],
  checkedDsScope: [],
	deptProps: {
		children: 'children',
		label: 'name',
    value: 'value'
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

const dictType = ref([{
  label: '全部',
  value: '0'
}, {
  label: '自定义',
  value: '1'
}, {
  label: '本级及子级',
  value: '2'
}, {
  label: '本级',
  value: '3'
}])


// 打开弹窗
const openDialog = (type: string, row: any) => {
	if (type === 'edit') {
		state.ruleForm = Object.assign({},state.ruleForm,row);
    if (row.dsScope) {
      state.checkedDsScope = (row.dsScope).split(',')
    } else {
      state.checkedDsScope = []
    }
		state.dialog.title = '修改角色';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增角色';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			roleDialogFormRef.value.resetFields();
		});
	}
	state.dialog.isShowDialog = true;
  getDeptData();
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
	// if (state.dialog.type === 'add') { }
};
// 获取菜单结构数据
const getDeptData = () => {
  depttree().then(res => {
    state.deptData = res.data
  })
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped lang="scss">
.system-role-dialog-container {
	.menu-data-tree {
		width: 100%;
		border: 1px solid var(--el-border-color);
		border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		padding: 5px;
	}
}
</style>
