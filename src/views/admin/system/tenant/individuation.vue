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
              <tip content="浏览器底部版权信息、备案信息"/>
            </template>
            <el-input v-model="form.footer" :placeholder="t('individuation.inputFooterAuthorTip')"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mt-4">
          <el-form-item prop="icon" label-width="120px" align="left">
            <template #label>
              {{ t('individuation.miniQr') }}
              <tip content="登录页右下角显示的移动端二维码"/>
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
import {useDict} from '/@/hooks/dict';
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

// 字典
const {status_type} = useDict('status_type');

// 导入配置文件
const stores = useThemeConfig(pinia);
const {themeConfig} = storeToRefs(stores);

// 提交表单数据
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

// 打开弹窗
const openDialog = (id: string): void => {
  visible.value = true;
  form.id = ''


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
 * 初始化表格数据。
 * @param {string} id - 部门 ID。
 */
const getTenantData = async (id: any) => {
  const res = await getObj(id);
  Object.assign(form, res.data);
};


// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
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
