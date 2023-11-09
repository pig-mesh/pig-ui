<template>
	<el-dialog
		:title="state.ruleForm.menuId ? $t('common.editBtn') : $t('common.addBtn')"
		v-model="visible"
		width="600"
		:close-on-click-modal="false"
		draggable
	>
		<el-form ref="menuDialogFormRef" :model="state.ruleForm" :rules="dataRules" label-width="90px" v-loading="loading">
			<el-form-item :label="$t('sysmenu.menuType')" prop="menuType">
				<el-radio-group v-model="state.ruleForm.menuType">
					<el-radio border label="0">菜单</el-radio>
					<el-radio border label="1">按钮</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('sysmenu.parentId')" prop="parentId">
				<el-tree-select
					v-model="state.ruleForm.parentId"
					:data="state.parentData"
					:render-after-expand="false"
					:props="{ value: 'id', label: 'name', children: 'children' }"
					class="w100"
					clearable
					check-strictly
					:placeholder="$t('sysmenu.inputParentIdTip')"
				>
				</el-tree-select>
			</el-form-item>
			<el-form-item :label="$t('sysmenu.name')" prop="name">
				<el-input v-model="state.ruleForm.name" clearable :placeholder="$t('sysmenu.inputNameTip')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('sysmenu.path')" prop="path" v-if="state.ruleForm.menuType === '0'">
				<el-input v-model="state.ruleForm.path" :placeholder="$t('sysmenu.inputPathTip')" />
			</el-form-item>
			<el-form-item :label="$t('sysmenu.permission')" prop="permission" v-if="state.ruleForm.menuType === '1'">
				<el-input v-model="state.ruleForm.permission" maxlength="50" :placeholder="$t('sysmenu.inputPermissionTip')" />
			</el-form-item>
			<el-form-item :label="$t('sysmenu.sortOrder')" prop="sortOrder">
				<el-input-number v-model="state.ruleForm.sortOrder" :min="0" controls-position="right" />
			</el-form-item>
			<el-form-item :label="$t('sysmenu.icon')" prop="icon" v-if="state.ruleForm.menuType === '0'">
				<IconSelector :placeholder="$t('sysmenu.inputIconTip')" v-model="state.ruleForm.icon" />
			</el-form-item>
			<el-form-item :label="$t('sysmenu.embedded')" prop="embedded" v-if="state.ruleForm.menuType === '0' && state.ruleForm.path?.startsWith('http')">
				<el-radio-group v-model="state.ruleForm.embedded">
					<el-radio border label="0">否</el-radio>
					<el-radio border label="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('sysmenu.keepAlive')" prop="keepAlive" v-if="state.ruleForm.menuType === '0'">
				<el-radio-group v-model="state.ruleForm.keepAlive">
					<el-radio border label="0">否</el-radio>
					<el-radio border label="1">是</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('sysmenu.visible')" prop="visible" v-if="state.ruleForm.menuType === '0'">
				<el-radio-group v-model="state.ruleForm.visible">
					<el-radio border label="0">否</el-radio>
					<el-radio border label="1">是</el-radio>
				</el-radio-group>
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

<script setup lang="ts" name="systemMenuDialog">
import { useI18n } from 'vue-i18n';
import { info, pageList, putObj, addObj } from '/@/api/admin/menu';
import { useMessage } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();
// 引入组件
const IconSelector = defineAsyncComponent(() => import('/@/components/IconSelector/index.vue'));

// 定义变量内容
const visible = ref(false);
const loading = ref(false);
const menuDialogFormRef = ref();
// 定义需要的数据
const state = reactive({
	ruleForm: {
		menuId: '',
		name: '',
		permission: '',
		parentId: '',
		icon: '',
		path: '',
		sortOrder: 0,
		menuType: '1',
		keepAlive: '0',
		visible: '1',
		embedded: '0',
	},
	parentData: [] as any[], // 上级菜单数据
});

// 表单校验规则
const dataRules = reactive({
	menType: [{ required: true, message: '菜单类型不能为空', trigger: 'blur' }],
	parentId: [{ required: true, message: '上级菜单不能为空', trigger: 'blur' }],
	name: [{ required: true, message: '菜单不能为空', trigger: 'blur' }],
	path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
	icon: [{ required: true, message: '图标不能为空', trigger: 'blur' }],
	permission: [{ required: true, message: '权限代码不能为空', trigger: 'blur' }],
	sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	state.ruleForm.menuId = '';
	visible.value = true;

	nextTick(() => {
		menuDialogFormRef.value?.resetFields();
		state.ruleForm.parentId = row?.id || '-1';
	});

	if (row?.id && type === 'edit') {
		state.ruleForm.menuId = row.id;
		// 获取当前节点菜单信息
		getMenuDetail(row.id);
	}
	// 渲染上级菜单列表树
	getAllMenuData();
};

// 获取菜单节点的详细信息
const getMenuDetail = (id: string) => {
	info(id).then((res) => {
		Object.assign(state.ruleForm, res.data);
	});
};

// 从后端获取菜单信息（含层级）
const getAllMenuData = () => {
	state.parentData = [];
	pageList({
		type: '0',
	}).then((res) => {
		let menu = {
			id: '-1',
			name: '根菜单',
			children: [],
		};
		menu.children = res.data;
		state.parentData.push(menu);
	});
};

// 保存数据
const onSubmit = async () => {
	const valid = await menuDialogFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		state.ruleForm.menuId ? await putObj(state.ruleForm) : await addObj(state.ruleForm);
		useMessage().success(t(state.ruleForm.menuId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量 只有暴漏出来的变量 父组件才能使用
defineExpose({
	openDialog,
});
</script>
