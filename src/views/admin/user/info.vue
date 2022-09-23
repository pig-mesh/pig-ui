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
      <el-tabs @tab-click="switchTab">
        <el-tab-pane label='信息管理' name='userManager'/>
        <el-tab-pane label='密码管理' name='passwordManager'/>
      </el-tabs>
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple">
            <el-form :model="userInfoForm"
                     :rules="userInfoFormRules"
                     ref="userInfoForm"
                     label-width="100px"
                     v-if="switchStatus==='userManager'"
                     class="demo-ruleForm">
              <el-form-item label="用户名"
                            prop="username">
                <el-input type="text"
                          v-model="userInfoForm.username"
                          disabled>
                  <template #prefix>
                    <i class="icon-yonghu"></i>
                  </template>
                </el-input>
              </el-form-item>
              <!--    短信验证码发送          -->
              <SendSmsCode v-model="userInfoForm" code-label="验证码" phone-label="手机号" lableWidth="100px"
                           ref="smsCodeForm" @validatePhone="validatePhone"/>
              <el-form-item>
                <el-button type="primary"
                           @click="submitForm('userInfoForm')">提交
                </el-button>
                <el-button @click="resetForm('userInfoForm')">重置</el-button>
              </el-form-item>
            </el-form>
            <el-form v-model="userInfoForm"
                     :rules="userInfoFormRules"
                     ref="userInfoForm"
                     label-width="100px"
                     v-if="switchStatus==='passwordManager'"
                     class="demo-ruleForm">
              <el-form-item label="原密码"
                            prop="password">
                <el-input type="password"
                          v-model="userInfoForm.password"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码"
                            prop="newpassword1">
                <el-input type="password"
                          v-model="userInfoForm.newpassword1"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="newpassword2">
                <el-input type="password"
                          v-model="userInfoForm.newpassword2"
                          auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           @click="submitForm('userInfoForm')">提交
                </el-button>
                <el-button @click="resetForm('userInfoForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
      </el-row>
    </basic-container>
  </div>
</template>


<script>
import {mapState} from 'vuex'
import {checkPhone} from "@/const/crud/admin/user.js";
import SendSmsCode from "@/components/sms/sms.vue";
import {editInfo} from "@/api/admin/user.js";

export default {
  components: {SendSmsCode},
  data() {
    var validatePass = (rule, value, callback) => {
      if (this.userInfoForm.password !== '') {
        if (value !== this.userInfoForm.newpassword1) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      switchStatus: '',
      show: false,
      userInfoForm: {
        username: '',
        password: '',
        newpassword1: '',
        newpassword2: '',
        phone: ''
      },
      userInfoFormRules: {
        password: [{required: true, min: 6, message: '原密码不能为空且不少于6位', trigger: 'change'}],
        newpassword1: [{required: false, min: 6, message: '不少于6位', trigger: 'change'}],
        newpassword2: [{required: false, validator: validatePass, trigger: 'blur'}]
      }
    }
  },
  created() {
    this.userInfoForm.username = this.userInfo.username
    this.userInfoForm.phone = this.userInfo.phone
    this.switchStatus = 'userManager'
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
  },
  methods: {
    switchTab(tab, event) {
      this.switchStatus = tab.paneName
    },
    validatePhone(rule, value, callback) {
      checkPhone(rule, value, callback)
    },
    submitForm(formName) {
      if (this.switchStatus === 'userManager') {
        this.$refs.smsCodeForm.validate((valid2) => {
          if (valid2) {
            this.edit()
          }
        })
      }

      if (this.switchStatus === 'passwordManager') {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.edit()
          }
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    edit() {
      editInfo(this.userInfoForm).then(response => {
        if (response.data.data) {
          // 更新个人信息
          this.$store.dispatch('GetUserInfo')
          this.$message.success("修改成功")
        } else {
          this.$message.error(response.data.msg)
        }
      }).catch(() => {
        this.$message.error("修改失败")
      })
    }
  }
}
</script>
