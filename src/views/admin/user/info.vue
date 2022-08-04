<!--
  -    Copyright (c) 2018-2025, lengleng All rights reserved.
  -
  - Redistribution and use in source and binary forms, with or without
  - modification, are permitted provided that the following conditions are met:
  -
  - Redistributions of source code must retain the above copyright notice,
  - this list of conditions and the following disclaimer.
  - Redistributions in binary form must reproduce the above copyright
  - notice, this list of conditions and the following disclaimer in the
  - documentation and/or other materials provided with the distribution.
  - Neither the name of the pig4cloud.com developer nor the names of its
  - contributors may be used to endorse or promote products derived from
  - this software without specific prior written permission.
  - Author: lengleng (wangiegie@gmail.com)
  -->

<template>
  <div class="app-container calendar-list-container">
    <basic-container>
      <template>
        <el-row>
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="头像">
                  <el-upload
                    :headers="headers"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    class="avatar-uploader"
                    action="/admin/sys-file/upload"
                  >
                    <img v-if="ruleForm.avatar" id="avatar" :src="avatarUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon" />
                  </el-upload>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="ruleForm.username" type="text" disabled />
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="ruleForm.phone" placeholder="验证码登录使用" />
                </el-form-item>

                <el-form-item label="社交登录" prop="social">
                  <a href="#" class="icon-weixin1" @click="handleClick('wechat')"></a>｜
                  <a href="#" class="icon-qq" @click="handleClick('tencent')"></a> |
                  <a href="#" class="icon-gitee-fill-round" @click="handleClick('gitee')"></a> |
                  <a href="#" class="icon-C" @click="handleClick('osc')"></a>
                </el-form-item>
                <el-form-item label="原密码" prop="password">
                  <el-input v-model="ruleForm.password" type="password" auto-complete="off" />
                </el-form-item>
                <el-form-item label="新密码" prop="newpassword1">
                  <el-input v-model="ruleForm.newpassword1" type="password" auto-complete="off" />
                </el-form-item>
                <el-form-item label="确认密码" prop="newpassword2">
                  <el-input v-model="ruleForm.newpassword2" type="password" auto-complete="off" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm()">提交</el-button>
                  <el-button @click="resetForm()">重置</el-button>
                </el-form-item>
              </div>
            </el-col>
          </el-form>
        </el-row>
      </template>
    </basic-container>
  </div>
</template>

<script>
import { handleImg, openWindow } from "@/util";
import { mapState } from "vuex";
import store from "@/store";
import { getStore, setStore } from "@/util/store";
import { isValidateNoneMobile } from "@/util/validate";
import { editInfo } from "@/api/admin/user";

export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isValidateNoneMobile(value)[0]) {
        callback(new Error(isValidateNoneMobile(value)[1]));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (this.ruleForm.password !== "") {
        if (value !== this.ruleForm.newpassword1) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      avatarUrl: "",
      headers: {
        Authorization: "Bearer " + store.getters.access_token,
      },
      ruleForm: {
        username: "",
        password: "",
        newpassword1: "",
        newpassword2: "",
        avatar: "",
        phone: "",
      },
      rules: {
        phone: [{ required: false, validator: validatePhone, trigger: "blur" }],
        password: [
          {
            required: true,
            min: 6,
            message: "原密码不少于6位",
            trigger: "blur",
          },
        ],
        newpassword1: [
          {
            required: false,
            min: 6,
            message: "新密码不少于6位",
            trigger: "blur",
          },
        ],
        newpassword2: [
          { required: false, validator: validatePass, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.resetForm();
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (!valid) {
          return false;
        }
        editInfo(this.ruleForm).then((response) => {
          this.$notify.success("修改成功");
          // 修改后注销当前token,重新登录
          this.$store.dispatch("LogOut").then(() => {
            location.reload();
          });
        });
      });
    },
    resetForm() {
      this.ruleForm.password = undefined;
      this.ruleForm.newpassword1 = undefined;
      this.ruleForm.newpassword2 = undefined;
      this.ruleForm.username = this.userInfo.username;
      this.ruleForm.phone = this.userInfo.phone;
      this.ruleForm.avatar = this.userInfo.avatar;
      handleImg(this.userInfo.avatar, "avatar");
      //判断是否选择了租户ID
      const TENANT_ID = getStore({ name: "tenantId" });
      if (TENANT_ID) {
        this.headers["TENANT-ID"] = TENANT_ID; // 租户ID
      }
    },
    handleAvatarSuccess(res, file) {
      this.avatarUrl = URL.createObjectURL(file.raw);
      this.ruleForm.avatar = res.data.url;
    },
    handleClick(thirdpart) {
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
      openWindow(url, thirdpart, 540, 540);
    },
  },
};
</script>
<style lang="scss">
@import "@/styles/info.scss";
</style>
