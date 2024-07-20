<template>
  <el-dialog title="WebHook推送" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
      <el-form-item label="业务名称" prop="configName">
        <el-input v-model="form.configName" placeholder="请输入业务名称" disabled/>
      </el-form-item>
      <el-form-item label="业务编码" prop="configKey">
        <template #label>业务编码
          <tip content="代码中通过业务编码发送"/>
        </template>
        <el-input v-model="form.configKey" placeholder="请输入业务编码" disabled/>
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="form.messageType" placeholder="请选择消息类型">
          <el-option v-for="item in filteredMessageTypeList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="messageTitle" v-if="form.messageType === 'link' || form.messageType === 'markdown'">
        <el-input v-model="form.messageTitle"/>
      </el-form-item>
      <el-form-item label="内容" prop="messageContent">
        <el-input type="textarea" rows="5" v-model="form.messageContent"/>
      </el-form-item>
      <el-form-item label="消息链接" prop="messageUrl" v-if="form.messageType === 'link'">
        <el-input v-model="form.messageUrl"/>
      </el-form-item>
      <el-form-item label="图片链接" prop="picUrl" v-if="form.messageType === 'link'">
        <el-input v-model="form.picUrl"/>
      </el-form-item>
      <el-form-item label="通知全部" prop="noticeAll">
        <el-radio-group v-model="form.noticeAll">
          <el-radio label="true" border>是</el-radio>
          <el-radio label="false" border>否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="提醒用户" prop="phones" v-if="form.noticeAll === 'false'">
        <tag-list buttonText="+手机号" v-model="form.phoneList"/>
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="HookSenderDialog">
import {useMessage} from "/@/hooks/message";
import {getObj} from '/@/api/admin/config'
import {sendHook} from '/@/api/admin/message'
import {rule, validateNull} from "/@/utils/validate";

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)

const messageTypeList = ref([
  {
    value: 'text',
    label: '文本'
  }, {
    value: 'markdown',
    label: 'Markdown'
  }, {
    value: 'link',
    label: '链接'
  }])


// 提交表单数据
const form = reactive({
  configType: 'webhook',
  configKey: 'webhook',
  configName: '',
  configValue: {
    supplier: '',
  },
  bizCode: '',
  messageType: 'text',
  id: '',
  messageTitle: '',
  messageContent: '',
  noticeAll: 'false',
  messageUrl: '',
  picUrl: '',
  phoneList: [],
});

// 定义校验规则
const dataRules = ref({
  messageType: [
    {required: true, message: '消息类型不能为空', trigger: 'blur'}, {validator: rule.overLength, trigger: 'blur'},
  ],
  messageTitle: [
    {required: true, message: '标题不能为空', trigger: 'blur'}, {validator: rule.overLength, trigger: 'blur'},
  ],
  messageContent: [
    {required: true, message: '内容不能为空', trigger: 'blur'},
  ],
  messageUrl: [
    {required: true, message: '手机号不能为空', trigger: 'blur'}, {validator: rule.overLength, trigger: 'blur'},
  ],
  picUrl: [
    {required: true, message: '图片地址不能为空', trigger: 'blur'}, {validator: rule.overLength, trigger: 'blur'},
  ],
})

// 过滤消息类型 , 微信不支持链接消息
const filteredMessageTypeList = computed(() => {
  if (form.configValue.supplier === 'we_talk') {
    return messageTypeList.value.filter(type => type.value !== 'link');
  }
  return messageTypeList.value;
});

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysMessage信息
  if (id) {
    form.id = id
    getConfigData(id)
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    await sendHook(form)
    useMessage().success('发送成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    visible.value = false;
    loading.value = false;
  }
};


// 初始化表单数据
const getConfigData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj({id}).then((res: any) => {
    Object.assign(form, res.data[0])
    form.configValue = JSON.parse(form.configValue)
    form.bizCode = form.configKey
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
