<template>
	<el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" draggable v-model="visible">
		<el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef">
			<el-row :gutter="20">
				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.clientId')" prop="clientId">
						<el-input :placeholder="t('client.inputClientIdTip')" v-model="form.clientId" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.clientSecret')" prop="clientSecret">
						<el-input :placeholder="t('client.inputClientSecretTip')" v-model="form.clientSecret" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.scope')" prop="scope">
						<el-input :placeholder="t('client.inputScopeTip')" v-model="form.scope" />
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('client.authorizedGrantTypes')" prop="authorizedGrantTypes">
						<el-checkbox-group v-model="form.authorizedGrantTypes">
							<el-checkbox :key="index" :label="item.value" v-for="(item, index) in grant_types">{{ item.label }} </el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.webServerRedirectUri')" prop="webServerRedirectUri">
						<el-input :placeholder="t('client.inputWebServerRedirectUriTip')" v-model="form.webServerRedirectUri" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.authorities')" prop="authorities">
						<el-input :placeholder="t('client.inputAuthoritiesTip')" v-model="form.authorities" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.accessTokenValidity')" prop="accessTokenValidity">
						<el-input :placeholder="t('client.inputAccessTokenValidityTip')" v-model="form.accessTokenValidity" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.refreshTokenValidity')" prop="refreshTokenValidity">
						<el-input :placeholder="t('client.inputRefreshTokenValidityTip')" v-model="form.refreshTokenValidity" />
					</el-form-item>
				</el-col>

				<el-col :span="12" class="mb20">
					<el-form-item :label="t('client.autoapprove')" prop="autoapprove">
						<el-radio-group v-model="form.autoapprove">
							<el-radio :key="index" :label="item.value" border v-for="(item, index) in common_status">{{ item.label }} </el-radio>
						</el-radio-group>
					</el-form-item>
				</el-col>

				<el-col :span="24" class="mb20">
					<el-form-item :label="t('client.additionalInformation')" prop="additionalInformation">
						<el-input :placeholder="t('client.inputAdditionalInformationTip')" type="textarea" v-model="form.additionalInformation" />
					</el-form-item>
				</el-col>
			</el-row>

			<el-collapse v-model="collapseActive">
				<el-collapse-item name="1" title="安全属性">
					<template #title>
						<el-icon class="header-icon">
							<info-filled />
						</el-icon>
						安全属性
					</template>

					<el-row>
						<el-col :span="12" class="mb20">
							<el-form-item :label="t('client.captchaFlag')" prop="captchaFlag">
								<el-radio-group v-model="form.captchaFlag">
									<el-radio :key="index" :label="item.value" border v-for="(item, index) in captcha_flag_types">
										{{ item.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="t('client.encFlag')" prop="encFlag">
								<el-radio-group v-model="form.encFlag">
									<el-radio :key="index" :label="item.value" border v-for="(item, index) in enc_flag_types">
										{{ item.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="mb20">
							<el-form-item :label="t('client.onlineQuantity')" prop="onlineQuantity">
								<el-radio-group v-model="form.onlineQuantity">
									<el-radio :key="index" :label="item.value" border v-for="(item, index) in enc_flag_types">
										{{ item.label }}
									</el-radio>
								</el-radio-group>
							</el-form-item>
						</el-col>
					</el-row>
				</el-collapse-item>
			</el-collapse>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false" formDialogRef>{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" formDialogRef type="primary">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
import { useMessage } from '/@/hooks/message';
import { addObj, getObj, putObj } from '/@/api/admin/client';
import { useI18n } from 'vue-i18n';
import { rule } from '/@/utils/validate';

const emit = defineEmits(['refresh']);

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
// 定义字典
const { grant_types, common_status, captcha_flag_types, enc_flag_types } = useDict(
	'grant_types',
	'common_status',
	'captcha_flag_types',
	'enc_flag_types'
);

// 提交表单数据
const form = reactive({
	id: '',
	clientId: '',
	clientSecret: '',
	scope: '',
	authorizedGrantTypes: [],
	webServerRedirectUri: '',
	authorities: '',
	accessTokenValidity: '',
	refreshTokenValidity: '',
	additionalInformation: '',
	autoapprove: '',
	delFlag: '',
	createBy: '',
	updateBy: '',
	createTime: '',
	updateTime: '',
	tenantId: '',
});

const collapseActive = ref('1');

// 定义校验规则
const dataRules = ref({
	clientId: [{ required: true, message: '编号不能为空', trigger: 'blur' }],
	clientSecret: [{ required: true, message: '密钥不能为空', trigger: 'blur' }],
	scope: [{ required: true, message: '域不能为空', trigger: 'blur' }],
	authorizedGrantTypes: [{ required: true, message: '授权模式不能为空', trigger: 'blur' }],
	accessTokenValidity: [{ required: true, message: '令牌时效不能为空', trigger: 'blur' }],
	refreshTokenValidity: [{ required: true, message: '刷新时效不能为空', trigger: 'blur' }],
	captchaFlag: [{ required: true, message: '是否开启验证码校验', trigger: 'blur' }],
	encFlag: [{ required: true, message: '是否开启密码加密传输', trigger: 'blur' }],
	onlineQuantity: [{ required: true, message: '是否允许同时在线', trigger: 'blur' }],
	authorities: [{ required: true, message: '权限不能为空', trigger: 'blur' }],
	autoapprove: [{ required: true, message: '自动放行不能为空', trigger: 'blur' }],
	webServerRedirectUri: [
		{ required: true, message: '回调地址不能为空', trigger: 'blur' },
		{ validator: rule.url, trigger: 'blur' },
	],
});

// 打开弹窗
const openDialog = (id: string) => {
	visible.value = true;
	form.id = '';

	// 重置表单数据
	if (dataFormRef.value) {
		dataFormRef.value.resetFields();
	}

	// 获取sysOauthClientDetails信息
	if (id) {
		form.id = id;
		getsysOauthClientDetailsData(id);
	}
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

// 初始化表单数据
const getsysOauthClientDetailsData = (id: string) => {
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
