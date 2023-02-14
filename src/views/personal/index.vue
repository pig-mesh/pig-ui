<template>
	<div class="personal layout-pd">
		<el-row>
			<!-- 个人信息 -->
			<el-col :span="24">
				<el-card shadow="hover" header="个人信息">
					<div class="personal-user">
						<div class="personal-user-left">
							<el-upload class="h100 personal-user-left-upload" action="/admin/sys-file/upload"
                         :headers="headers"
                         :on-success="handleAvatarSuccess" :limit="1">
								<img :src="formData.avatar" />
							</el-upload>
						</div>
						<div class="personal-user-right">
							<el-row>
								<el-col :span="24" class="personal-title mb18">{{ currentTime }}，admin，生活变的再糟糕，也不妨碍我变得更好！ </el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6">
											<div class="personal-item-label">昵称：</div>
											<div class="personal-item-value">{{formData.nickname}}</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">身份：</div>
											<div class="personal-item-value">超级管理</div>
										</el-col>
									</el-row>
								</el-col>
								<el-col :span="24">
									<el-row>
										<el-col :xs="24" :sm="8" class="personal-item mb6">
											<div class="personal-item-label">登录IP：</div>
											<div class="personal-item-value">192.168.1.1</div>
										</el-col>
										<el-col :xs="24" :sm="16" class="personal-item mb6">
											<div class="personal-item-label">登录时间：</div>
											<div class="personal-item-value">2021-02-05 18:47:26</div>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</div>
					</div>
				</el-card>
			</el-col>

			<!-- 更新信息 -->
			<el-col :span="24">
				<el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
					<div class="personal-edit-title">基本信息</div>
					<el-form :model="formData" size="default" :rules="ruleForm" label-width="100px" class="mt35 mb35" ref="formdataRef">
						<el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="formData.username" clearable disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="手机" prop="phone">
                  <el-input v-model="formData.phone" placeholder="请输入手机" clearable></el-input>
                </el-form-item>
              </el-col>

							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="邮箱" prop="email">
									<el-input v-model="formData.email" placeholder="请输入邮箱" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="昵称" prop="nickname">
									<el-input v-model="formData.nickname" placeholder="请输入昵称" clearable></el-input>
								</el-form-item>
							</el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="姓名" prop="name">
									<el-input v-model="formData.name" placeholder="请输入姓名" clearable></el-input>
								</el-form-item>
							</el-col>
							<el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
								<el-form-item label="原密码" prop="password">
                  <el-input v-model="formData.password" placeholder="请输入密码" clearable type="password"></el-input>
								</el-form-item>
							</el-col>
              <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="mb20">
                <el-form-item label="新密码" prop="newpassword1">
                  <el-input v-model="formData.newpassword1" clearable type="password"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="确认密码" prop="newpassword2">
                  <el-input v-model="formData.newpassword2" clearable type="password"></el-input>
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="8" :sm="12" :xl="4" :xs="24" class="mb20">
                <el-form-item label="社交登录" prop="social">
                  <div @click="handleClick('wechat')">
                    <span :style="{ backgroundColor: '#6ba2d6' }" class="container">
                      <i class="iconfont icon-weixin" icon-class="wechat"/>
                    </span>
                    <p class="title">微信</p>
                  </div>
                  <div @click="handleClick('tencent')">
                    <span :style="{ backgroundColor: '#8dc349' }" class="container">
                      <i class="iconfont icon-qq" icon-class="qq"/>
                    </span>
                    <p class="title">QQ</p>
                  </div>
                  <div @click="handleClick('gitee')">
                    <span :style="{ backgroundColor: '#bf3030' }" class="container">
                      <i class="iconfont icon-logo_gitee_icon" icon-class="qq"/>
                    </span>
                    <p class="title">Gitee</p>
                  </div>
                  <div @click="handleClick('osc')">
                    <span :style="{ backgroundColor: '#007B25' }" class="container">
                      <i class="iconfont icon-oschina" icon-class="qq"/>
                    </span>
                    <p class="title">开源中国</p>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
                <el-form-item>
                  <el-button type="primary" @click="handleSaveUser">
                    <el-icon>
                      <ele-Position/>
                    </el-icon>
                    更新个人信息
                  </el-button>
                </el-form-item>
							</el-col>
						</el-row>
					</el-form>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="personal">
import {computed, reactive} from 'vue';
import {formatAxis} from '/@/utils/formatTime';
import {useUserInfo} from '/@/stores/userInfo';
import {editInfo} from '/@/api/admin/user'
import {useMessage} from "/@/hooks/message";
import {Session} from "/@/utils/storage";
import {rule} from "/@/utils/validate";

// 定义变量内容
const formData = reactive({
  username: '',
  name: '',
  email: '',
  avatar: '',
  nickname: '',
  phone: '',
  password: '',
  newpassword1: '',
  newpassword2: ''
});

const formdataRef = ref()

const ruleForm = reactive({
  password: [{ required: true, message: "密码不能为空", trigger: "blur" }],
  phone: [{ required: true, message: "手机号不能为空", trigger: "blur" },{ validator: rule.validatePhone, trigger: 'blur' }],
  nickname: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
  email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  newpassword1: [{
    min: 6,
    max: 20,
    message: "用户密码长度必须介于 6 和 20 之间",
    trigger: "blur"
  }]
})


const handleAvatarSuccess = (res: any) => {
  formData.avatar = res.data.url;
}


const headers = computed(() => {
  const tenantId = Session.get("tenantId")
  return {
    'Authorization': "Bearer " + Session.get("token"),
    'TENANT-ID': tenantId ? tenantId : '1'
  };
})

onMounted(() => {
  const data = useUserInfo().userInfos
  Object.assign(formData,data.user)
  formData.password = ''
})

const handleSaveUser = () =>{
  formdataRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    editInfo(formData).then(() => {
      useMessage().success("修改成功")
      // 清除缓存/token等
      Session.clear();
      // 使用 reload 时，不需要调用 resetRoute() 重置路由
      window.location.reload();

    }).catch(err => {
      useMessage().error(err.msg)
    })
  })

}


// 当前时间提示语
const currentTime = computed(() => {
  return formatAxis(new Date());
});

const handleClick = (thirdpart: string) => {
  let appid, client_id, redirect_uri, url;
  redirect_uri = encodeURIComponent(
      window.location.origin + "/#/authredirect"
  );
  if (thirdpart === "wechat") {
    appid = "wxd1678d3f83b1d83a";
    url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appid}&redirect_uri=${redirect_uri}&state=WX-BIND&response_type=code&scope=snsapi_login#wechat_redirect`;
  } else if (thirdpart === "tencent") {
    client_id = "101322838";
    url = `https://graph.qq.com/oauth2.0/authorize?response_type=code&state=QQ-BIND&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  } else if (thirdpart === "gitee") {
    client_id =
        "235ce26bbc59565b82c989aa3a407ce844cf59a7c5e0f9caa9bb3bf32cee5952";
    url = `https://gitee.com/oauth/authorize?response_type=code&state=GITEE-BIND&client_id=${client_id}&redirect_uri=${redirect_uri}`;
  } else if (thirdpart === "osc") {
    client_id = "neIIqlwGsjsfsA6uxNqD";
    url = `https://www.oschina.net/action/oauth2/authorize?response_type=code&client_id=${client_id}&state=OSC-BIND&redirect_uri=${redirect_uri}`;
  }
  other.openWindow(url, thirdpart, 540, 540)
}


</script>

<style scoped lang="scss">
@import '../../theme/mixins/index.scss';
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
</style>
