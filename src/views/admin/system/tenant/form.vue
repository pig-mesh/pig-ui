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
						<el-date-picker class="!w-full" v-model="form.startTime" type="date" :placeholder="t('tenant.inputstartTimeTip')" :value-format="dateTimeStr" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.endTime')" prop="endTime">
						<el-date-picker class="!w-full" v-model="form.endTime" type="date" :placeholder="t('tenant.inputendTimeTip')" :value-format="dateTimeStr" />
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
							<el-radio 
								:label="item.value" 
								v-for="(item, index) in status_type" 
								border 
								:key="index"
								:disabled="item.value === '9' && form.id === '1'"
							>
								{{ item.label }} 
							</el-radio>
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
import { getObj, addObj, putObj, treemenu,fetchList } from '/@/api/admin/tenant';
import { useI18n } from 'vue-i18n';
import other from '/@/utils/other';
import { CheckboxValueType } from 'element-plus';
import {rule} from "/@/utils/validate";


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

/**
 * 租户表单数据
 * @property {string} id - 租户ID（编辑时有值）
 * @property {string} name - 租户名称
 * @property {string} code - 租户编码（创建后不可修改）
 * @property {string} tenantDomain - 租户域名
 * @property {string} startTime - 有效期开始时间
 * @property {string} endTime - 有效期结束时间
 * @property {string} status - 租户状态（'0'-正常，'9'-冻结）
 * @property {string} menuId - 租户可用菜单ID列表（逗号分隔）
 */
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

/**
 * 菜单树数据
 */
const menuData = ref<any[]>([]);

/**
 * 树形组件配置
 */
const defaultProps = reactive({
	label: 'name',
	value: 'id',
	disabled: true,
});

/**
 * 已选中的菜单ID列表
 */
const checkedMenu = ref<any[]>([]);

// 定义校验规则
const dataRules = ref({
	name: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('tenant.nameRequired'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateTenantName(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	code: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('tenant.codeRequired'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateTenantCode(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	startTime: [{ required: true, message: t('tenant.startTimeRequired'), trigger: 'blur' }],
	endTime: [{ required: true, message: t('tenant.endTimeRequired'), trigger: 'blur' }],
	status: [{ required: true, message: t('tenant.statusRequired'), trigger: 'blur' }],
});

/**
 * 打开租户表单对话框
 * @param {string} id - 租户 ID，如果为空则为新增模式，否则为编辑模式
 */
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

/**
 * 租户必选菜单常量
 * @description 租户必须包含这些菜单才能正常运作
 */
const REQUIRED_MENU_IDS = {
  /** 角色管理菜单ID - 租户必须有角色管理功能 */
  ROLE_MANAGEMENT: '1300',
  /** 角色权限菜单ID - 租户必须有角色权限配置功能 */
  ROLE_PERMISSION: '1302'
} as const;

/**
 * 提交表单数据
 */
const onSubmit = async () => {
	// 立即设置 loading，防止重复点击
	if (loading.value) return;
	loading.value = true;

	try {
		const valid = await dataFormRef.value.validate().catch(() => {});
		if (!valid) {
			loading.value = false;
			return false;
		}

		if (menuTreeRef.value?.getCheckedKeys().length === 0) {
			useMessage().error(t('tenant.selectMenuRequired'));
			loading.value = false;
			return false;
		}

		if (menuTreeRef.value?.getCheckedKeys()) {
			const checkMenu = [...menuTreeRef.value.getCheckedKeys(), ...menuTreeRef.value.getHalfCheckedKeys()];

			// 验证租户必选菜单
			if (!checkMenu.includes(REQUIRED_MENU_IDS.ROLE_MANAGEMENT)) {
				useMessage().error(t('tenant.roleManagementRequired'));
				loading.value = false;
				return false;
			}

			if (!checkMenu.includes(REQUIRED_MENU_IDS.ROLE_PERMISSION)) {
				useMessage().error(t('tenant.roleManagementRequired'));
				loading.value = false;
				return false;
			}

			form.menuId = checkMenu.join(',');
		}

		form.id ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		await fetchList()
		loading.value = false;
	}
};

/**
 * 获取租户详细数据
 * @param {string} id - 租户 ID
 */
const getTenantData = async (id: string) => {
	try {
		const { data } = await getObj(id);
		Object.assign(form, data);
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 获取租户菜单树数据
 */
const getMenuData = async () => {
	try {
		const { data } = await treemenu();
		menuData.value = data;
		checkedMenu.value = form.menuId ? other.resolveAllEunuchNodeId(menuData.value, form.menuId.split(','), []) : [];
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 展开/折叠所有菜单节点
 * @param {CheckboxValueType} check - 是否展开
 */
const handleExpand = (check: CheckboxValueType) => {
	const treeList = menuData.value;
	for (let i = 0; i < treeList.length; i++) {
		//@ts-ignore
		menuTreeRef.value.store.nodesMap[treeList[i].id].expanded = check;
	}
};

/**
 * 全选/取消全选菜单节点
 * @param {CheckboxValueType} check - 是否全选
 */
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
