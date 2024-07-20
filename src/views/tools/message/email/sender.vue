<template>
  <el-drawer title="邮件发送测试" v-model="visible" size="50%">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" label-width="100px" v-loading="loading">
      <el-form-item label="业务名称" prop="configName">
        <el-input v-model="form.configName" placeholder="请输入业务名称" disabled/>
      </el-form-item>
      <el-form-item label="业务编码" prop="configKey">
        <template #label>业务编码
          <tip content="代码中通过业务编码发送"/>
        </template>
        <el-input v-model="form.configKey" placeholder="请输入业务编码" disabled/>
      </el-form-item>
      <el-form-item label="收件人" prop="mailAddress">
        <tag-list v-if="visible" buttonText="+邮箱" v-model="form.mailAddress"/>
      </el-form-item>
      <el-form-item label="抄送人" prop="ccList">
        <tag-list v-if="visible" buttonText="+邮箱" v-model="form.ccList"/>
      </el-form-item>
      <el-form-item label="密抄人" prop="bccList">
        <tag-list v-if="visible" buttonText="+邮箱" v-model="form.bccList"/>
      </el-form-item>
      <el-form-item label="主题" prop="title">
        <el-input v-model="form.title"/>
      </el-form-item>
      <el-form-item prop="params">
        <template #label>参数
          <tip content="参考邮件模板参数配置"/>
        </template>
        <json-editor
            ref="jsonEditorRef"
            v-model="form.params"
        />
      </el-form-item>
      <el-form-item label="附件" prop="attachmentList">
        <upload-file
            v-if="visible"
            :limit="5"
            @change="handleFileChange"
            :fileType="fileType"
        />
      </el-form-item>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
        </span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="EmailSenderDialog">
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue'
import {ref, reactive, nextTick} from 'vue';
import {useMessage} from "/@/hooks/message";
import {getObj} from '/@/api/admin/config'
import {sendEmail} from '/@/api/admin/message'
import {rule} from "/@/utils/validate";

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
const fileType = ref(['jpeg', 'png', 'jpg', 'gif', 'md', 'doc', 'xls', 'ppt', 'txt', 'pdf', 'docx', 'xlsx', 'pptx', 'zip', 'rar'])

const form = reactive({
  title: '',// 标题
  configType: 'email',
  configKey: '',
  bizCode: '',
  configName: '',
  mailAddress: [],// 收件人
  ccList: [],// 抄送人
  bccList: [],// 密抄送人
  attachmentList: [],// 附件
  id: '',
  htmlValues: {},
  params: `{
    "code": "1234"
}`
});

const dataRules = ref({
  params: [
    {required: true, message: '参数不能为空', trigger: 'blur'},
    {validator: rule.json, trigger: 'blur'}
  ],
  title: [
    {required: true, message: '标题不能为空', trigger: 'blur'}, {validator: rule.overLength, trigger: 'blur'},
  ],
  mailAddress: [
    {required: true, message: '收件人号不能为空', trigger: 'blur'},
  ]
})

const openDialog = (id: string) => {
  visible.value = true
  form.id = ''
  // 重置表单数据
  nextTick(() => {

    dataFormRef.value?.resetFields();
  });

  if (id) {
    form.id = id
    getConfigData(id)
  }
};

const onSubmit = async () => {
  const valid = await dataFormRef?.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    form.htmlValues = JSON.parse(form.params)
    await sendEmail(form)
    useMessage().success('发送成功');
    visible.value = false
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    form.params = JSON.stringify(form.htmlValues)
    loading.value = false;
  }
};

const handleFileChange = (fileNames: string, fileList: any[]) => {
  form.attachmentList = fileList.map(file => file.fileUrl);
}

const getConfigData = (id: string) => {
  loading.value = true
  getObj({id}).then((res: any) => {
    Object.assign(form, res.data[0])
    form.bizCode = form.configKey
  }).finally(() => {
    loading.value = false
  })
};

defineExpose({
  openDialog
});
</script>
