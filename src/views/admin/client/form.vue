<template>
  <el-dialog :close-on-click-modal="false" :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" width="600"
             draggable v-model="visible">
    <el-form :model="form" :rules="dataRules" formDialogRef label-width="120px" ref="dataFormRef" v-loading="loading">
      <el-form-item :label="t('client.clientId')" prop="clientId">
        <el-input :placeholder="t('client.inputClientIdTip')" v-model="form.clientId"/>
      </el-form-item>
      <el-form-item :label="t('client.clientSecret')" prop="clientSecret">
        <el-input :placeholder="t('client.inputClientSecretTip')" v-model="form.clientSecret"/>
      </el-form-item>
      <el-form-item :label="t('client.scope')" prop="scope">
        <el-input :placeholder="t('client.inputScopeTip')" v-model="form.scope"/>
      </el-form-item>
      <el-form-item :label="t('client.authorizedGrantTypes')" prop="authorizedGrantTypes">
        <el-select collapse-tags collapse-tags-tooltip multiple v-model="form.authorizedGrantTypes">
          <el-option :key="index" :label="item.label" :value="item.value"
                     v-for="(item, index) in grant_types"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="t('client.accessTokenValidity')" prop="accessTokenValidity">
        <el-input-number :placeholder="t('client.inputAccessTokenValidityTip')" v-model="form.accessTokenValidity"/>
      </el-form-item>
      <el-form-item :label="t('client.refreshTokenValidity')" prop="refreshTokenValidity">
        <el-input-number :placeholder="t('client.inputRefreshTokenValidityTip')" v-model="form.refreshTokenValidity"/>
      </el-form-item>
      <el-form-item :label="t('client.autoapprove')" prop="autoapprove"
                    v-if="form.authorizedGrantTypes.includes('authorization_code')">
        <el-radio-group v-model="form.autoapprove">
          <el-radio :key="index" :value="item.value" border v-for="(item, index) in common_status">{{
              item.label
            }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="t('client.authorities')" prop="authorities"
                    v-if="form.authorizedGrantTypes.includes('authorization_code')">
        <el-input :placeholder="t('client.inputAuthoritiesTip')" v-model="form.authorities"/>
      </el-form-item>

      <el-form-item :label="t('client.webServerRedirectUri')" prop="webServerRedirectUri"
                    v-if="form.authorizedGrantTypes.includes('authorization_code')">
        <el-input :placeholder="t('client.inputWebServerRedirectUriTip')" v-model="form.webServerRedirectUri"/>
      </el-form-item>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="SysOauthClientDetailsDialog" setup>
import {useDict} from '/@/hooks/dict';
import {useMessage} from '/@/hooks/message';
import {addObj, getObj, putObj, validateclientId} from '/@/api/admin/client';
import {useI18n} from 'vue-i18n';
import {rule} from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const {t} = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 定义字典
const {grant_types, common_status} = useDict(
    'grant_types',
    'common_status',
);

// 提交表单数据
const form = reactive({
  id: '',
  clientId: '',
  clientSecret: '',
  scope: 'server',
  authorizedGrantTypes: [] as string[],
  webServerRedirectUri: '',
  authorities: '',
  accessTokenValidity: 43200,
  refreshTokenValidity: 2592001,
  autoapprove: 'true',
  delFlag: '',
  createBy: '',
  updateBy: '',
  createTime: '',
  updateTime: '',
  tenantId: '',
  onlineQuantity: '1',
  captchaFlag: '1',
  encFlag: '1',
});

// 定义校验规则
const dataRules = ref({
  clientId: [
    {validator: rule.overLength, trigger: 'blur'},
    {required: true, message: '编号不能为空', trigger: 'blur'},
    {validator: rule.validatorLowercase, trigger: 'blur'},
    {
      validator: (rule: any, value: any, callback: any) => {
        validateclientId(rule, value, callback, form.id !== '');
      },
      trigger: 'blur',
    },
  ],
  clientSecret: [
    {validator: rule.overLength, trigger: 'blur'},
    {required: true, message: '密钥不能为空', trigger: 'blur'},
    {validator: rule.validatorLower, trigger: 'blur'},
  ],
  scope: [{validator: rule.overLength, trigger: 'blur'},{required: true, message: '域不能为空', trigger: 'blur'}],
  authorizedGrantTypes: [{required: true, message: '授权模式不能为空', trigger: 'blur'}],
  accessTokenValidity: [
    {validator: rule.overLength, trigger: 'blur'},
    {required: true, message: '令牌时效不能为空', trigger: 'blur'},
    {type: 'number', min: 1, message: '令牌时效不能小于一小时', trigger: 'blur'},
  ],
  refreshTokenValidity: [
    {validator: rule.overLength, trigger: 'blur'},
    {required: true, message: '刷新时效不能为空', trigger: 'blur'},
    {type: 'number', min: 1, message: '刷新时效不能小于两小时', trigger: 'blur'},
  ],
  autoapprove: [{required: true, message: '自动放行不能为空', trigger: 'blur'}],
  webServerRedirectUri: [{validator: rule.overLength, trigger: 'blur'},{required: true, message: '回调地址不能为空', trigger: 'blur'}],
  authorities: [{validator: rule.overLength, trigger: 'blur'}],
});

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true;
  form.id = '';
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysOauthClientDetails信息
  if (id) {
    form.id = id;
    getsysOauthClientDetailsData(id);
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    form.id ? await putObj(form) : await addObj(form);
    useMessage().success(t(form.id ? 'common.editSuccessText' : 'common.addSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

// 初始化表单数据
const getsysOauthClientDetailsData = (id: string) => {
  // 获取数据
  getObj(id).then((res: any) => {
    Object.assign(form, res.data);
  });
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
