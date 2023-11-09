<template>
	<el-drawer :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="true" draggable size="50%">
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="90px" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.name')" prop="name">
						<el-input v-model="form.name" :placeholder="t('tenant.inputnameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.code')" prop="code">
						<el-input v-model="form.code" :placeholder="t('tenant.inputcodeTip')" :disabled="form.id !== ''" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.startTime')" prop="startTime">
						<el-date-picker v-model="form.startTime" type="date" :placeholder="t('tenant.inputstartTimeTip')" :value-format="dateTimeStr" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.endTime')" prop="endTime">
						<el-date-picker v-model="form.endTime" type="date" :placeholder="t('tenant.inputendTimeTip')" :value-format="dateTimeStr" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :span="12" :label="t('tenant.tenantDomain')" prop="tenantDomain">
						<el-input v-model="form.tenantDomain" :placeholder="t('tenant.inputtenantDomainTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.status')" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio :label="item.value" v-for="(item, index) in status_type" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-divider content-position="left" v-if="form.id !== '1'">
					<div>
						<span class="mr-4">{{ $t('tenantmenu.name') }}</span>
						<el-checkbox :label="$t('common.expand')" @change="handleExpand" />
						<el-checkbox :label="$t('common.selectAll')" @change="handleSelectAll" />
					</div>
				</el-divider>
				<el-scrollbar class="h-[400px] sm:h-[600px] ml-12" v-if="form.id !== '1'">
					<el-tree
						show-checkbox
						ref="menuTreeRef"
						:disabled="true"
						:check-strictly="false"
						:data="menuData"
						:props="defaultProps"
						:default-checked-keys="checkedMenu"
						node-key="id"
						highlight-current
					/>
				</el-scrollbar>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="systemTenantDialog">
import { validateTenantCode, validateTenantName } from '/@/api/admin/tenant';
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, treemenu } from '/@/api/admin/tenant';
import { useI18n } from 'vue-i18n';
import other from '/@/utils/other';
import { CheckboxValueType } from 'element-plus';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const menuTreeRef = ref();
const visible = ref(false);
const loading = ref(false);

// 字典
const { status_type } = useDict('status_type');

// 提交表单数据
const form = reactive({
	id: '',
	name: '',
	code: '',
	tenantDomain: '',
	startTime: '',
	endTime: '',
	status: '0',
	delFlag: '',
	createBy: '',
	updateBy: '',
	createTime: '',
	updateTime: '',
	menuId: '',
});

const menuData = ref<any[]>([]);

const defaultProps = reactive({
	label: 'name',
	value: 'id',
	disabled: true,
});

const checkedMenu = ref<any[]>([]);

// 定义校验规则
const dataRules = ref({
	name: [
		{ required: true, message: '名称不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateTenantName(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	code: [
		{ required: true, message: '编码不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateTenantCode(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
	endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
	status: [{ required: true, message: 'status不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string): void => {
	visible.value = true;
	form.id = '';
	form.menuId = '';
	checkedMenu.value = [];
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	if (id) {
		form.id = id;
		getTenantData(id);
	}

	getMenuData();
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	if (menuTreeRef.value?.getCheckedKeys().length === 0) {
		useMessage().error('请选择租户套餐菜单');
		return false;
	}

	if (menuTreeRef.value?.getCheckedKeys()) {
		form.menuId = [...menuTreeRef.value.getCheckedKeys(), ...menuTreeRef.value.getHalfCheckedKeys()].join(',');
	}

	try {
		loading.value = true;
		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

/**
 * 初始化表格数据。
 * @param {string} id - 部门 ID。
 */
const getTenantData = async (id) => {
	const res = await getObj(id);
	Object.assign(form, res.data);
};

/**
 * 获取菜单数据
 */
const getMenuData = async () => {
	const res = await treemenu();
	menuData.value = res.data;
	checkedMenu.value = form.menuId ? other.resolveAllEunuchNodeId(menuData.value, form.menuId.split(','), []) : [];
};

const handleExpand = (check: CheckboxValueType) => {
	const treeList = menuData.value;
	for (let i = 0; i < treeList.length; i++) {
		//@ts-ignore
		menuTreeRef.value.store.nodesMap[treeList[i].id].expanded = check;
	}
};

const handleSelectAll = (check: CheckboxValueType) => {
	if (check) {
		menuTreeRef.value?.setCheckedKeys(menuData.value.map((item) => item.id));
	} else {
		menuTreeRef.value?.setCheckedKeys([]);
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
