<template>
	<el-dialog :close-on-click-modal="false" :title="form.roleId ? $t('common.editBtn') : $t('common.addBtn')" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-form-item :label="$t('approle.roleName')" prop="roleName">
				<el-input :placeholder="$t('approle.please_enter_a_role_name')" clearable v-model="form.roleName"></el-input>
			</el-form-item>
			<el-form-item :label="$t('approle.roleCode')" prop="roleCode">
				<el-input :placeholder="$t('approle.please_enter_the_role_Code')" clearable v-model="form.roleCode"></el-input>
			</el-form-item>
			<el-form-item :label="$t('approle.roleDesc')" prop="roleDesc">
				<el-input :placeholder="$t('approle.please_enter_the_role_description')" maxlength="150" type="textarea" v-model="form.roleDesc"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="systemRoleDialog" setup>
import { rule } from '/@/utils/validate';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateAppRoleCode, validateApproleName } from '/@/api/app/approle';
import { useI18n } from 'vue-i18n';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	roleId: '',
	roleName: '',
	roleCode: '',
	roleDesc: '',
});

// 页面对应元数据
const dataForm = reactive({
	deptData: [],
	checkedDsScope: [],
	deptProps: {
		children: 'children',
		label: 'name',
		value: 'id',
	},
});

// 定义校验规则
const dataRules = ref({
	roleName: [
		{ required: true, message: '角色名称不能为空', trigger: 'blur' },
		{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateApproleName(rule, value, callback, form.roleId !== '');
			},
			trigger: 'blur',
		},
	],
	roleCode: [
		{ required: true, message: '角色标识不能为空', trigger: 'blur' },
		{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateAppRoleCode(rule, value, callback, form.roleId !== '');
			},
			trigger: 'blur',
		},
	],
	roleDesc: [{ max: 128, message: '长度在 128 个字符内', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.roleId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});
	// 获取角色信息
	if (id) {
		form.roleId = id;
		getRoleData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		form.roleId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.roleId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化角色数据
const getRoleData = (id: string) => {
	// 获取部门数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
		if (res.data.dsScope) {
			dataForm.checkedDsScope = res.data.dsScope.split(',');
		} else {
			dataForm.checkedDsScope = [];
		}
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
