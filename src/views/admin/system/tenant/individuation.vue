<template>
  <el-drawer :title="$t('tenant.individuationBtn')" v-model="visible" :close-on-click-modal="false">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" v-loading="loading">
      <el-row>
        <el-col :span="24" class="mt-4">
          <el-form-item :label="t('individuation.websiteName')" prop="websiteName" label-width="120px" align="left">
            <el-input v-model="form.websiteName" :placeholder="t('individuation.inputIndividuationNameTip')"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mt-4">
          <el-form-item prop="footerAuthor" label-width="120px" align="left">
            <template #label>
              {{ t('individuation.footerAuthor') }}
              <tip :content="t('individuation.footerTip')"/>
            </template>
            <el-input v-model="form.footer" :placeholder="t('individuation.inputFooterAuthorTip')"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mt-4">
          <el-form-item prop="icon" label-width="120px" align="left">
            <template #label>
              {{ t('individuation.miniQr') }}
              <tip :content="t('individuation.miniQrTip')"/>
            </template>
            <upload-img v-model:image-url="form.miniQr"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mt-4">
          <el-form-item :label="t('individuation.background')" prop="background" label-width="120px" align="left">
            <upload-img v-model:image-url="form.background"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button type="primary" @click="onSubmit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="systemTenantDialog">
import {useMessage} from '/@/hooks/message';
import {getObj, putObj} from '/@/api/admin/tenant';
import {useI18n} from 'vue-i18n';
import UploadImg from "/@/components/Upload/Image.vue";
import {useThemeConfig} from "/@/stores/themeConfig";
import pinia from "/@/stores";
import {storeToRefs} from "pinia";
import Tip from "/@/components/Tip/index.vue";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const {t} = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false);
const loading = ref(false);

// 导入配置文件
const stores = useThemeConfig(pinia);
const {themeConfig} = storeToRefs(stores);

/**
 * 租户个性化配置表单
 * @property {string} id - 租户ID
 * @property {string} websiteName - 网站名称
 * @property {string} background - 登录背景图URL
 * @property {string} miniQr - 小程序二维码URL
 * @property {string} footer - 页脚版权信息
 */
const form = reactive({
  id: '',
  websiteName: themeConfig.value.globalTitle,
  background: '',
  miniQr: '',
  footer: themeConfig.value.footerAuthor,
});


// 定义校验规则
const dataRules = ref({
});

/**
 * 打开个性化设置对话框
 * @param {string} id - 租户 ID
 */
const openDialog = (id: string): void => {
  visible.value = true;
  form.id = '';

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  if (id) {
    form.id = id;
    getTenantData(id);
  }
};

/**
 * 获取租户个性化配置数据
 * @param {string} id - 租户 ID
 */
const getTenantData = async (id: string) => {
  try {
    const { data } = await getObj(id);
    Object.assign(form, data);
  } catch (err: any) {
    useMessage().error(err.msg);
  }
};

/**
 * 提交个性化配置
 */
const onSubmit = async () => {
  // 防止重复提交
  if (loading.value) return;

  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) return false;

  try {
    loading.value = true;
    await putObj(form);
    useMessage().success(t('common.editSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};


// 暴露变量
defineExpose({
  openDialog,
});
</script>
