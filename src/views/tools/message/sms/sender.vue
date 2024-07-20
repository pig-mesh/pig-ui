<template>
  <el-dialog title="短信发送测试" v-model="visible"
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
      <el-form-item label="接收手机号" prop="mobiles">
        <tag-list v-model="form.mobiles" buttonText="+手机号"/>
      </el-form-item>
      <el-form-item prop="data">
        <template #label>参数
          <tip content="参考短信模板参数配置  "/>
        </template>
        <json-editor
            ref="jsonEditorRef"
            v-model="form.data"
        />
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

<script setup lang="ts" name="SmsSenderDialog">
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue'
import {useMessage} from "/@/hooks/message";
import {getObj} from '/@/api/admin/config'
import {sendSms} from '/@/api/admin/message'
import {rule} from "/@/utils/validate";

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)

// 提交表单数据
const form = reactive({
  configType: 'sms',
  configKey: 'sms',
  configName: '',
  mobiles: [],
  bizCode: '',
  id: '',
  params: {},
  data: `{
    "code": "1234"
}`
});

// 定义校验规则
const dataRules = ref({
  data: [
    {required: true, message: '参数名称不能为空', trigger: 'blur'}, {validator: rule.json, trigger: 'blur'}
  ],
  mobiles: [
    {required: true, message: '手机号不能为空', trigger: 'blur'}, {validator: rule.validatePhone, trigger: 'blur'},
  ]
})

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
    form.params = JSON.parse(form.data)
    await sendSms(form)
    useMessage().success('发送成功');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    form.data = JSON.stringify(form.params)
    loading.value = false;
  }
};


// 初始化表单数据
const getConfigData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj({id}).then((res: any) => {
    Object.assign(form, res.data[0])
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
