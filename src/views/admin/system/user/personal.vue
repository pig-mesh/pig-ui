<template>
	<el-drawer v-model="visible" :title="$t('personal.name')" size="40%">
		<el-tabs style="height: 200px" class="demo-tabs">
			<el-tab-pane label="基本信息" v-loading="loading">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          基本信息
        </template>
				<el-form :model="formData" :rules="ruleForm" label-width="100px" class="mt30" ref="formdataRef">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item prop="avatar">
								<ImageUpload v-model:imageUrl="formData.avatar" borderRadius="50%">
									<template #empty>
										<el-icon><Avatar /></el-icon>
										<span>请上传头像</span>
									</template>
								</ImageUpload>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="用户名" prop="username">
								<el-input v-model="formData.username" clearable disabled></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="手机" prop="phone">
								<el-input v-model="formData.phone" placeholder="请输入手机" clearable></el-input>
							</el-form-item>
						</el-col>

						<el-col :span="24" class="mb20">
							<el-form-item label="邮箱" prop="email">
								<el-input v-model="formData.email" placeholder="请输入邮箱" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="昵称" prop="nickname">
								<el-input v-model="formData.nickname" placeholder="请输入昵称" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="姓名" prop="name">
								<el-input v-model="formData.name" placeholder="请输入姓名" clearable></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item>
								<el-button type="primary" @click="handleSaveUser"> 更新个人信息 </el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="安全信息">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
          安全信息
        </template>
				<el-form :model="passwordFormData" :rules="passwordRuleForm" label-width="100px" class="mt30" ref="passwordFormdataRef">
					<el-row :gutter="20">
						<el-col :span="24" class="mb20">
							<el-form-item label="原密码" prop="password">
								<el-input v-model="passwordFormData.password"  :type="showPassword ? 'text' : 'password'" placeholder="请输入密码" clearable type="password">
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
							<el-form-item label="新密码" prop="newpassword1">
								<strength-meter
									v-model="passwordFormData.newpassword1"
									:minlength="6"
									:maxlength="16"
									placeholder="请输入新密码"
									@score="passwordScore"
								></strength-meter>
								<!--									<el-input v-model="passwordFormData.newpassword1" clearable type="password"></el-input>-->
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item label="确认密码" prop="newpassword2">
								<strength-meter v-model="passwordFormData.newpassword2" :minlength="6" :maxlength="16" placeholder="请重复密码"></strength-meter>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="mb20">
							<el-form-item>
								<el-button type="primary" @click="handleChangePassword"> 修改密码 </el-button>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="第三方账号">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
          </svg>

          社交登录
        </template>
				<el-table :data="socialList" class="mt10">
					<el-table-column type="index" label="序号" width="80"></el-table-column>
					<el-table-column prop="name" label="平台"></el-table-column>
					<el-table-column label="状态">
						<template #default="scope">
							<el-tag v-if="scope.row.openId"> 已绑定 </el-tag>
							<el-tag v-else> 未绑定 </el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="action" label="操作">
						<template #default="scope">
							<el-button @click="unbinding(scope.row.type)" text type="primary" v-if="scope.row.openId"> 解绑 </el-button>
							<el-button @click="handleClick(scope.row.type)" text type="primary" v-else> 绑定 </el-button>
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
import {rule, validateNull} from '/@/utils/validate';
import other from '/@/utils/other';
import {Session} from '/@/utils/storage';
import {useI18n} from 'vue-i18n';
import {getLoginAppList} from "/@/api/admin/social";
import { SocialLoginEnum } from '/@/api/login';

const { t } = useI18n();

const ImageUpload = defineAsyncComponent(() => import('/@/components/Upload/Image.vue'));
const StrengthMeter = defineAsyncComponent(() => import('/@/components/StrengthMeter/index.vue'));

const visible = ref(false);

// 定义变量内容
const formData = ref({
	userId: '',
	username: '',
	name: '',
	email: '',
	avatar: '',
	nickname: '',
	wxDingUserid: '',
	wxCpUserid: '',
	phone: ('' as string) || undefined,
});

