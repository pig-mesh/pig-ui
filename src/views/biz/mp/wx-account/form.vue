<template>
	<el-dialog v-model="visible" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" size="50%">
		<el-form ref="dataFormRef" v-loading="loading" :model="form" :rules="dataRules" label-width="90px">
			<el-row :gutter="24">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.name')" prop="name">
						<el-input v-model="form.name" :placeholder="t('account.inputNameTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.account')" prop="account">
						<el-input v-model="form.account" :placeholder="t('account.inputAccountTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.appid')" prop="appid">
						<el-input v-model="form.appid" :placeholder="t('account.inputAppidTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.appsecret')" prop="appsecret">
						<el-input v-model="form.appsecret" :placeholder="t('account.inputAppsecretTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.url')" prop="url">
						<el-input v-model="form.url" :placeholder="t('account.inputUrlTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.token')" prop="token">
						<el-input v-model="form.token" :placeholder="t('account.inputTokenTip')" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('account.aeskey')" prop="aeskey">
						<el-input v-model="form.aeskey" :placeholder="t('account.inputAeskeyTip')" />
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

<script lang="ts" name="WxAccountDialog" setup>
// 定义子组件向父组件传值/事件
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/mp/wx-account';
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
	account: '',
	appid: '',
	appsecret: '' as string | undefined,
	url: '',
	token: '',
	aeskey: '',
});

// 定义校验规则
const dataRules = ref({
	name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
	account: [{ required: true, message: '微信号不能为空', trigger: 'blur' }],
	appid: [{ required: true, message: 'appid不能为空', trigger: 'blur' }],
	appsecret: [{ required: true, message: '密钥不能为空', trigger: 'blur' }],
	url: [
		{ required: true, message: 'url不能为空', trigger: 'blur' },
		{ validator: rule.url, trigger: 'blur' },
	],
	token: [{ required: true, message: 'token不能为空', trigger: 'blur' }],
	aeskey: [{ required: true, message: '加密密钥不能为空', trigger: 'blur' }],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取wxAccount信息
	if (id) {
		form.id = id;
		getwxAccountData(id);
	}
};

// 提交
const onSubmit = async () => {
	const valid = await dataFormRef.value.validate().catch(() => {});
	if (!valid) return false;
	if (form.appsecret && form.appsecret.includes('*')) {
		form.appsecret = undefined;
	}

	loading.value = true;
	try {
		if (form.id) {
			await putObj(form);
			useMessage().success(t('common.editSuccessText'));
		} else {
			await addObj(form);
			useMessage().success(t('common.addSuccessText'));
		}
		visible.value = false;
		emit('refresh');
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};
// 初始化表单数据
const getwxAccountData = (id: string) => {
	// 获取数据
	loading.value = true;
	getObj(id)
		.then((res: any) => {
			Object.assign(form, res.data);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
