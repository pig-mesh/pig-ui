<template>
	<el-dialog :title="dataForm.deptId ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="600">
		<el-form ref="deptDialogFormRef" :model="dataForm" label-width="90px" :rules="dataRules" v-loading="loading">
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
			<el-form-item :label="$t('sysdept.name')" prop="name">
				<el-input v-model="dataForm.name" :placeholder="$t('sysdept.inputnameTip')" clearable />
			</el-form-item>
			<el-form-item :label="$t('sysdept.sortOrder')" prop="sortOrder">
				<el-input-number v-model="dataForm.sortOrder" :placeholder="$t('sysdept.inputsortOrderTip')" clearable />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { useI18n } from 'vue-i18n';
import { getObj, deptTree, addObj, putObj } from '/@/api/admin/dept';
import { useMessage } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();
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
const loading = ref(false);

const dataRules = ref({
	parentId: [{ required: true, message: '上级部门不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }],
	sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (type: string, id: string) => {
	visible.value = true;
	dataForm.deptId = '';

	nextTick(() => {
		deptDialogFormRef.value?.resetFields();
		dataForm.parentId = id;
	});

	if (type === 'edit') {
		getObj(id)
			.then((res) => {
				Object.assign(dataForm, res.data);
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	}

	getDeptData();
};

// 提交
const onSubmit = async () => {
	const valid = await deptDialogFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		dataForm.deptId ? await putObj(dataForm) : await addObj(dataForm);
		useMessage().success(t(dataForm.deptId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 从后端获取菜单信息
const getDeptData = async () => {
	deptTree().then((res) => {
		parentData.value = [];
		const dept = {
			id: '0',
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
