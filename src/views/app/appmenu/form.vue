<template>
	<el-dialog :close-on-click-modal="false" :title="state.ruleForm.menuId ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="state.ruleForm" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="$t('sysmenu.menuType')" prop="menType">
						<el-radio-group v-model="state.ruleForm.menuType">
							<el-radio-button label="0">页面</el-radio-button>
							<el-radio-button label="1">按钮</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="$t('sysmenu.parentId')" prop="parentId">
						<el-tree-select
							:data="state.parentData"
							:props="{ value: 'id', label: 'name', children: 'children' }"
							check-strictly
							class="w100"
							clearable
							default-expand-all
							placeholder="请选择上级菜单"
							v-model="state.ruleForm.parentId"
						>
						</el-tree-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="$t('sysmenu.name')" prop="name">
						<el-input :placeholder="$t('sysmenu.inputMenuNameTip')" clearable v-model="state.ruleForm.name"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="state.ruleForm.menuType !== '1'">
					<el-form-item :label="$t('sysmenu.path')" prop="path">
						<el-input :placeholder="$t('sysmenu.inputPathTip')" v-model="state.ruleForm.path" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="state.ruleForm.menuType == '1'">
					<el-form-item :label="$t('sysmenu.permission')" prop="permission">
						<el-input :placeholder="$t('sysmenu.inputPermissionTip')" maxlength="50" v-model="state.ruleForm.permission" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="$t('sysmenu.sortOrder')" prop="sortOrder">
						<el-input-number :min="0" controls-position="right" v-model="state.ruleForm.sortOrder" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20" v-if="state.ruleForm.menuType !== '1'">
					<el-form-item :label="$t('sysmenu.visible')" prop="visible">
						<el-radio-group v-model="state.ruleForm.visible">
							<el-radio-button label="1">显示</el-radio-button>
							<el-radio-button label="0">隐藏</el-radio-button>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemMenuDialog" setup>
import { useI18n } from 'vue-i18n';
import { addObj, info, pageList, update, validateByName, validatePermission } from '/@/api/app/appmenu';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 引入组件
const { t } = useI18n();
const visible = ref(false);
const loading = ref(false);
// 定义变量内容
const dataFormRef = ref();

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
		menuType: '0',
		visible: '1',
		id: '',
	},
	parentData: [] as any[], // 上级菜单数据
});

const dataRules = reactive({
	name: [
		{ required: true, message: '菜单名称不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateByName(rule, value, callback, state.ruleForm.menuId !== '');
			},
			trigger: 'blur',
		},
	],
	path: [
		{ required: true, message: '路由路径不能为空', trigger: 'blur' },
		{ validate: rule.noChinese, trigger: 'blur' },
	],
	permission: [
		{ required: true, message: '权限标识不能为空', trigger: 'blur' },
		{ validator: rule.validatorLowercase, trigger: 'blur' },
		{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validatePermission(rule, value, callback, state.ruleForm.menuId !== '');
			},
			trigger: 'blur',
		},
	],
});

// 打开弹窗
const openDialog = (type: string, row?: any) => {
	console.log(type, row);
	state.ruleForm.menuId = '';
	visible.value = true;

	nextTick(() => {
		dataFormRef.value?.resetFields();
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

const getMenuDetail = (id: string) => {
	info(id).then((res) => {
		Object.assign(state.ruleForm, res.data);
	});
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		state.ruleForm.menuId ? await update(state.ruleForm) : await addObj(state.ruleForm);
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
