<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="90px" ref="dataFormRef" v-loading="loading">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.type')" prop="type">
						<el-select :placeholder="t('social.inputTypeTip')" v-model="form.type">
							<el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in social_type">
								{{ item.label }}
							</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.remark')" prop="remark">
						<el-input :placeholder="t('social.inputRemarkTip')" v-model="form.remark" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.appId')" prop="appId">
						<el-input :placeholder="t('social.inputAppIdTip')" v-model="form.appId" />
					</el-form-item>
				</el-col>
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('social.appSecret')" prop="appSecret">
						<el-input :placeholder="t('social.inputAppSecretTip')" v-model="form.appSecret" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('social.redirectUrl')" prop="redirectUrl">
						<el-input :placeholder="t('social.inputRedirectUrlTip')" type="textarea" v-model="form.redirectUrl" />
					</el-form-item>
				</el-col>
				<el-col :span="24" class="mb20">
					<el-form-item :label="t('social.ext')" prop="ext">
						<el-input :placeholder="t('social.inputExtTip')" type="textarea" v-model="form.ext" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="AppSocialDetailsDialog" setup>
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/admin/social';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典
const { social_type } = useDict('social_type');

// 提交表单数据
const form = reactive({
	id: '',
	type: '',
	remark: '',
	appId: '' as string | undefined,
	appSecret: '' as string | undefined,
	redirectUrl: '',
	ext: '',
});

// 定义校验规则
const dataRules = ref({
	type: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
	appId: [{ required: true, message: 'appId不能为空', trigger: 'blur' }],
	remark: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
	redirectUrl: [
		{ required: true, message: '回调地址不能为空', trigger: 'blur' },
		{ validator: rule.url, trigger: 'blur' },
	],
	appSecret: [{ required: true, message: 'appSecret不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	nextTick(() => {
		dataFormRef.value?.resetFields();
	});

	// 获取appSocialDetails信息
	if (id) {
		form.id = id;
		getappSocialDetailsData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;

	// 隐藏敏感信息
	form.appSecret = form.appSecret?.includes('******') ? undefined : form.appSecret;
	form.appId = form.appId?.includes('******') ? undefined : form.appId;

	try {
		loading.value = true;
		if (form.id) {
			await putObj(form);
			useMessage().success(t('common.editSuccessText'));
		} else {
			await addObj(form);
			useMessage().success(t('common.addSuccessText'));
		}
		visible.value = false; // 关闭弹窗
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 初始化表单数据
const getappSocialDetailsData = (id: string) => {
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
