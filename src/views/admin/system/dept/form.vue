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
import { rule } from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();

/** 表单引用 */
const deptDialogFormRef = ref();

/**
 * 部门表单数据
 * @property {string} parentId - 父部门ID（'0'表示根部门）
 * @property {string} deptId - 部门ID（编辑时有值）
 * @property {string} name - 部门名称
 * @property {number} sortOrder - 排序号（默认9999）
 */
const dataForm = reactive({
	parentId: '',
	deptId: '',
	name: '',
	sortOrder: 9999,
});

/** 父部门树数据 */
const parentData = ref<any[]>([]);

/** 弹窗显示状态 */
const visible = ref(false);

/** 加载状态 */
const loading = ref(false);

/** 表单验证规则 */
const dataRules = reactive({
	parentId: [{ required: true, message: t('sysdept.parentIdRequired'), trigger: 'blur' }],
	name: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('sysdept.nameRequired'), trigger: 'blur' },
	],
	sortOrder: [{ required: true, message: t('sysdept.sortOrderRequired'), trigger: 'blur' }],
});

/**
 * 打开部门表单弹窗
 * @param {string} type - 操作类型（'add'=新增，'edit'=编辑）
 * @param {string} id - 部门ID或父部门ID
 *
 * 业务逻辑:
 * 1. 新增模式：id为父部门ID，创建子部门
 * 2. 编辑模式：id为当前部门ID，加载部门详情
 */
const openDialog = async (type: string, id: string) => {
	visible.value = true;
	dataForm.deptId = '';

	await nextTick();
	deptDialogFormRef.value?.resetFields();
	dataForm.parentId = id;

	if (type === 'edit') {
		try {
			const { data } = await getObj(id);
			Object.assign(dataForm, data);
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}

	await getDeptData();
};

/**
 * 提交部门表单
 * @description 新增或编辑部门信息
 */
const onSubmit = async () => {
	// 立即设置 loading，防止重复点击
	if (loading.value) return;
	loading.value = true;

	try {
		const valid = await deptDialogFormRef.value.validate().catch(() => {});
		if (!valid) {
			loading.value = false;
			return false;
		}

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

/**
 * 获取部门树数据
 * @description 用于父部门选择，包含根节点
 */
const getDeptData = async () => {
	try {
		const { data } = await deptTree();
		parentData.value = [];
		const dept = {
			id: '0',
			name: t('sysdept.rootDept'),
			children: [] as any[],
		};
		dept.children = data;
		parentData.value.push(dept);
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
