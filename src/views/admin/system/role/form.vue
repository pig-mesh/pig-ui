<template>
	<el-dialog :close-on-click-modal="false" :title="form.roleId ? $t('common.editBtn') : $t('common.addBtn')" width="600" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-form-item :label="$t('sysrole.roleName')" prop="roleName">
				<el-input :placeholder="$t('sysrole.please_enter_a_role_name')" clearable v-model="form.roleName"></el-input>
			</el-form-item>
			<el-form-item :label="$t('sysrole.roleCode')" prop="roleCode">
				<el-input :placeholder="$t('sysrole.please_enter_the_role_Code')" :disabled="form.roleId !== ''" clearable v-model="form.roleCode"></el-input>
			</el-form-item>
			<el-form-item :label="$t('sysrole.roleDesc')" prop="roleDesc">
				<el-input
					maxlength="100"
					:rows="3"
					:placeholder="$t('sysrole.please_enter_the_role_description')"
					type="textarea"
					v-model="form.roleDesc"
				></el-input>
			</el-form-item>
			<el-form-item :label="$t('sysrole.menu_authority')" prop="dsType">
				<el-select :placeholder="$t('sysrole.please_select')" clearable v-model="form.dsType">
					<el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in dictType" />
				</el-select>
			</el-form-item>
			<el-form-item v-if="form.dsType === 1">
				<el-tree
					:check-strictly="true"
					:data="dataForm.deptData"
					:default-checked-keys="dataForm.checkedDsScope"
					:props="dataForm.deptProps"
					default-expand-all
					highlight-current
					node-key="id"
					ref="deptTreeRef"
					show-checkbox
				/>
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
import { deptTree } from '/@/api/admin/dept';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, getObjDetails } from '/@/api/admin/role';
import { useI18n } from 'vue-i18n';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const deptTreeRef = ref();
const visible = ref(false);
const loading = ref(false);

/**
 * 角色表单数据
 * @property {string} roleId - 角色ID（编辑时有值）
 * @property {string} roleName - 角色名称（3-20位）
 * @property {string} roleCode - 角色标识（3-20位大写字母，创建后不可修改）
 * @property {string} roleDesc - 角色描述
 * @property {number} dsType - 数据权限类型（0-全部，1-自定义，2-本级及子级，3-本级，4-仅本人）
 * @property {string} dsScope - 数据权限范围（部门ID列表，逗号分隔）
 */
const form = reactive({
	roleId: '',
	roleName: '',
	roleCode: '',
	roleDesc: '',
	dsType: 0,
	dsScope: '',
});

/**
 * 部门树相关数据
 * @property {Array} deptData - 部门树数据
 * @property {Array} checkedDsScope - 已选中的数据权限范围（部门ID列表）
 * @property {Object} deptProps - 树形组件配置
 */
const dataForm = reactive({
	deptData: [],
	checkedDsScope: [],
	deptProps: {
		children: 'children',
		label: 'name',
		value: 'id',
	},
});

/**
 * 创建唯一性验证器
 * @param {string} field - 要验证的字段名
 * @param {string} errorKey - 错误提示的 i18n key
 */
const createUniqueValidator = (field: string, errorKey: string) => {
	return async (rule: any, value: any, callback: any) => {
		if (!value || form.roleId) {
			return callback();
		}

		try {
			const { data } = await getObjDetails({ [field]: value });
			data !== null ? callback(new Error(t(errorKey))) : callback();
		} catch {
			callback();
		}
	};
};

// 定义校验规则
const dataRules = computed(() => ({
	roleName: [
		{ required: true, message: t('sysrole.roleNameRequired'), trigger: 'blur' },
		{ min: 3, max: 20, message: t('sysrole.roleNameLength'), trigger: 'blur' },
		{ validator: createUniqueValidator('roleName', 'sysrole.roleNameExists'), trigger: 'blur' },
	],
	roleCode: [
		{ required: true, message: t('sysrole.roleCodeRequired'), trigger: 'blur' },
		{ min: 3, max: 20, message: t('sysrole.roleCodeLength'), trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{ validator: createUniqueValidator('roleCode', 'sysrole.roleCodeExists'), trigger: 'blur' },
	],
	roleDesc: [{ validator: rule.overLength, trigger: 'blur' }],
	dsType: [{ required: true, message: t('sysrole.dsTypeRequired'), trigger: 'blur' }],
	menu_authority: [{ required: true, message: t('sysrole.menuAuthorityRequired'), trigger: 'blur' }],
}));

const dictType = computed(() => [
	{
		label: t('sysrole.dsType.all'),
		value: 0,
	},
	{
		label: t('sysrole.dsType.custom'),
		value: 1,
	},
	{
		label: t('sysrole.dsType.currentAndChildren'),
		value: 2,
	},
	{
		label: t('sysrole.dsType.current'),
		value: 3,
	},
	{
		label: t('sysrole.dsType.self'),
		value: 4,
	},
]);

/**
 * 打开角色表单弹窗
 * @param {string} id - 角色ID，如果为空则为新增模式，否则为编辑模式
 */
const openDialog = async (id: string) => {
	visible.value = true;
	form.roleId = '';

	await nextTick();
	dataFormRef.value?.resetFields();

	// 获取角色信息
	if (id) {
		form.roleId = id;
		await getRoleData(id);
	}

	await getDeptData();
};

/**
 * 提交角色表单
 * @description 新增或编辑角色信息，处理数据权限范围
 */
const onSubmit = async () => {
	// 立即设置 loading，防止重复点击
	if (loading.value) return;
	loading.value = true;

	// 自定义数据权限时，获取选中的部门ID
	if (form.dsType === 1) {
		form.dsScope = deptTreeRef.value.getCheckedKeys().join(',');
	} else {
		form.dsScope = '';
	}

	try {
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) {
			loading.value = false;
			return false;
		}

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

/**
 * 获取角色详细数据
 * @param {string} id - 角色ID
 */
const getRoleData = async (id: string) => {
	try {
		const { data } = await getObj(id);
		Object.assign(form, data);
		dataForm.checkedDsScope = data.dsScope ? data.dsScope.split(',') : [];
	} catch (err: any) {
		useMessage().error(err.msg || t('sysrole.fetchRoleDataError'));
	}
};

/**
 * 获取部门树数据
 * @description 用于数据权限范围选择
 */
const getDeptData = async () => {
	try {
		const { data } = await deptTree();
		dataForm.deptData = data;
	} catch (err: any) {
		useMessage().error(err.msg || t('sysrole.fetchDeptDataError'));
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
