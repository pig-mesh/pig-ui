<template>
	<el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="600" :close-on-click-modal="false" draggable>
		<el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
			<el-form-item :label="t('fieldtype.columnType')" prop="columnType">
				<el-input v-model="form.columnType" :placeholder="t('fieldtype.inputcolumnTypeTip')" />
			</el-form-item>
			<el-form-item :label="t('fieldtype.attrType')" prop="attrType">
				<el-input v-model="form.attrType" :placeholder="t('fieldtype.inputattrTypeTip')" />
			</el-form-item>
			<el-form-item :label="t('fieldtype.packageName')" prop="packageName">
				<el-input v-model="form.packageName" :placeholder="t('fieldtype.inputpackageNameTip')" />
			</el-form-item>
			<el-form-item :label="t('fieldtype.defaultFormType')" prop="defaultFormType">
				<el-select v-model="form.defaultFormType" :placeholder="t('fieldtype.inputDefaultFormTypeTip')">
					<el-option v-for="item in formTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
			</el-form-item>
			<el-form-item :label="t('fieldtype.defaultQueryFormType')" prop="defaultQueryFormType">
				<el-select v-model="form.defaultQueryFormType" :placeholder="t('fieldtype.inputDefaultQueryFormTypeTip')">
					<el-option v-for="item in queryFormTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
				</el-select>
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

<script setup lang="ts" name="systemFieldTypeDialog">
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj, validateColumnType } from '/@/api/gen/fieldtype';
import { useI18n } from 'vue-i18n';
const emit = defineEmits(['refresh']);
const { t } = useI18n();
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);
const formTypeOptions = [
	{ label: '单行文本', value: 'text' },
	{ label: '多行文本', value: 'textarea' },
	{ label: '数字', value: 'number' },
	{ label: '富文本编辑器', value: 'editor' },
	{ label: '下拉框', value: 'select' },
	{ label: '单选按钮', value: 'radio' },
	{ label: '复选框', value: 'checkbox' },
	{ label: '日期', value: 'date' },
	{ label: '日期时间', value: 'datetime' },
	{ label: '文件上传', value: 'upload-file' },
	{ label: '图片上传', value: 'upload-img' },
];
const queryFormTypeOptions = [
	{ label: '单行文本', value: 'text' },
	{ label: '多行文本', value: 'textarea' },
	{ label: '数字', value: 'number' },
	{ label: '下拉框', value: 'select' },
	{ label: '单选按钮', value: 'radio' },
	{ label: '复选框', value: 'checkbox' },
	{ label: '日期', value: 'date' },
	{ label: '日期范围', value: 'daterange' },
	{ label: '日期时间', value: 'datetime' },
	{ label: '日期时间范围', value: 'datetimerange' },
];

// 提交表单数据
const form = reactive({
	id: '',
	columnType: '',
	attrType: '',
	packageName: '',
	defaultFormType: '',
	defaultQueryFormType: '',
	createTime: '',
});

// 定义校验规则
const dataRules = ref({
	columnType: [
		{ required: true, message: '字段类型不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateColumnType(rule, value, callback, form.id !== '');
			},
		},
	],
	attrType: [{ required: true, message: '属性类型不能为空', trigger: 'blur' }],
	defaultFormType: [{ required: true, message: '默认表单类型不能为空', trigger: 'change' }],
	defaultQueryFormType: [{ required: true, message: '默认查询表单类型不能为空', trigger: 'change' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 如果有id参数，表示是编辑操作，需要设置form.id和获取FieldType信息
	if (id) {
		form.id = id;
		getFieldTypeData(id);
	} else {
		// 否则是新增操作，需要清空form.id
		form.id = '';
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

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

// 初始化表单数据
const getFieldTypeData = (id: string) => {
	// 获取数据
	getObj(id).then((res: any) => {
		Object.assign(form, res.data);
	});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
