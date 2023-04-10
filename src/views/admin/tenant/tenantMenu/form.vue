<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="90px" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.name')" prop="name">
						<el-input v-model="form.name" :placeholder="t('tenant.inputnameTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('tenant.status')" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio :label="item.value" border v-for="(item, index) in status_type" :key="index">{{ item.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item prop="menuIds">
						<el-tree
							show-checkbox
							ref="menuTreeRef"
							:check-strictly="false"
							:data="menuData"
							:props="defaultProps"
							:default-checked-keys="checkedMenu"
							node-key="id"
							highlight-current
						/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="tenant-menu-form">
import { treemenu, addObj, putObj } from '/@/api/admin/tenant-menu';
import { useMessage } from '/@/hooks/message';
import { getObj } from '/@/api/admin/tenant-menu';
import { useDict } from '/@/hooks/dict';
import { useI18n } from 'vue-i18n';
import other from '/@/utils/other';
const { status_type } = useDict('status_type');
const { t } = useI18n();

const emit = defineEmits(['refresh']);

const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const menuTreeRef = ref();

const form = reactive({
	id: '',
	status: '0',
	name: '',
	menuIds: '',
});

const dataRules = reactive({
	name: [{ required: true, message: '套餐名称不能为空', trigger: 'blur' }],
	status: [{ required: true, message: '套餐状态不能为空', trigger: 'blur' }],
	menuIds: [
		{
			validator: (_rule: any, _value: any, callback: any) => {
				if (menuTreeRef.value.getCheckedKeys().length > 0) {
					callback();
				} else {
					useMessage().error('请选择租户套餐菜单');
				}
			},
			trigger: 'blur',
		},
	],
});

const menuData = ref<any[]>([]);

const defaultProps = reactive({
	label: 'name',
	value: 'id',
});

const checkedMenu = ref<any[]>([]);

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';
	checkedMenu.value = [];

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取Tenant信息
	if (id) {
		form.id = id;
		getTenantMenuData(id);
	}

	getMenuData();
};

const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		// 获取已经选择的节点
		form.menuIds = [...menuTreeRef.value.getCheckedKeys(), ...menuTreeRef.value.getHalfCheckedKeys()].join(',');
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
 * 获取菜单数据
 */
const getMenuData = async () => {
	const res = await treemenu();
	menuData.value = res.data;
	checkedMenu.value = form.menuIds ? other.resolveAllEunuchNodeId(menuData.value, form.menuIds.split(','), []) : [];
};

/**
 * 获取部门下的菜单数据
 * @param {string} id - 部门 ID
 */
const getTenantMenuData = async (id: string) => {
	const res = await getObj(id);
	Object.assign(form, res.data[0]);
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>

<style scoped></style>
