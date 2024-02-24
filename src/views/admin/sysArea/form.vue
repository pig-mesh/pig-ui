<template>
  <el-dialog :title="form.id ? $t('common.editBtn') : $t('common.addBtn')" v-model="visible"
             :close-on-click-modal="false" draggable width="600">
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row>
        <el-col :span="24" class="mb20" v-if="!form.id">
          <el-form-item :label="t('area.pid')" prop="pid">
            <china-area class="w-full" :placeholder="t('area.inputPidByTip')" :plus="true" @change="handleChange"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.name')" prop="name">
            <el-input v-model="form.name" :placeholder="t('area.inputNameByTip')"/>
          </el-form-item>
        </el-col>


        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.adcode')" prop="adcode">
            <el-input-number v-model="form.adcode" :placeholder="t('area.inputAdCodeByTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.areaType')" prop="areaType">
            <el-select v-model="form.areaType">
              <el-option :key="item.value" :label="item.label" :value="item.value"
                         v-for="item in area_type_dict"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.areaSort')" prop="areaSort">
            <el-input-number v-model="form.areaSort" :placeholder="t('area.inputAreaSortByTip')"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.hot')" prop="hot">
            <el-radio-group v-model="form.hot">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item :label="t('area.areaStatus')" prop="areaStatus">
            <el-radio-group v-model="form.areaStatus">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
          <el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SysAreaDialog">
import {useMessage} from "/@/hooks/message";
import {getObj, addObj, putObj, validateAdCode} from '/@/api/admin/sysArea'
import {useDict} from "/@/hooks/dict";
import {useI18n} from "vue-i18n";

const ChinaArea = defineAsyncComponent(() => import("/@/components/ChinaArea/index.vue"));
const emit = defineEmits(['refresh']);
const { t } = useI18n();

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典
const {yes_no_type} = useDict('yes_no_type')
const area_type_dict = [
  {value: '0', label: '国家'},
  {value: '1', label: '省份'},
  {value: '2', label: '城市'},
  {value: '3', label: '县区'},
  {value: '4', label: '街道'}
]

// 提交表单数据
const form = reactive({
  id: '',
  pid: 100000,
  name: '',
  letter: '',
  adcode: 0,
  location: '',
  areaSort: 0,
  areaStatus: '1',
  areaType: '2',
  hot: '0',
  cityCode: '',
});

// 定义校验规则
const dataRules = ref({
  name: [
    {required: true, message: '地区名称不能为空', trigger: 'blur'},
    {min: 2, max: 20, message: '长度在 3 到 30 个字符', trigger: 'blur'}
  ],
  adcode: [
    {required: true, message: '编码不能为空', trigger: 'blur'},
    {
      validator: (rule: any, value: any, callback: any) => {
        validateAdCode(rule, value, callback, form.id !== '');
      },
      trigger: 'blur',
    },
  ]
});

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysArea信息
  if (id) {
    form.id = id
    getsysAreaData(id)
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
    useMessage().success(form.id ? t('common.editSuccessText') : t('common.addSuccessText'));
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};


// 初始化表单数据
const getsysAreaData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj({id: id}).then((res: any) => {
    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// 地区选择
const handleChange = (data: string) => {
  let dataArray = data.split(",");
  form.pid = dataArray[dataArray.length - 1];
}

// 暴露变量
defineExpose({
  openDialog
});
</script>
