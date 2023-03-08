<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="90px">
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
					<el-form-item :span="12" :label="t('tenant.tenantDomain')" prop="tenantDomain">
						<el-input v-model="form.tenantDomain" :placeholder="t('tenant.inputtenantDomainTip')" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :span="12" :label="t('tenant.menuId')" prop="menuId">
						<el-select v-model="form.menuId" :placeholder="t('tenant.inputmenuIdTip')" clearable class="w100">
							<el-option v-for="item in menuData" :key="item.id" :label="item.name" :value="item.id" />
						</el-select>
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
					<el-form-item :label="t('tenant.status')" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio :label="item.value" v-for="(item, index) in status_type" border :key="index">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts" name="systemTenantDialog">
import { useDict } from '/@/hooks/dict';
// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/admin/tenant';
import { menuList } from '/@/api/admin/tenant-menu';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);

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

const menuData = ref([]);

// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: 'name不能为空', trigger: 'blur' }],
	code: [{ required: true, message: 'code不能为空', trigger: 'blur' }],
	startTime: [{ required: true, message: '开始时间不能为空', trigger: 'blur' }],
	endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }],
	status: [{ required: true, message: 'status不能为空', trigger: 'blur' }],
	menuId: [{ required: true, message: '租户套餐不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取Tenant信息
	if (id) {
		form.id = id;
		getTenantData(id);
	}
	getMenuList();
};

// 提交
const onSubmit = () => {
	dataFormRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}

		// 更新
		if (form.id) {
			putObj(form)
				.then(() => {
					useMessage().success(t('common.editSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		} else {
			addObj(form)
				.then(() => {
					useMessage().success(t('common.addSuccessText'));
					visible.value = false; // 关闭弹窗
					emit('refresh');
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		}
	});
};

// 初始化表格数据
const getTenantData = (id: string) => {
	// 获取部门数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data[0]);
	});
};

const getMenuList = () => {
	menuList().then((res: any) => {
		menuData.value = res.data;
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
