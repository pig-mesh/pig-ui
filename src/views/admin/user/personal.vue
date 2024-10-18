<template>
  <el-drawer v-model="visible" :title="$t('personal.name')" size="40%">
    <el-tabs class="demo-tabs">
      <el-tab-pane label="基本信息" v-loading="loading">
        <el-form :model="formData" :rules="ruleForm" label-width="100px" class="mt30" ref="formdataRef">
          <el-row :gutter="20">
            <el-col :span="24" class="mb20">
              <el-form-item prop="avatar">
                <ImageUpload v-model:imageUrl="formData.avatar" borderRadius="50%">
                  <template #empty>
                    <el-icon>
                      <Avatar/>
                    </el-icon>
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
                <el-button type="primary" @click="handleSaveUser"> 更新个人信息</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="安全信息">
        <el-form :model="passwordFormData" :rules="passwordRuleForm" label-width="100px" class="mt30"
                 ref="passwordFormdataRef">
          <el-row :gutter="20">
            <el-col :span="24" class="mb20">
              <el-form-item label="原密码" prop="password">
                <el-input v-model="passwordFormData.password" placeholder="请输入密码" clearable
                          type="password"></el-input>
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
                <strength-meter v-model="passwordFormData.newpassword2" :minlength="6" :maxlength="16"
                                placeholder="请重复密码"></strength-meter>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="mb20">
              <el-form-item>
                <el-button type="primary" @click="handleChangePassword"> 修改密码</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </el-drawer>
</template>

<script setup lang="ts" name="personal">
import {useUserInfo} from '/@/stores/userInfo';
import {editInfo, getObj, password, UnbindingUser} from '/@/api/admin/user';
import {useMessage} from '/@/hooks/message';
import {rule} from '/@/utils/validate';
import other from '/@/utils/other';
import {Session} from '/@/utils/storage';
import {useI18n} from 'vue-i18n';

const {t} = useI18n();

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
  phone: ('' as string) || undefined,
});

const passwordFormData = reactive({
  password: '',
  newpassword1: '',
  newpassword2: '',
});

const formdataRef = ref();
const passwordFormdataRef = ref();

const ruleForm = reactive({
  phone: [
    {required: true, message: '手机号不能为空', trigger: 'blur'},
    {validator: rule.validatePhone, trigger: 'blur'},
  ],
  nickname: [{validator: rule.overLength, trigger: 'blur'},{required: true, message: '昵称不能为空', trigger: 'blur'}],
  email: [{validator: rule.overLength, trigger: 'blur'},{required: true, message: '邮箱不能为空', trigger: 'blur'}],
  name: [{validator: rule.overLength, trigger: 'blur'},{required: true, message: '姓名不能为空', trigger: 'blur'}],
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
  password: [{validator: rule.overLength, trigger: 'blur'},{required: true, message: '密码不能为空', trigger: 'blur'}],
  newpassword1: [
    {
      min: 6,
      max: 20,
      message: '用户密码长度必须介于 6 和 20 之间',
      trigger: 'blur',
    },
    {validator: validatorScore, trigger: 'blur'},
  ],
  newpassword2: [
    {
      min: 6,
      max: 20,
      message: '用户密码长度必须介于 6 和 20 之间',
      trigger: 'blur',
    },
    {validator: validatorPassword2, trigger: 'blur'},
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

    if (formData.value.phone && formData.value.phone.indexOf('*') >= 0) {
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
