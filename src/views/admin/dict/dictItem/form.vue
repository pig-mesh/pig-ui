<template>
	<el-dialog v-model="visible" :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')" width="600">
		<el-form ref="dicDialogFormRef" :model="dataForm" label-width="90px" :rules="dataRules" v-loading="loading">
			<el-form-item :label="$t('dictItem.dictType')" prop="dictType">
				<el-input v-model="dataForm.dictType" clearable disabled :placeholder="$t('dictItem.inputDictTypeTip')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('dictItem.label')" prop="label">
				<el-input v-model="dataForm.label" :placeholder="$t('dictItem.inputLabelTip')" clearable></el-input>
			</el-form-item>
			<el-form-item :label="$t('dictItem.itemValue')" prop="value">
				<el-input v-model="dataForm.value" :placeholder="$t('dictItem.inputItemValueTip')" clearable></el-input>
			</el-form-item>
			<el-form-item :label="$t('dictItem.description')" prop="description">
				<el-input v-model="dataForm.description" :placeholder="$t('dictItem.inputDescriptionTip')" clearable></el-input>
			</el-form-item>
			<el-form-item :label="$t('dictItem.sortOrder')" prop="sortOrder">
				<el-input-number v-model="dataForm.sortOrder" :placeholder="$t('dictItem.inputSortOrderTip')" clearable></el-input-number>
			</el-form-item>
			<el-form-item :label="$t('dictItem.remarks')" prop="remarks">
				<el-input
					type="textarea"
					maxlength="100"
					:rows="3"
					v-model="dataForm.remarks"
					:placeholder="$t('dictItem.inputRemarksTip')"
				></el-input>
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

<script setup lang="ts" name="dict-item-form">
import { useI18n } from 'vue-i18n';
import { getItemObj, addItemObj, putItemObj, validateDictItemLabel } from '/@/api/admin/dict';
import { useMessage } from '/@/hooks/message';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { t } = useI18n();

// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false);
const loading = ref(false);

const dataForm = reactive({
	id: '',
	dictId: '',
	dictType: '',
	value: '',
	label: '',
	description: '',
	sortOrder: 0,
	remarks: '',
});

const dataRules = reactive({
	value: [{ required: true, message: '数据值不能为空', trigger: 'blur' }],
	label: [
		{ required: true, message: '标签不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateDictItemLabel(rule, value, callback, dataForm.dictType, dataForm.id !== '');
			},
			trigger: 'blur',
		},
	],
	description: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
	sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (row: any, dictForm: any) => {
	visible.value = true;
	dataForm.id = '';

	nextTick(() => {
		dicDialogFormRef.value?.resetFields();
	});

	if (row?.id) {
		getItemObj(row.id).then((res) => {
			Object.assign(dataForm, res.data);
		});
	} else if (dictForm) {
		dataForm.dictId = dictForm.dictId;
		dataForm.dictType = dictForm.dictType;
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dicDialogFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	try {
		loading.value = true;
		dataForm.id ? await putItemObj(dataForm) : await addItemObj(dataForm);
		useMessage().success(t(dataForm.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
