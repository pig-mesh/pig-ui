<template>
	<div class="system-dept-dialog-container">
		<el-dialog :title="dataForm.deptId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="769px">
			<el-form ref="deptDialogFormRef" :model="dataForm" label-width="90px" :rules="dataRules">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item :label="$t('sysdept.parentId')" prop="parentId">
							<el-tree-select
								v-model="dataForm.parentId"
								:data="parentData"
								:props="{ value: 'id', label: 'name', children: 'children' }"
								class="w100"
								clearable
								check-strictly
								:render-after-expand="false"
								:placeholder="$t('sysdept.inputparentIdTip')"
							/>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item :label="$t('sysdept.name')" prop="name">
							<el-input v-model="dataForm.name" :placeholder="$t('sysdept.inputnameTip')" clearable />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item :label="$t('sysdept.sortOrder')" prop="sortOrder">
							<el-input-number v-model="dataForm.sortOrder" :placeholder="$t('sysdept.inputsortOrderTip')" clearable />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { getObj, depttree, addObj, putObj } from '/@/api/admin/dept';
import { useMessage } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

// 定义变量内容
const deptDialogFormRef = ref();
const dataForm = reactive({
	parentId: '',
	deptId: '',
	name: '',
	sortOrder: 9999,
});
const parentData = ref<any[]>([]);
const visible = ref(false);

const dataRules = ref({
	parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
	sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (type: string, id: string) => {
	if (type === 'edit') {
		getObj(id)
			.then((res) => {
				Object.assign(dataForm, res.data);
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	} else {
		// 清空表单，此项需加表单验证才能使用
		nextTick(() => {
			deptDialogFormRef?.value?.resetFields();
			dataForm.parentId = id;
		});
	}
	visible.value = true;
	getDeptData();
};
// 关闭弹窗
const closeDialog = () => {
	visible.value = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 提交
const onSubmit = () => {
	deptDialogFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
		if (dataForm.deptId) {
			putObj(dataForm)
				.then(() => {
					closeDialog(); // 关闭弹窗
					emit('refresh');
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		} else {
			addObj(dataForm)
				.then(() => {
					closeDialog(); // 关闭弹窗
					emit('refresh');
				})
				.catch((err) => {
					useMessage().error(err.msg);
				});
		}
	});
};

// 从后端获取菜单信息
const getDeptData = async () => {
	depttree().then((res) => {
		parentData.value = [];
		const dept = {
			id: '-1',
			name: '根部门',
			children: [] as any[],
		};
		dept.children = res.data;
		parentData.value.push(dept);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
