<template>
	<el-dialog :title="dataForm.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible" width="600">
		<el-form :model="dataForm" :rules="dataRules" label-width="100px" ref="dicDialogFormRef" v-loading="loading">
			<el-form-item :label="$t('sysdict.systemFlag')" prop="systemFlag">
				<el-radio-group v-model="dataForm.systemFlag">
					<el-radio border :key="index" :label="item.value" v-for="(item, index) in dict_type">
						{{ item.label }}
					</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item :label="$t('sysdict.dictType')" prop="dictType">
				<el-input :placeholder="$t('sysdict.inputDictTypeTip')" :disabled="dataForm.id !== ''" clearable v-model="dataForm.dictType"></el-input>
			</el-form-item>
			<el-form-item :label="$t('sysdict.description')" prop="description">
				<el-input :placeholder="$t('sysdict.inputDescriptionTip')" clearable v-model="dataForm.description"></el-input>
			</el-form-item>
			<el-form-item :label="$t('sysdict.remarks')" prop="remarks">
				<el-input type="textarea" maxlength="100" :rows="3" :placeholder="$t('sysdict.inputRemarksTip')" v-model="dataForm.remarks"></el-input>
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

<script lang="ts" name="systemDicDialog" setup>
import { useI18n } from 'vue-i18n';
import { addObj, getObj, putObj, validateDictType } from '/@/api/admin/dict';
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { rule } from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const { dict_type } = useDict('dict_type');
const { t } = useI18n();
// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false);
const loading = ref(false);

const dataForm = reactive({
	id: '',
	dictType: '',
	description: '',
	systemFlag: '0',
	remarks: '',
});

const dataRules = reactive({
	dictType: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('sysdict.dictTypeRequired'), trigger: 'blur' },
		{ validator: rule.validatorNameCn, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateDictType(rule, value, callback, dataForm.id !== '', t);
			},
			trigger: 'blur',
		},
	],
	systemFlag: [{ required: true, message: t('sysdict.systemFlagRequired'), trigger: 'blur' }],
	description: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('sysdict.descriptionRequired'), trigger: 'blur' },
	],
});

// 打开弹窗
const openDialog = async (id: string) => {
	visible.value = true;
	dataForm.id = '';
	nextTick(() => {
		dicDialogFormRef.value?.resetFields();
	});

	if (id) {
		try {
			const { data } = await getObj(id);
			Object.assign(dataForm, data);
		} catch (err: any) {
			useMessage().error(err.msg);
		}
	}
};

// 提交
const onSubmit = async () => {
	// 立即设置 loading，防止重复点击
	if (loading.value) return;
	loading.value = true;

	try {
		const valid = await dicDialogFormRef.value.validate().catch(() => {});
		if (!valid) {
			loading.value = false;
			return false;
		}

		const result = dataForm.id ? await putObj(dataForm) : await addObj(dataForm);
		useMessage().success(t(dataForm.id ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh', result.data);
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
