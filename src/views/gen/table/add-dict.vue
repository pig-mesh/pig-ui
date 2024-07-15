<template>
  <el-dialog title="新增字典" v-model="visible" width="600">
    <el-form :model="dataForm" :rules="dataRules" label-width="100px" ref="dicDialogFormRef" v-loading="loading">
      <el-form-item :label="$t('sysdict.systemFlag')" prop="systemFlag">
        <el-radio-group v-model="dataForm.systemFlag">
          <el-radio border :key="index" :label="item.value" v-for="(item, index) in dict_type">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('sysdict.dictType')" prop="dictType">
        <el-input :placeholder="$t('sysdict.inputDictTypeTip')" :disabled="dataForm.id !== ''" clearable
                  v-model="dataForm.dictType"></el-input>
      </el-form-item>
      <el-form-item :label="$t('sysdict.description')" prop="description">
        <el-input :placeholder="$t('sysdict.inputDescriptionTip')" clearable v-model="dataForm.description"></el-input>
      </el-form-item>
      <el-col :span="24" class="mb20">
        <el-form-item :label="t('dictItem.name')" prop="columns">
          <el-table :data="dataForm.columns" border style="width: 100%" max-height="500">
            <el-table-column type="index" :label="t('createTable.index')" width="50">
              <template #header>
                <el-button icon="Plus" size="small" type="primary" circle @click="onAddItem"></el-button>
              </template>
              <template #default="scope">
                <el-button icon="Minus" size="small" type="danger" circle
                           @click="handleDelete(scope.$index, scope.row)"></el-button>
              </template>
            </el-table-column>
            <el-table-column prop="label" :label="$t('dictItem.label')" show-overflow-tooltip>
              <template #default="scope">
                <el-input v-model="scope.row.label" :placeholder="t('dictItem.inputLabelTip')"/>
              </template>
            </el-table-column>
            <el-table-column prop="value" :label="$t('dictItem.itemValue')" show-overflow-tooltip>
              <template #default="scope">
                <el-input v-model="scope.row.value" :placeholder="t('dictItem.inputItemValueTip')"/>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-col>


    </el-form>
    <template #footer>
			<span class="dialog-footer">
				<el-button @click="visible = false">{{ $t('common.cancelButtonText') }}</el-button>
				<el-button @click="onSubmit" type="primary" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
			</span>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="systemDicDialog" setup>
import {useI18n} from 'vue-i18n';
import {addItemObj, addObj, getObj, validateDictType} from '/@/api/admin/dict';
import {useDict} from '/@/hooks/dict';
import {useMessage} from '/@/hooks/message';
import {rule} from '/@/utils/validate';

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
const {dict_type} = useDict('dict_type');
const {t} = useI18n();
// 定义变量内容
const dicDialogFormRef = ref();

const visible = ref(false);
const loading = ref(false);
const selectRow = ref({});
const dataForm = reactive({
  id: '',
  dictType: '',
  description: '',
  systemFlag: '0',
  remarks: '',
  columns: [] as any
});

const dataRules = reactive({
  dictType: [
    {validator: rule.overLength, trigger: 'blur'},
    {required: true, message: '类型不能为空', trigger: 'blur'},
    {validator: rule.validatorNameCn, trigger: 'blur'},
    {
      validator: (rule: any, value: any, callback: any) => {
        validateDictType(rule, value, callback, dataForm.id !== '');
      },
      trigger: 'blur',
    },
  ],
  systemFlag: [{required: true, message: '字典类型不能为空', trigger: 'blur'}],
  description: [{validator: rule.overLength, trigger: 'blur'}, {
    required: true,
    message: '描述不能为空',
    trigger: 'blur'
  }],
  columns: [{required: true, message: '字典项不能为空', trigger: 'blur'}],
});

// 打开弹窗
const openDialog = () => {
  visible.value = true;
  dataForm.id = '';
  nextTick(() => {
    dicDialogFormRef.value?.resetFields();
  });
};

// 提交
const onSubmit = async () => {
  const valid = await dicDialogFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    // 添加字典
    const {data} = await addObj(dataForm);
    // addItemObj

    dataForm.columns.forEach(async (item: any) => {
      item.dictId = data.id;
      item.dictType = dataForm.dictType;
      await addItemObj(item);
    });
    useMessage().success(t('common.addSuccessText'));
    visible.value = false;
    emit('refresh', dataForm.dictType);
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

let index = 1;
const onAddItem = () => {
  dataForm.columns.push({sortOrder: `${index++}`});
}

const handleDelete = (index: number, row: any) => {
  dataForm.columns.splice(index, 1)
}

// 暴露变量
defineExpose({
  openDialog,
});
</script>