const showPassword = ref(false);
const passwordFormData = reactive({
	password: '',
	newpassword1: '',
	newpassword2: '',
});

const formdataRef = ref();
const passwordFormdataRef = ref();

const ruleForm = reactive({
	phone: [
		{ required: true, message: '手机号不能为空', trigger: 'blur' },
		{ validator: rule.validatePhone, trigger: 'blur' },
	],
	nickname: [{ validator: rule.overLength, trigger: 'blur' },{ required: true, message: '昵称不能为空', trigger: 'blur' }],
	email: [{ validator: rule.overLength, trigger: 'blur' },{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
	name: [{ validator: rule.overLength, trigger: 'blur' },{ required: true, message: '姓名不能为空', trigger: 'blur' }],
});
const validatorPassword2 = (rule: any, value: any, callback: any) => {
	if (value !== passwordFormData.newpassword1) {
		callback(new Error(t('personal.passwordRule')));
	} else {
		callback();
	}
};
const validatorScore = (rule: any, value: any, callback: any) => {
	if (score.value <= 1) {
		callback(new Error(t('personal.passwordScore')));
	} else {
		callback();
	}
};

const passwordRuleForm = reactive({
	password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
	newpassword1: [
		{
			min: 6,
			max: 20,
			message: '用户密码长度必须介于 6 和 20 之间',
			trigger: 'blur',
		},
		{ validator: validatorScore, trigger: 'blur' },
	],
	newpassword2: [
		{
			min: 6,
			max: 20,
			message: '用户密码长度必须介于 6 和 20 之间',
			trigger: 'blur',
		},
		{ validator: validatorPassword2, trigger: 'blur' },
	],
});

const score = ref(0);

const passwordScore = (e: any) => {
	score.value = e;
};

const handleChangePassword = () => {
	passwordFormdataRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}
		password(passwordFormData)
			.then(() => {
				useMessage().success('修改成功');
				// 需要重新登录
				// 清除缓存/token等
				Session.clear();
				// 使用 reload 时，不需要调用 resetRoute() 重置路由
				window.location.reload();
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	});
};

// 保存用户
const handleSaveUser = () => {
	formdataRef.value.validate((valid: boolean) => {
		if (!valid) {
			return false;
		}

		if (formData.value.phone && formData.value.phone.includes('*')) {
			formData.value.phone = undefined;
		}

		editInfo(formData.value)
			.then(() => {
				useMessage().success('修改成功');
				// 更新上下文的 user信息
				useUserInfo().setUserInfos();
			})
			.catch((err) => {
				useMessage().error(err.msg);
			});
	});
};

const socialList = ref([] as any);

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

const handleClick = async (thirdpart: SocialLoginEnum) => {
	// 获取租户配置的账号信息
	const { data } = await getLoginAppList();
	const result = data.find((item: any) => item.type === thirdpart);
	if (validateNull(result)) {
		useMessage().error(t('scan.appErrorTip'));
		return;
	}

	let redirect_uri, url;
	redirect_uri = encodeURIComponent(window.location.origin + '/#/authredirect');

	if (thirdpart === SocialLoginEnum.WEIXIN_CP) {
		url = `https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=${result.appId}&agentid=${result.ext}&redirect_uri=${redirect_uri}&state=${SocialLoginEnum.WEIXIN_CP}-BIND`;
	}

	if (thirdpart === SocialLoginEnum.DINGTALK) {
		url = `https://login.dingtalk.com/oauth2/auth?redirect_uri=${redirect_uri}&response_type=code&client_id=${result.appId}&scope=openid&state=${SocialLoginEnum.DINGTALK}-BIND&prompt=consent`;
	}

	if (url) {
		other.openWindow(url, thirdpart, 540, 540);
	}
};

const unbinding = (type: SocialLoginEnum) => {
	unbindingUser(type)
		.then(() => {
			useMessage().success('解绑成功');
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			initUserInfo(formData.value.userId);
		});
};

const open = () => {
	visible.value = true;
	const data = useUserInfo().userInfos;
	initUserInfo(data.user.userId);
	// Object.assign(formData, data.user);
};

const loading = ref(false);
const initUserInfo = (userId: any) => {
	loading.value = true;
	getObj(userId)
		.then((res) => {
			formData.value = res.data;
			initSocialList();
		})
		.catch((err) => {
			useMessage().error(err.msg);
		})
		.finally(() => {
			loading.value = false;
		});
};

// 暴露变量
defineExpose({
	open,
});
</script>

<style scoped lang="scss">
@import '/@/theme/mixins/index.scss';

.personal {
	.personal-user {
		height: 130px;
		display: flex;
		align-items: center;

		.personal-user-left {
			width: 180px;
			height: 130px;
			border-radius: 3px;

			:deep(.el-upload) {
				height: 100%;
			}

			.personal-user-left-upload {
				img {
					width: 100%;
					height: 100%;
					border-radius: 3px;
				}

				&:hover {
					img {
						animation: logoAnimation 0.3s ease-in-out;
					}
				}
			}
		}

		.personal-user-right {
			flex: 1;
			padding: 0 15px;

			.personal-title {
				font-size: 18px;
				@include text-ellipsis(1);
			}

			.personal-item {
				display: flex;
				align-items: center;
				font-size: 13px;

				.personal-item-label {
					color: var(--el-text-color-secondary);
					@include text-ellipsis(1);
				}

				.personal-item-value {
					@include text-ellipsis(1);
				}
			}
		}
	}

	.personal-info {
		.personal-info-more {
			float: right;
			color: var(--el-text-color-secondary);
			font-size: 13px;

			&:hover {
				color: var(--el-color-primary);
				cursor: pointer;
			}
		}

		.personal-info-box {
			height: 130px;
			overflow: hidden;

			.personal-info-ul {
				list-style: none;

				.personal-info-li {
					font-size: 13px;
					padding-bottom: 10px;

					.personal-info-li-title {
						display: inline-block;
						@include text-ellipsis(1);
						color: var(--el-text-color-secondary);
						text-decoration: none;
					}

					& a:hover {
						color: var(--el-color-primary);
						cursor: pointer;
					}
				}
			}
		}
	}

	.personal-recommend-row {
		.personal-recommend-col {
			.personal-recommend {
				position: relative;
				height: 100px;
				border-radius: 3px;
				overflow: hidden;
				cursor: pointer;

				&:hover {
					i {
						right: 0px !important;
						bottom: 0px !important;
						transition: all ease 0.3s;
					}
				}

				i {
					position: absolute;
					right: -10px;
					bottom: -10px;
					font-size: 70px;
					transform: rotate(-30deg);
					transition: all ease 0.3s;
				}

				.personal-recommend-auto {
					padding: 15px;
					position: absolute;
					left: 0;
					top: 5%;
					color: var(--next-color-white);

					.personal-recommend-msg {
						font-size: 12px;
						margin-top: 10px;
					}
				}
			}
		}
	}

	.personal-edit {
		.personal-edit-title {
			position: relative;
			padding-left: 10px;
			color: var(--el-text-color-regular);

			&::after {
				content: '';
				width: 2px;
				height: 10px;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				background: var(--el-color-primary);
			}
		}

		.personal-edit-safe-box {
			border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
			padding: 15px 0;

			.personal-edit-safe-item {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.personal-edit-safe-item-left {
					flex: 1;
					overflow: hidden;

					.personal-edit-safe-item-left-label {
						color: var(--el-text-color-regular);
						margin-bottom: 5px;
					}

					.personal-edit-safe-item-left-value {
						color: var(--el-text-color-secondary);
						@include text-ellipsis(1);
						margin-right: 15px;
					}
				}
			}

			&:last-of-type {
				padding-bottom: 0;
				border-bottom: none;
			}
		}
	}
}

.el-icon.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 100%;
}

.item {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>
