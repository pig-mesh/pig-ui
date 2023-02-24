<template>
    <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
        :close-on-click-modal="false" draggable>
      <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
        <el-row :gutter="24">
	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.appName')" prop="appName">
	      <el-input v-model="form.appName" :placeholder="t('wx-fans-msg.inputAppNameTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.appLogo')" prop="appLogo">
	      <el-input v-model="form.appLogo" :placeholder="t('wx-fans-msg.inputAppLogoTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.wxUserId')" prop="wxUserId">
	      <el-input v-model="form.wxUserId" :placeholder="t('wx-fans-msg.inputWxUserIdTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.nickName')" prop="nickName">
	      <el-input v-model="form.nickName" :placeholder="t('wx-fans-msg.inputNickNameTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.headimgUrl')" prop="headimgUrl">
	      <el-input v-model="form.headimgUrl" :placeholder="t('wx-fans-msg.inputHeadimgUrlTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.type')" prop="type">
            <el-radio-group v-model="form.type">
	         <el-radio label="消息分类" border>消息分类</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repType')" prop="repType">
            <el-radio-group v-model="form.repType">
             <el-radio :label="item.value" v-for="(item, index) in repType" border :key="index">{{ item.label }}
	          </el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repEvent')" prop="repEvent">
            <el-radio-group v-model="form.repEvent">
	         <el-radio label="事件类型" border>事件类型</el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repContent')" prop="repContent">
	      <el-input type="textarea" v-model="form.repContent" :placeholder="t('wx-fans-msg.inputRepContentTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repMediaId')" prop="repMediaId">
	      <el-input v-model="form.repMediaId" :placeholder="t('wx-fans-msg.inputRepMediaIdTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repName')" prop="repName">
	      <el-input v-model="form.repName" :placeholder="t('wx-fans-msg.inputRepNameTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repDesc')" prop="repDesc">
	      <el-input v-model="form.repDesc" :placeholder="t('wx-fans-msg.inputRepDescTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repUrl')" prop="repUrl">
	      <el-input v-model="form.repUrl" :placeholder="t('wx-fans-msg.inputRepUrlTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repHqUrl')" prop="repHqUrl">
	      <el-input v-model="form.repHqUrl" :placeholder="t('wx-fans-msg.inputRepHqUrlTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.content')" prop="content">
	      <el-input v-model="form.content" :placeholder="t('wx-fans-msg.inputContentTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repThumbMediaId')" prop="repThumbMediaId">
	      <el-input v-model="form.repThumbMediaId" :placeholder="t('wx-fans-msg.inputRepThumbMediaIdTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repThumbUrl')" prop="repThumbUrl">
	      <el-input v-model="form.repThumbUrl" :placeholder="t('wx-fans-msg.inputRepThumbUrlTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repLocationX')" prop="repLocationX">
	      <el-input v-model="form.repLocationX" :placeholder="t('wx-fans-msg.inputRepLocationXTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repLocationY')" prop="repLocationY">
	      <el-input v-model="form.repLocationY" :placeholder="t('wx-fans-msg.inputRepLocationYTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.repScale')" prop="repScale">
	      <el-input v-model="form.repScale" :placeholder="t('wx-fans-msg.inputRepScaleTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.readFlag')" prop="readFlag">
            <el-radio-group v-model="form.readFlag">
             <el-radio :label="item.value" v-for="(item, index) in response_type" border :key="index">{{ item.label }}
	          </el-radio>
            </el-radio-group>
        </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.appId')" prop="appId">
	      <el-input v-model="form.appId" :placeholder="t('wx-fans-msg.inputAppIdTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.openId')" prop="openId">
	      <el-input v-model="form.openId" :placeholder="t('wx-fans-msg.inputOpenIdTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.remark')" prop="remark">
	      <el-input v-model="form.remark" :placeholder="t('wx-fans-msg.inputRemarkTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.delFlag')" prop="delFlag">
	      <el-input v-model="form.delFlag" :placeholder="t('wx-fans-msg.inputDelFlagTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.createTime')" prop="createTime">
	      <el-input v-model="form.createTime" :placeholder="t('wx-fans-msg.inputCreateTimeTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.updateTime')" prop="updateTime">
	      <el-input v-model="form.updateTime" :placeholder="t('wx-fans-msg.inputUpdateTimeTip')"/>
	    </el-form-item>
      </el-col>

	  <el-col :span="24" class="mb20">
	    <el-form-item :label="t('wx-fans-msg.tenantId')" prop="tenantId">
	      <el-input v-model="form.tenantId" :placeholder="t('wx-fans-msg.inputTenantIdTip')"/>
	    </el-form-item>
      </el-col>

		</el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button type="primary" @click="onSubmit">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
      </template>
    </el-drawer>
</template>

<script setup lang="ts" name="WxMsgDialog">
// 定义子组件向父组件传值/事件
import { useDict } from '/@/hooks/dict';
const emit = defineEmits(['refresh']);
import { useMessage } from "/@/hooks/message";
import { getObj, addObj, putObj } from '/@/api/mp/wx-fans-msg'
import { useI18n } from "vue-i18n"
import { rule } from '/@/utils/validate';

const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典
const { response_type } = useDict('response_type')

// 提交表单数据
const form = reactive({
    id: '',
    appName: '',
    appLogo: '',
    wxUserId: '',
    nickName: '',
    headimgUrl: '',
    type: '',
    repType: '',
    repEvent: '',
    repContent: '',
    repMediaId: '',
    repName: '',
    repDesc: '',
    repUrl: '',
    repHqUrl: '',
    content: '',
    repThumbMediaId: '',
    repThumbUrl: '',
    repLocationX: '',
    repLocationY: '',
    repScale: '',
    readFlag: '',
    appId: '',
    openId: '',
    remark: '',
    delFlag: '',
    createTime: '',
    updateTime: '',
    tenantId: '',
});

// 定义校验规则
const dataRules = ref({
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields()
  }

  // 获取wxMsg信息
  if (id) {
    form.id = id
    getwxMsgData(id)
  }
};

// 提交
const onSubmit = () => {
  dataFormRef.value.validate((valid: boolean) => {
    if (!valid) {
      return false
    }
    // 更新
    if (form.id) {
      loading.value = true
      putObj(form).then(() => {
        useMessage().success(t('common.editSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      }).finally(() => {
        loading.value = false
      })
    } else {
      loading.value = true
      addObj(form).then(() => {
        useMessage().success(t('common.addSuccessText'))
        visible.value = false // 关闭弹窗
        emit('refresh')
      }).catch((err: any) => {
        useMessage().error(err.msg)
      }).finally(() => {
        loading.value = false
      })
    }
  })
}

// 初始化表单数据
const getwxMsgData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>