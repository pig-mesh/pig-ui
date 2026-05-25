<template>
	<el-drawer v-model="visible" :title="$t('personal.name')" size="40%">
		<el-tabs class="demo-tabs">
			<el-tab-pane :label="$t('personal.basicInfoTab')" v-loading="loading">
				<template #label>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" class="size-4">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
					</svg>
					{{ $t('personal.basicInfoTab') }}
				</template>
				<el-form :model="formData" :rules="ruleForm" label-width="100px" class="mt30" ref="formdataRef">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item prop="avatar">
								<upload-img v-model:imageUrl="formData.avatar" borderRadius="50%">
									<template #empty>
										<el-icon>
											<Avatar />
										</el-icon>
										<span>{{ $t('personal.uploadAvatar') }}</span>
									</template>
								</upload-img>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.usernameLabel')" prop="username">
								<el-input v-model="formData.username" clearable disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.phoneLabel')" prop="phone">
								<div class="flex w-full gap-2">
									<el-input v-model="formData.phone"
										:placeholder="$t('personal.inputPhonePlaceholder')"
										:style="{ width: showPhoneCodeInput ? '50%' : '100%' }"
										@focus="handlePhoneFocus">
										<template #suffix>
											<div class="flex items-center gap-1">
												<!-- 恢复按钮 - 仅当手机号被修改时显示 -->
												<el-icon v-if="showPhoneCodeInput"
													class="cursor-pointer hover:text-blue-500" @click="handleResetPhone"
													title="恢复原手机号">
													<ele-RefreshLeft />
												</el-icon>
												<!-- 清空按钮 - 当有内容时显示 -->
												<el-icon v-if="formData.phone" class="cursor-pointer hover:text-red-500"
													@click="formData.phone = undefined" title="清空">
													<ele-CircleClose />
												</el-icon>
											</div>
										</template>
									</el-input>

									<!-- 验证码输入框 - 仅在修改手机号时显示 -->
									<el-input v-if="showPhoneCodeInput" v-model="phoneCode" maxlength="4"
										:placeholder="$t('mobile.placeholder2')" clearable style="width: 30%">
										<template #prefix>
											<el-icon><ele-Position /></el-icon>
										</template>
									</el-input>

									<SmsCodeButton
										v-if="showPhoneCodeInput"
										:mobile="formData.phone"
										:registered="false"
										:validate="() => formdataRef?.validateField('phone')"
										class="w-1/5"
									/>
								</div>
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.emailLabel')" prop="email">
								<el-input v-model="formData.email" :placeholder="$t('personal.inputEmailPlaceholder')"
									clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.nicknameLabel')" prop="nickname">
								<el-input v-model="formData.nickname"
									:placeholder="$t('personal.inputNicknamePlaceholder')" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.nameLabel')" prop="name">
								<el-input v-model="formData.name" :placeholder="$t('personal.inputNamePlaceholder')"
									clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item>
								<el-button type="primary" @click="handleSaveUser">{{ $t('personal.updatePersonalInfo')
								}}</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane :label="$t('personal.securityInfoTab')">
				<template #label>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" class="size-4">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
					</svg>
					{{ $t('personal.securityInfoTab') }}
				</template>
				<el-form :model="passwordFormData" :rules="passwordRuleForm" label-width="100px" class="mt30"
					ref="passwordFormdataRef">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.oldPasswordLabel')" prop="password">
								<el-input v-model="passwordFormData.password" :type="showPassword ? 'text' : 'password'"
									:placeholder="$t('personal.oldPasswordPlaceholder')" clearable>
									<template #suffix>
										<i class="iconfont el-input__icon login-content-password"
											:class="showPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
											@click="showPassword = !showPassword">
										</i>
									</template>
								</el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.newPasswordLabel')" prop="newpassword1">
								<strength-meter v-model="passwordFormData.newpassword1" :minlength="10" :maxlength="12"
									:placeholder="$t('personal.newPasswordPlaceholder')"
								></strength-meter>
								<!--									<el-input v-model="passwordFormData.newpassword1" clearable type="password"></el-input>-->
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.confirmPasswordLabel')" prop="newpassword2">
								<strength-meter v-model="passwordFormData.newpassword2" :minlength="10" :maxlength="12"
									:placeholder="$t('personal.confirmPasswordPlaceholder')"></strength-meter>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item>
								<el-button type="primary" @click="handleChangePassword">{{
									$t('personal.changePasswordBtn')
								}}</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane :label="$t('personal.socialAccountTab')">
				<template #label>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" class="size-4">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
					</svg>

					{{ $t('personal.socialAccountTab') }}
				</template>
				<el-table :data="socialList" class="mt10">
					<el-table-column type="index" :label="$t('personal.indexColumn')" width="80"></el-table-column>
					<el-table-column prop="name" :label="$t('personal.platformColumn')"></el-table-column>
					<el-table-column :label="$t('personal.statusColumn')">
						<template #default="scope">
							<el-tag v-if="scope.row.openId">{{ $t('personal.bindStatus') }}</el-tag>
							<el-tag v-else>{{ $t('personal.unbindStatus') }}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="action" :label="$t('personal.actionColumn')">
						<template #default="scope">
							<el-button @click="unbinding(scope.row.type)" text type="primary" v-if="scope.row.openId">{{
								$t('personal.unbindBtn') }}</el-button>
							<el-button @click="handleClick(scope.row.type)" text type="primary" v-else>{{
								$t('personal.bindBtn') }}</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			<el-tab-pane :label="$t('personal.apiKeyTab')">
				<template #label>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
						stroke="currentColor" class="size-4">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
					</svg>
					{{ $t('personal.apiKeyTab') }}
				</template>
				<div class="mt10 api-key-section">
					<el-button type="primary" size="small" @click="handleCreateApiKey" class="mb10"
						:disabled="apiKeyList.length >= 5">
						{{ $t('personal.createApiKey') }}
					</el-button>
					<el-table
						:data="apiKeyList"
						v-loading="apiKeyLoading"
						border
						class="api-key-table"
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column type="index" :label="$t('personal.indexColumn')" width="60" />
						<el-table-column prop="name" :label="$t('personal.apiKeyName')" width="120" />
						<el-table-column prop="allowedIps" :label="$t('personal.allowedIps')" width="200" show-overflow-tooltip>
							<template #default="scope">
								{{ scope.row.allowedIps || $t('personal.noIpLimit') }}
							</template>
						</el-table-column>
						<el-table-column prop="expiresAt" :label="$t('personal.expiresAt')" width="170">
							<template #default="scope">
								{{ scope.row.expiresAt ? parseTime(scope.row.expiresAt) : $t('personal.neverExpire') }}
							</template>
						</el-table-column>
						<el-table-column prop="status" :label="$t('personal.statusColumn')" width="80">
							<template #default="scope">
								<el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">
									{{ scope.row.status === '0' ? $t('personal.enabled') : $t('personal.disabled') }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column prop="lastUsedAt" :label="$t('personal.lastUsedAt')" width="170">
							<template #default="scope">
								{{ scope.row.lastUsedAt ? parseTime(scope.row.lastUsedAt) : $t('personal.neverUsed') }}
							</template>
						</el-table-column>
						<el-table-column prop="createTime" :label="$t('personal.createTime')" width="170">
							<template #default="scope">
								{{ parseTime(scope.row.createTime) }}
							</template>
						</el-table-column>
						<el-table-column :label="$t('personal.actionColumn')" width="150">
							<template #default="scope">
								<el-button text type="primary" @click="handleEditApiKey(scope.row)">
									{{ $t('common.editBtn') }}
								</el-button>
								<el-button text type="primary" @click="handleDeleteApiKey(scope.row)">
									{{ $t('common.delBtn') }}
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<!-- 创建/编辑 API-KEY 弹窗 -->
				<el-dialog v-model="apiKeyDialogVisible" :title="apiKeyDialogTitle" width="500px" draggable>
					<el-form :model="apiKeyForm" label-width="100px" ref="apiKeyFormRef">
						<el-form-item :label="$t('personal.apiKeyName')" prop="name"
							:rules="[{ required: true, message: $t('personal.apiKeyNameRequired'), trigger: 'blur' }]">
							<el-input v-model="apiKeyForm.name" :placeholder="$t('personal.apiKeyNamePlaceholder')" clearable />
						</el-form-item>
						<el-form-item :label="$t('personal.allowedIps')" prop="allowedIps">
							<el-input
								v-model="apiKeyForm.allowedIps"
								type="textarea"
								:rows="3"
								:placeholder="$t('personal.allowedIpsPlaceholder')"
							/>
							<div class="mt-1 text-xs leading-relaxed text-gray-400">
								{{ $t('personal.allowedIpsHint') }}
							</div>
						</el-form-item>
						<el-form-item :label="$t('personal.expiresAt')" prop="expiresAt">
							<el-date-picker v-model="apiKeyForm.expiresAt" type="datetime" :value-format="dateTimeStr" :placeholder="$t('personal.expiresAtPlaceholder')" style="width: 100%" />
						</el-form-item>
						<el-form-item :label="$t('personal.statusColumn')" prop="status" v-if="apiKeyForm.id">
							<el-switch v-model="apiKeyForm.status" active-value="0" inactive-value="1"
								:active-text="$t('personal.enabled')" :inactive-text="$t('personal.disabled')" />
						</el-form-item>
						<el-form-item v-if="!apiKeyForm.id" :label="$t('personal.currentPassword')" prop="password"
							:rules="[{ required: true, message: $t('personal.currentPasswordRequired'), trigger: 'blur' }]">
							<el-input v-model="apiKeyForm.password" type="password" show-password
								:placeholder="$t('personal.currentPasswordPlaceholder')" clearable />
						</el-form-item>
					</el-form>
					<template #footer>
						<el-button @click="apiKeyDialogVisible = false">{{ $t('common.cancelButtonText') }}</el-button>
						<el-button type="primary" @click="handleSubmitApiKey" :loading="apiKeySubmitting">{{ $t('common.confirmButtonText') }}</el-button>
					</template>
				</el-dialog>

				<!-- 创建成功 — 显示明文 Key -->
				<el-dialog v-model="apiKeyResultVisible" :title="$t('personal.apiKeyCreated')" width="600px" :close-on-click-modal="false">
					<el-alert :title="$t('personal.apiKeyOnceWarning')" type="warning" show-icon :closable="false" class="mb10" />
					<el-input v-model="apiKeyResult" readonly>
						<template #append>
							<el-button @click="handleCopyApiKey">{{ $t('personal.copyBtn') }}</el-button>
						</template>
					</el-input>
				</el-dialog>
			</el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>

<script setup lang="ts" name="personal">
import { useUserInfo } from '/@/stores/userInfo';
import { editInfo, getObj, password, unbindingUser, validatePhone } from '/@/api/admin/user';
import SmsCodeButton from '/@/components/Verifition/SmsCodeButton.vue';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { rule, validateNull, clearMaskedField } from '/@/utils/validate';
import other from '/@/utils/other';
import { Session } from '/@/utils/storage';
import { useI18n } from 'vue-i18n';
import { getLoginAppList } from "/@/api/admin/social";
import { SocialLoginEnum } from '/@/api/login';
import { useEventListener } from '@vueuse/core';
import { fetchApiKeyList, createApiKey, updateApiKey, deleteApiKey } from '/@/api/admin/apikey';
import { useClipboard } from '@vueuse/core';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useSiteConfig } from '/@/stores/siteConfig';
import { createPasswordRuleValidator } from '/@/utils/passwordRule';

