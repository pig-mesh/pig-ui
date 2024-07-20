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

      <el-form-item label="服务地址" prop="configValue.smtpServer">
        <el-input v-model="form.configValue.smtpServer" placeholder="请输入服务地址"/>
      </el-form-item>

      <el-row>
        <el-col :span="12" class="mb20">
          <el-form-item label="服务端口" prop="configValue.port">
            <el-input-number v-model="form.configValue.port" placeholder="请输入端口"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="开启SSL" prop="configValue.isSSL">
            <el-radio-group v-model="form.configValue.isSSL">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="mb20">
          <el-form-item label="用户名" prop="configValue.username">
            <el-input v-model="form.configValue.username" placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="密码" prop="configValue.password">
            <el-input v-model="form.configValue.password" placeholder="请输入密码（授权码）"/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" class="mb20">
          <el-form-item label="开启认证" prop="configValue.isAuth">
            <el-radio-group v-model="form.configValue.isAuth">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12" class="mb20">
          <el-form-item label="启用状态" prop="configStatus">
            <el-radio-group v-model="form.configStatus">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24" class="mb20">
          <el-form-item prop="content">
            <template #label>邮件模板
              <tip content="邮件模板 使用 ${key} 占位符，如果模板为空，则直接推送body"/>
            </template>
            <editor v-model:get-html="form.configValue.html" placeholder="请输入HTML内容"/>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button type="primary" @click="onSubmit" :disabled="loading">确认</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SysMessageEmailDialog">
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

// 提交表单数据
const form = reactive({
  configType: 'email',
  id: '',
  configKey: '',
  configName: '',
  configValue: {
    port: 456,
    smtpServer: '',
    username: '',
    password: '' || undefined,
    isSSL: '1',
    isAuth: '1',
    html: '',
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
  'configValue.smtpServer': [
    {required: true, message: 'smtp server 不能为空', trigger: 'blur'}
  ],
  'configValue.port': [
    {required: true, message: '端口不能为空', trigger: 'blur'}
  ],
  'configValue.username': [
    {required: true, message: '用户不能为空', trigger: 'blur'}
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
    if (form.configValue.password?.includes('******')) {
      form.configValue.password = undefined
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
    form.configValue.password = '******' as any
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
