<template>
  <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="100px" v-loading="loading">
      <el-form-item label="业务名称" prop="configName">
        <el-input v-model="form.configName" placeholder="请输入业务名称"/>
      </el-form-item>
      <el-form-item label="业务编码" prop="configKey">
        <template #label>业务编码
          <tip content="代码中通过业务编码发送"/>
        </template>
        <el-input v-model="form.configKey" placeholder="请输入业务编码"/>
      </el-form-item>
      <el-form-item label="云厂商" prop="configValue.supplier">
        <el-select v-model="form.configValue.supplier" placeholder="请选择云厂商">
          <el-option v-for="item in supplierList" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="AK" prop="configValue.accessKeyId">
        <el-input v-model="form.configValue.accessKeyId" placeholder="请输入accessKey"/>
      </el-form-item>
      <el-form-item label="SK" prop="configValue.accessKeySecret">
        <el-input v-model="form.configValue.accessKeySecret" placeholder="请输入accessKeySecret"/>
      </el-form-item>
      <el-form-item label="签名" prop="configValue.signature">
        <el-input v-model="form.configValue.signature" placeholder="请输入模板签名"/>
      </el-form-item>
      <el-form-item label="模板ID" prop="configValue.templateId">
        <el-input v-model="form.configValue.templateId" placeholder="请输入模板ID"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="configStatus">
        <el-radio-group v-model="form.configStatus">
          <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
              item.label
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="configValue.extParams">
        <template #label>扩展参数
          <tip content="参考 sms4j 文档配置json格式"/>
        </template>
        <json-editor
            ref="jsonEditorRef"
            v-model="form.configValue.extParams"
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

<script setup lang="ts" name="SysMessageSmsDialog">
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue'
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj, validateExist} from '/@/api/admin/config'
import {rule} from "/@/utils/validate";

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典
const {yes_no_type} = useDict('yes_no_type')

// 云厂商
const supplierList = ref([{
  value: 'alibaba',
  label: '阿里云'
}, {
  value: 'cloopen',
  label: '容联云'
}, {
  value: 'ctyun',
  label: '天翼云'
}, {
  value: 'emay',
  label: '亿美软通'
}, {
  value: 'huawei',
  label: '华为云短信'
}, {
  value: 'netease',
  label: '网易云信'
}, {
  value: 'tencent',
  label: '腾讯云短信'
}, {
  value: 'unisms',
  label: '合一短信'
}, {
  value: 'yunpian',
  label: '云片短信'
}, {
  value: 'zhutong',
  label: '助通短信'
}, {
  value: 'dingzhong',
  label: '鼎众短信'
}, {
  value: 'yunpian',
  label: '联麓短信'
}, {
  value: 'qiniu',
  label: '七牛云短信'
}])

// 提交表单数据
const form = reactive({
  configType: 'sms',
  id: '',
  configKey: '',
  configName: '',
  configValue: {
    supplier: '',
    accessKeyId: '',
    accessKeySecret: '' || undefined,
    signature: '',
    templateId: '',
    extParams: ''
  },
  configStatus: '1',
});

// 定义校验规则
const dataRules = ref({
  configName: [
    {required: true, message: '业务名称不能为空', trigger: 'blur'}, {validator: rule.overLength, trigger: 'blur'},
  ],
  configKey: [
    {required: true, message: '业务编码不能为空', trigger: 'blur'},
    {validator: rule.validatorCapital, trigger: 'blur'},
    {
      validator: (rule: any, value: any, callback: any) => {
        validateExist(rule, value, callback, form.id !== '');
      },
      trigger: 'blur',
    },
  ],
  'configValue.supplier': [
    {required: true, message: '厂商不能为空', trigger: 'blur'}
  ],
  'configValue.accessKeyId': [
    {required: true, message: 'AK 不能为空', trigger: 'blur'}
  ],
  'configValue.accessKeySecret': [
    {required: true, message: 'SK 不能为空', trigger: 'blur'}
  ],
  'configValue.signature': [
    {required: true, message: '签名不能为空', trigger: 'blur'}
  ],
  'configValue.templateId': [
    {required: true, message: '模板不能为空', trigger: 'blur'}
  ],
  'configValue.extParams': [
    {validator: rule.json, trigger: 'blur'}
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
    if (form.configValue.accessKeySecret?.includes('******')) {
      form.configValue.accessKeySecret = undefined
    }
    form.configValue = JSON.stringify(form.configValue) as any
    form.id ? await putObj(form) : await addObj(form);
    useMessage().success(form.id ? '修改成功' : '添加成功');
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};


// 初始化表单数据
const getConfigData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj({id}).then((res: any) => {
    Object.assign(form, res.data[0])
    form.configValue = JSON.parse(res.data[0].configValue)
    form.configValue.accessKeySecret = '******' as any
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog, supplierList
});
</script>