// 国际化函数
const { t } = useI18n();
const { tableStyle } = useTable({ createdIsNeed: false } as BasicTableProps);
const { siteConfig } = storeToRefs(useSiteConfig());

// 异步加载组件
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

// 控制抽屉显示/隐藏
const visible = ref(false);

/**
 * 用户基本信息表单数据
 * @property {string} userId - 用户ID
 * @property {string} username - 用户名
 * @property {string} name - 姓名
 * @property {string} email - 邮箱
 * @property {string} avatar - 头像URL
 * @property {string} nickname - 昵称
 * @property {string} wxDingUserid - 钉钉用户ID
 * @property {string} wxCpUserid - 企业微信用户ID
 * @property {string|undefined} phone - 手机号
 */
const formData = ref({
	userId: '',
	username: '',
	name: '',
	email: '',
	avatar: '',
	nickname: '',
	wxDingUserid: '',
	wxCpUserid: '',
	wxOpenid: '',
	phone: undefined as string | undefined,
});

// 保存初始手机号，用于判断是否修改了手机号
const initialPhone = ref<string | undefined>(undefined);

// 验证码相关状态
const phoneCode = ref('');

// 判断是否显示验证码输入框（仅当手机号被修改时显示）
const showPhoneCodeInput = computed(() => {
	return formData.value.phone !== initialPhone.value && formData.value.phone !== undefined;
});

