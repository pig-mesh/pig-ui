<template>
  <el-dialog :title="form.sensitiveId ? '编辑' : '新增'" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item label="敏感词" prop="sensitiveWord">
            <el-input v-model="form.sensitiveWord" placeholder="请输入敏感词"/>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="类型" prop="sensitiveType">
            <el-radio-group v-model="form.sensitiveType">
              <el-radio :label="item.value" v-for="(item, index) in sensitive_type" border :key="index">{{ item.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" placeholder="请输入备注"/>
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

<script setup lang="ts" name="SysSensitiveWordDialog">
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {getObj, addObj, putObj, validateWord} from '/@/api/admin/sensitive'
import {rule} from '/@/utils/validate';

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典
const {sensitive_type} = useDict('sensitive_type')

// 提交表单数据
const form = reactive({
  sensitiveId: '',
  sensitiveWord: '',
  sensitiveType: '0',
  remark: '',
});

// 定义校验规则
const dataRules = ref({
  sensitiveWord: [{validator: rule.overLength, trigger: 'blur'}
    , {
      validator: (rule: any, value: any, callback: any) => {
        validateWord(rule, value, callback, form.sensitiveId !== '');
      }
      , trigger: 'blur'
    }
    , {
      required: true,
      message: '敏感词不能为空',
      trigger: 'blur'
    }],
  sensitiveType: [{required: true, message: '类型不能为空', trigger: 'blur'}],
  remark: [{validator: rule.overLength, trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (sensitiveId: string) => {
  visible.value = true
  form.sensitiveId = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysSensitiveWord信息
  if (sensitiveId) {
    form.sensitiveId = sensitiveId
    getsysSensitiveWordData(sensitiveId)
  }
};

// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    form.sensitiveId ? await putObj(form) : await addObj(form);
    useMessage().success(form.sensitiveId ? '修改成功' : '添加成功');
    visible.value = false;
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};


// 初始化表单数据
const getsysSensitiveWordData = (sensitiveId: string) => {
  // 获取数据
  loading.value = true
  getObj({sensitiveId}).then((res: any) => {

    Object.assign(form, res.data)
  }).finally(() => {
    loading.value = false
  })
};

// 暴露变量
defineExpose({
  openDialog
});
</script>
