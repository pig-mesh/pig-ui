<template>
	<el-drawer v-model="visible" :title="$t('personal.name')" size="40%">
		<el-tabs style="height: 200px" class="demo-tabs">
			<el-tab-pane :label="$t('personal.basicInfoTab')" v-loading="loading">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {{ $t('personal.basicInfoTab') }}
        </template>
				<el-form :model="formData" :rules="ruleForm" label-width="100px" class="mt30" ref="formdataRef">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item prop="avatar">
								<ImageUpload v-model:imageUrl="formData.avatar" borderRadius="50%">
									<template #empty>
										<el-icon><Avatar /></el-icon>
										<span>{{ $t('personal.uploadAvatar') }}</span>
									</template>
								</ImageUpload>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.usernameLabel')" prop="username">
								<el-input v-model="formData.username" clearable disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.phoneLabel')" prop="phone">
								<el-input v-model="formData.phone" :placeholder="$t('personal.inputPhonePlaceholder')" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.emailLabel')" prop="email">
								<el-input v-model="formData.email" :placeholder="$t('personal.inputEmailPlaceholder')" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.nicknameLabel')" prop="nickname">
								<el-input v-model="formData.nickname" :placeholder="$t('personal.inputNicknamePlaceholder')" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.nameLabel')" prop="name">
								<el-input v-model="formData.name" :placeholder="$t('personal.inputNamePlaceholder')" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item>
								<el-button type="primary" @click="handleSaveUser">{{ $t('personal.updatePersonalInfo') }}</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane :label="$t('personal.securityInfoTab')">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          {{ $t('personal.securityInfoTab') }}
        </template>
				<el-form :model="passwordFormData" :rules="passwordRuleForm" label-width="100px" class="mt30" ref="passwordFormdataRef">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.oldPasswordLabel')" prop="password">
								<el-input v-model="passwordFormData.password"  :type="showPassword ? 'text' : 'password'" :placeholder="$t('personal.oldPasswordPlaceholder')" clearable>
                  <template #suffix>
                    <i
                        class="iconfont el-input__icon login-content-password"
                        :class="showPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
                        @click="showPassword = !showPassword"
                    >
                    </i>
                  </template>
                </el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.newPasswordLabel')" prop="newpassword1">
								<strength-meter
									v-model="passwordFormData.newpassword1"
									:minlength="6"
									:maxlength="16"
									:placeholder="$t('personal.newPasswordPlaceholder')"
									@score="passwordScore"
								></strength-meter>
								<!--									<el-input v-model="passwordFormData.newpassword1" clearable type="password"></el-input>-->
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item :label="$t('personal.confirmPasswordLabel')" prop="newpassword2">
								<strength-meter v-model="passwordFormData.newpassword2" :minlength="6" :maxlength="16" :placeholder="$t('personal.confirmPasswordPlaceholder')"></strength-meter>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item>
								<el-button type="primary" @click="handleChangePassword">{{ $t('personal.changePasswordBtn') }}</el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane :label="$t('personal.socialAccountTab')">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
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
							<el-button @click="unbinding(scope.row.type)" text type="primary" v-if="scope.row.openId">{{ $t('personal.unbindBtn') }}</el-button>
							<el-button @click="handleClick(scope.row.type)" text type="primary" v-else>{{ $t('personal.bindBtn') }}</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</el-drawer>
</template>

<script setup lang="ts" name="personal">
import {useUserInfo} from '/@/stores/userInfo';
import {editInfo, getObj, password, unbindingUser} from '/@/api/admin/user';
import {useMessage} from '/@/hooks/message';
import {rule, validateNull, clearMaskedField} from '/@/utils/validate';
import other from '/@/utils/other';
import {Session} from '/@/utils/storage';
import {useI18n} from 'vue-i18n';
import {getLoginAppList} from "/@/api/admin/social";
import { SocialLoginEnum } from '/@/api/login';

// 国际化函数
const { t } = useI18n();

// 异步加载组件
const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
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
	phone: undefined as string | undefined,
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

// 用户基本信息表单验证规则
const ruleForm = reactive({
	phone: [
		{ required: true, message: t('personal.phoneRequired'), trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
	],
	nickname: [{ validator: rule.overLength, trigger: 'blur' },{ required: true, message: t('personal.nicknameRequired'), trigger: 'blur' }],
	email: [{ validator: rule.overLength, trigger: 'blur' },{ required: true, message: t('personal.emailRequired'), trigger: 'blur' }],
	name: [{ validator: rule.overLength, trigger: 'blur' },{ required: true, message: t('personal.nameRequired'), trigger: 'blur' }],
});
/**
 * 自定义验证器：验证两次输入的新密码是否一致
 * @param rule 验证规则
 * @param value 当前输入值
 * @param callback 回调函数
 */
const validatorPassword2 = (rule: any, value: any, callback: any) => {
	if (value !== passwordFormData.newpassword1) {
		callback(new Error(t('personal.passwordRule')));
	} else {
		callback();
	}
};

/**
 * 自定义验证器：验证密码强度评分是否达标
 * @param rule 验证规则
 * @param value 当前输入值
 * @param callback 回调函数
 */
const validatorScore = (rule: any, value: any, callback: any) => {
	if (score.value <= 1) {
		callback(new Error(t('personal.passwordScore')));
	} else {
		callback();
	}
};

// 修改密码表单验证规则
const passwordRuleForm = reactive({
	password: [{ required: true, message: t('personal.passwordRequired'), trigger: 'blur' }],
	newpassword1: [
		{
			min: 6,
			max: 20,
			message: t('personal.passwordLengthRule'),
			trigger: 'blur',
		},
		{ validator: validatorScore, trigger: 'blur' }, // 验证密码强度
	],
	newpassword2: [
		{
			min: 6,
			max: 20,
			message: t('personal.passwordLengthRule'),
			trigger: 'blur',
		},
		{ validator: validatorPassword2, trigger: 'blur' }, // 验证两次密码是否一致
	],
});

// 密码强度评分（0-4，0最弱，4最强）
const score = ref(0);

/**
 * 密码强度评分回调函数
 * @param e 密码强度评分值
 */
const passwordScore = (e: any) => {
	score.value = e;
};

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
		// 调用编辑用户信息接口
		await editInfo(formData.value);
		useMessage().success(t('personal.updateSuccess'));
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
	let redirect_uri, url;
	redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');

	// 企业微信授权URL
	if (thirdpart === SocialLoginEnum.WEIXIN_CP) {
		url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${result.appId}&agentid=${result.ext}&redirect_uri=${redirect_uri}&state=${SocialLoginEnum.WEIXIN_CP}-BIND`;
	}

	// 钉钉授权URL
	if (thirdpart === SocialLoginEnum.DINGTALK) {
		url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${result.appId}&scope=openid&state=${SocialLoginEnum.DINGTALK}-BIND&prompt=consent`;
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
		// 初始化社交账号绑定状态
		initSocialList();
	} catch (err: any) {
		useMessage().error(err.msg);
	} finally {
		loading.value = false;
	}
};

// 暴露变量
defineExpose({
	open,
});
</script>

