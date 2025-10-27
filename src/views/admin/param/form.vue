<template>
	<el-dialog :close-on-click-modal="false" :title="form.publicId ? t('common.editBtn') : t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.publicName')" prop="publicName">
						<el-input :placeholder="t('param.inputpublicNameTip')" v-model="form.publicName" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.publicKey')" prop="publicKey">
						<el-input :placeholder="t('param.inputpublicKeyTip')" v-model="form.publicKey" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.publicValue')" prop="publicValue">
						<el-input :placeholder="t('param.inputpublicValueTip')" v-model="form.publicValue" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.status')" prop="status">
						<el-radio-group v-model="form.status">
							<el-radio :label="item.value" border v-for="(item, index) in status_type" :key="index">{{ item.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.validateCode')" prop="validateCode">
						<el-input :placeholder="t('param.inputvalidateCodeTip')" v-model="form.validateCode" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.publicType')" prop="publicType">
						<el-select :placeholder="t('param.inputpublicTypeTip')" v-model="form.publicType">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in param_type"></el-option>
						</el-select>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('param.systemFlag')" prop="systemFlag">
						<el-radio-group v-model="form.systemFlag">
							<el-radio :label="item.value" border v-for="(item, index) in dict_type" :key="index">{{ item.label }}</el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SysPublicParamDialog" setup>
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj, validateParamsCode, validateParamsName } from '/@/api/admin/param';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典
const { dict_type, status_type, param_type } = useDict('dict_type', 'status_type', 'param_type');

// 提交表单数据
const form = reactive({
	publicId: '',
	publicName: '',
	publicKey: '',
	publicValue: '',
	status: '0',
	validateCode: '',
	publicType: '0',
	systemFlag: '0',
});

// 定义校验规则
const dataRules = reactive({
	publicName: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('param.nameRequired'), trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateParamsName(rule, value, callback, form.publicId !== '', t);
			},
			trigger: 'blur',
		},
	],
	publicKey: [
		{ validator: rule.overLength, trigger: 'blur' },
		{ required: true, message: t('param.keyRequired'), trigger: 'blur' },
		{ validator: rule.validatorCapital, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validateParamsCode(rule, value, callback, form.publicId !== '', t);
			},
			trigger: 'blur',
		},
	],
	publicValue: [{ validator: rule.overLength, trigger: 'blur' }, { required: true, message: t('param.valueRequired'), trigger: 'blur' }],
	status: [{ required: true, message: t('param.statusRequired'), trigger: 'blur' }],
	publicType: [{ required: true, message: t('param.typeRequired'), trigger: 'blur' }],
	systemFlag: [{ required: true, message: t('param.systemFlagRequired'), trigger: 'blur' }],
});

// 打开弹窗
const openDialog = async (id: string) => {
	visible.value = true;
	form.publicId = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取sysPublicParam信息
	if (id) {
		form.publicId = id;
		await getPublicParamData(id);
	}
};

// 提交
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

		form.publicId ? await putObj(form) : await addObj(form);
		useMessage().success(t(form.publicId ? 'common.editSuccessText' : 'common.addSuccessText'));
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getPublicParamData = async (id: string) => {
	// 获取数据
	const { data } = await getObj(id);
	Object.assign(form, data);
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
