<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="deptDialogFormRef" :model="state.form" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级部门">
              <el-tree-select v-model="state.form.parentId" :data="state.parentData"
                              :props="{ value: 'id', label: 'name', children: 'children' }" class="w100" clearable check-strictly
                              placeholder="请选择上级部门">
              </el-tree-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门名称">
							<el-input v-model="state.form.name" placeholder="请输入部门名称" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
            <el-form-item label="排序">
              <el-input-number v-model="state.form.sortOrder" placeholder="请输入部门名称" clearable></el-input-number>
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

<script setup lang="ts" name="systemDeptDialog">
import { getObj, depttree,addObj,putObj } from '/@/api/admin/dept'
import {useMessage} from "/@/hooks/message";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const deptDialogFormRef = ref();
const state = reactive({
	form: {
    parentId: '',
    deptId: '',
    name: '',
    sortOrder: 9999
	},
  parentData: [] as any[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, id: string) => {
	if (type === 'edit') {
    getObj(id).then(res => {
      state.form = Object.assign({},res.data)
    }).catch(err => {
      useMessage().error(err.msg)
    })
		state.dialog.title = '修改部门';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增部门';
		state.dialog.submitTxt = '新 增';
		// 清空表单，此项需加表单验证才能使用

		nextTick(() => {
			deptDialogFormRef.value.resetFields();
      state.form = Object.assign({
        sortOrder: 9999
      })
      state.form.parentId = id
		});
	}
	state.dialog.isShowDialog = true;
  getDeptData()
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
  if (state.dialog.type === 'edit') {
    putObj(state.form).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  } else {
    addObj(state.form).then(() => {
      closeDialog(); // 关闭弹窗
      emit('refresh');
    }).catch(err => {
      useMessage().error(err.msg)
    })
  }
};

// 从后端获取菜单信息
const getDeptData = async () => {
  depttree().then(res => {
    state.parentData = []
    const dept = {
      id: '-1', name: '根部门', children: [] as any[]
    };
    dept.children = res.data;
    state.parentData.push(dept)
  })

};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