// 控制密码输入框显示/隐藏
const showPassword = ref(false);

/**
 * 修改密码表单数据
 * @property {string} password - 旧密码
 * @property {string} newpassword1 - 新密码
 * @property {string} newpassword2 - 确认新密码
 */
const passwordFormData = reactive({
	password: '',
	newpassword1: '',
	newpassword2: '',
});

// 表单引用
const formdataRef = ref();
const passwordFormdataRef = ref();

/**
 * 自定义验证器：验证码条件验证
 * @description 仅当手机号被修改时，验证码才是必填的
 */
const validatorPhoneCode = (_rule: any, value: any, callback: any) => {
	// 如果手机号未修改，跳过验证
	if (formData.value.phone === initialPhone.value) {
		callback();
		return;
	}

	// 手机号已修改，验证码为必填
	if (!value || value.trim() === '') {
		callback(new Error(t('mobile.codeRequired')));
	} else if (value.length !== 4) {
		callback(new Error(t('mobile.codeLength')));
	} else {
		callback();
	}
};

// 用户基本信息表单验证规则
const ruleForm = reactive({
	phone: [
		{ required: true, message: t('personal.phoneRequired'), trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
		{
			validator: (rule: any, value: any, callback: any) => {
				validatePhone(rule, value, callback, true, initialPhone.value, t);
			},
			trigger: 'blur',
		},
	],
	code: [{ validator: validatorPhoneCode, trigger: 'blur' }],
	nickname: [{ validator: rule.overLength, trigger: 'blur' }, { required: true, message: t('personal.nicknameRequired'), trigger: 'blur' }],
	email: [{ validator: rule.overLength, trigger: 'blur' }, { required: true, message: t('personal.emailRequired'), trigger: 'blur' }],
	name: [{ validator: rule.overLength, trigger: 'blur' }, { required: true, message: t('personal.nameRequired'), trigger: 'blur' }],
});
/**
 * 自定义验证器：验证两次输入的新密码是否一致
 * @param rule 验证规则
 * @param value 当前输入值
 * @param callback 回调函数
 */
const validatorPassword2 = (_rule: any, value: any, callback: any) => {
	if (value !== passwordFormData.newpassword1) {
		callback(new Error(t('personal.passwordRule')));
	} else {
		callback();
	}
};

const passwordRuleValidator = createPasswordRuleValidator(() => siteConfig.value.passwordRule, t);

// 修改密码表单验证规则
const passwordRuleForm = reactive({
	password: [{ required: true, message: t('personal.passwordRequired'), trigger: 'blur' }],
	newpassword1: [
		{ required: true, message: t('personal.passwordRequired'), trigger: 'blur' },
		{ validator: passwordRuleValidator, trigger: 'blur' },
	],
	newpassword2: [
		{ required: true, message: t('personal.passwordRequired'), trigger: 'blur' },
		{ validator: validatorPassword2, trigger: 'blur' },
	],
});

/**
 * 处理修改密码操作
 * 1. 验证表单数据
 * 2. 调用修改密码接口
 * 3. 修改成功后清除缓存并重新加载页面（强制用户重新登录）
 */
const handleChangePassword = async () => {
	// 验证表单，捕获验证失败的情况
	const valid = await passwordFormdataRef.value.validate().catch(() => false);
	if (!valid) {
		return false;
	}

	try {
		// 调用修改密码接口
		await password(passwordFormData);
		useMessage().success(t('personal.updateSuccess'));
		// 需要重新登录
		// 清除缓存/token等
		Session.clear();
		// 使用 reload 时，不需要调用 resetRoute() 重置路由
		window.location.reload();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

/**
 * 处理手机号输入框获得焦点事件
 * @description 如果手机号是脱敏值，清空输入框让用户重新输入
 */
const handlePhoneFocus = () => {
	// 如果手机号包含脱敏字符，清空输入框
	if (formData.value.phone && formData.value.phone.includes('*')) {
		formData.value.phone = '';
	}
};

/**
 * 重置手机号到初始状态
 * @description 恢复原手机号、清空验证码、停止倒计时
 */
const handleResetPhone = () => {
	// 1. 恢复原手机号
	formData.value.phone = initialPhone.value;

	// 2. 清空验证码
	phoneCode.value = '';

	// 3. 清除验证错误提示
	formdataRef.value?.clearValidate(['phone', 'code']);
};

/**
 * 保存用户基本信息
 * 1. 验证表单数据
 * 2. 清除手机号脱敏占位符
 * 3. 调用编辑用户信息接口
 * 4. 更新全局用户信息状态
 */
const handleSaveUser = async () => {
	// 验证表单，捕获验证失败的情况
	const valid = await formdataRef.value.validate().catch(() => false);
	if (!valid) {
		return false;
	}

	// 清除脱敏占位符，避免提交错误的数据
	formData.value.phone = clearMaskedField(formData.value.phone);

	try {
		// 构建提交数据
		const submitData: any = { ...formData.value };

		// 如果手机号被修改，添加验证码参数
		if (formData.value.phone !== initialPhone.value) {
			submitData.code = phoneCode.value;
		} else {
			// 否则移除手机号参数，避免接口报错
			delete submitData.phone;
		}

		// 调用编辑用户信息接口
		await editInfo(submitData);
		useMessage().success(t('personal.updateSuccess'));

		// 更新初始手机号为新的手机号
		initialPhone.value = formData.value.phone;

		// 清空验证码输入
		phoneCode.value = '';

		// 更新上下文的 user信息
		useUserInfo().setUserInfos();
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

// 社交账号列表数据
const socialList = ref([] as any);

/**
 * 初始化社交账号列表
 * 根据用户信息中的第三方账号ID，构建社交账号绑定状态列表
 */
const initSocialList = () => {
	socialList.value = [
		{
			name: '企业微信',
			type: SocialLoginEnum.WEIXIN_CP,
			openId: formData.value.wxCpUserid,
		},
		{
			name: '钉钉办公',
			type: SocialLoginEnum.DINGTALK,
			openId: formData.value.wxDingUserid,
		},
		{
			name: '微信扫码',
			type: SocialLoginEnum.WECHAT,
			openId: formData.value.wxOpenid,
		},
	];
};

/**
 * 处理社交账号绑定操作
 * 1. 获取租户配置的第三方应用信息
 * 2. 根据不同的第三方平台类型构建授权URL
 * 3. 打开新窗口进行OAuth授权
 * @param thirdpart 第三方平台类型（企业微信、钉钉等）
 */
const handleClick = async (thirdpart: SocialLoginEnum) => {
	// 获取租户配置的账号信息
	const { data } = await getLoginAppList();
	const result = data.find((item: any) => item.type === thirdpart);

	// 验证是否配置了该第三方应用
	if (validateNull(result)) {
		useMessage().error(t('scan.appErrorTip'));
		return;
	}

	// 构建OAuth回调地址
	const redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');

	let url: string | undefined;
	switch (thirdpart) {
		case SocialLoginEnum.WEIXIN_CP:
			url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${result.appId}&agentid=${result.ext}&redirect_uri=${redirect_uri}&state=${SocialLoginEnum.WEIXIN_CP}-BIND`;
			break;
		case SocialLoginEnum.DINGTALK:
			url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${result.appId}&scope=openid&state=${SocialLoginEnum.DINGTALK}-BIND&prompt=consent`;
			break;
		case SocialLoginEnum.WECHAT:
			url = `https://open.weixin.qq.com/connect/qrconnect?appid=${result.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_login&state=${SocialLoginEnum.WECHAT}-BIND#wechat_redirect`;
			break;
	}

	// 打开授权窗口
	if (url) {
		other.openWindow(url, thirdpart, 540, 540);
	}
};

/**
 * 解绑社交账号
 * 1. 调用解绑接口
 * 2. 显示操作结果提示
 * 3. 刷新用户信息以更新绑定状态
 * @param type 第三方平台类型
 */
const unbinding = async (type: SocialLoginEnum) => {
	try {
		await unbindingUser(type);
		useMessage().success(t('personal.unbindSuccess'));
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		// 无论成功失败都刷新用户信息
		await initUserInfo(formData.value.userId);
	}
};

/**
 * 打开个人中心抽屉
 * 显示抽屉并加载当前登录用户的详细信息
 */
const open = () => {
	visible.value = true;
	const data = useUserInfo().userInfos;
	initUserInfo(data.user.userId);
	loadApiKeyList();
};

// 加载状态标识
const loading = ref(false);

/**
 * 初始化用户信息
 * 1. 根据用户ID获取用户详细信息
 * 2. 更新表单数据
 * 3. 初始化社交账号列表
 * @param userId 用户ID
 */
const initUserInfo = async (userId: any) => {
	loading.value = true;
	try {
		// 解构获取用户详细信息
		const { data } = await getObj(userId);
		formData.value = data;

		// 保存初始手机号，用于判断是否修改
		initialPhone.value = data.phone;

		// 清空验证码输入
		phoneCode.value = '';

		// 初始化社交账号绑定状态
		initSocialList();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 监听来自绑定窗口的消息
useEventListener(window, 'message', (event) => {
	// 验证消息来源
	if (event.origin !== window.location.origin) return;

	// 处理绑定成功消息
	if (event.data.type === 'social-bind-success') {
		// 刷新用户信息和社交账号列表
		initUserInfo(formData.value.userId);
	}
});

// ============ API-KEY 管理 ============
const apiKeyList = ref<any[]>([]);
const apiKeyLoading = ref(false);
const apiKeyDialogVisible = ref(false);
const apiKeyDialogTitle = ref('');
const apiKeyForm = ref<any>({});
const apiKeyFormRef = ref();
const apiKeySubmitting = ref(false);
const apiKeyResultVisible = ref(false);
const apiKeyResult = ref('');
const { copy } = useClipboard();

const loadApiKeyList = async () => {
	apiKeyLoading.value = true;
	try {
		const { data } = await fetchApiKeyList();
		apiKeyList.value = data || [];
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		apiKeyLoading.value = false;
	}
};

const handleCreateApiKey = () => {
	if (apiKeyList.value.length >= 5) {
		useMessage().warning(t('personal.apiKeyLimitReached'));
		return;
	}
	apiKeyForm.value = { name: '', allowedIps: '', expiresAt: null, password: '' };
	apiKeyDialogTitle.value = t('personal.createApiKey');
	apiKeyDialogVisible.value = true;
};

const handleEditApiKey = (row: any) => {
	apiKeyForm.value = { ...row };
	apiKeyDialogTitle.value = t('personal.editApiKey');
	apiKeyDialogVisible.value = true;
};

const handleSubmitApiKey = async () => {
	const valid = await apiKeyFormRef.value?.validate().catch(() => false);
	if (!valid) return;

	apiKeySubmitting.value = true;
	try {
		if (apiKeyForm.value.id) {
			await updateApiKey(apiKeyForm.value);
			useMessage().success(t('personal.updateSuccess'));
		} else {
			const { password, ...apiKeyData } = apiKeyForm.value;
			const { data } = await createApiKey(apiKeyData, password);
			apiKeyResult.value = data;
			apiKeyResultVisible.value = true;
		}
		apiKeyDialogVisible.value = false;
		loadApiKeyList();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		apiKeySubmitting.value = false;
	}
};

const handleDeleteApiKey = async (row: any) => {
	try {
		await useMessageBox().confirm(t('personal.deleteApiKeyConfirm'));
		await deleteApiKey(row.id);
		useMessage().success(t('personal.deleteSuccess'));
		loadApiKeyList();
	} catch (err: any) {
		if (err !== 'cancel' && err?.msg) {
			useMessage().error(err.msg);
		}
	}
};

const handleCopyApiKey = async () => {
	try {
		await copy(apiKeyResult.value);
		useMessage().success(t('personal.copySuccess'));
	} catch {
		useMessage().error(t('personal.copyFailed'));
	}
};

// 暴露变量
defineExpose({
	open,
});
</script>

<style scoped lang="scss">
.api-key-section {
	:deep(.el-table) {
		--el-table-tr-bg-color: var(--el-bg-color);
		--el-table-row-hover-bg-color: var(--el-fill-color-light);
	}

	:deep(.el-table__empty-text) {
		color: var(--el-text-color-secondary);
	}

	:deep(.el-table__cell .cell) {
		word-break: break-word;
	}

	[data-theme='dark'] & {
		:deep(.el-table) {
			--el-table-border-color: var(--el-border-color);
			--el-table-header-bg-color: var(--el-fill-color-light);
			--el-table-row-hover-bg-color: var(--el-fill-color);
			color: var(--el-text-color-primary);
		}
	}
}
</style>
