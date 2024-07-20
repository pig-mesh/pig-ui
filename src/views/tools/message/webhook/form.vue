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
      <el-form-item label="Token ID" prop="configValue.tokenId">
        <el-input v-model="form.configValue.tokenId" placeholder="请输入Token ID"/>
      </el-form-item>
      <el-form-item label="签名" prop="configValue.sign">
        <el-input v-model="form.configValue.sign" placeholder="请输入签名"/>
      </el-form-item>
      <el-form-item label="启用状态" prop="configStatus">
        <el-radio-group v-model="form.configStatus">
          <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
              item.label
            }}
          </el-radio>
        </el-radio-group>
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

<script setup lang="ts" name="SysMessageHookDialog">
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
  value: 'ding_talk',
  label: '钉钉'
}, {
  value: 'byte_talk',
  label: '飞书'
}, {
  value: 'we_talk',
  label: '企微'
}])

// 提交表单数据
const form = reactive({
  configType: 'webhook',
  id: '',
  configKey: '',
  configName: '',
  configValue: {
    tokenId: '' || undefined,
    sign: '' || undefined,
    supplier: '',
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
  'configValue.tokenId': [
    {required: true, message: 'Token ID  不能为空', trigger: 'blur'}
  ],
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
    if (form.configValue.tokenId?.includes('******')) {
      form.configValue.tokenId = undefined
    }

    if (form.configValue.sign?.includes('******')) {
      form.configValue.sign = undefined
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
    form.configValue.tokenId = '******' as any
    form.configValue.sign = '******' as any
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog, supplierList
});
</script>
