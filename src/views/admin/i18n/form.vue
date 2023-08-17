<template>
	<el-dialog :close-on-click-modal="false" width="600" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-form-item :label="t('i18n.name')" prop="name">
				<el-input :placeholder="t('i18n.inputKeyTip')" v-model="form.name" />
			</el-form-item>
			<el-form-item :label="t('i18n.zhCn')" prop="zhCn">
				<el-input :placeholder="t('i18n.inputZhCnTip')" v-model="form.zhCn" />
			</el-form-item>
			<el-form-item :label="t('i18n.en')" prop="en">
				<el-input :placeholder="t('i18n.inputEnTip')" v-model="form.en" />
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

<script lang="ts" name="SysI18nDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateName, validateZhCn, validateEn } from '/@/api/admin/i18n';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 提交表单数据
const form = reactive({
	id: '',
	name: '',
	zhCn: '',
	en: '',
});

// 定义校验规则
const dataRules = ref({
	name: [
		{ required: true, message: 'name不能为空', trigger: 'blur' },
		{ validator: rule.noChinese, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateName(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	zhCn: [
		{ required: true, message: '中文不能为空', trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateZhCn(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
	en: [
		{ required: true, message: '英文不能为空', trigger: 'blur' },
		{ validator: rule.letter, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateEn(rule, value, callback, form.id !== '');
			},
			trigger: 'blur',
		},
	],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';
	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取sysI18n信息
	if (id) {
		form.id = id;
		getsysI18nData(id);
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
const getsysI18nData = (id: string) => {
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
