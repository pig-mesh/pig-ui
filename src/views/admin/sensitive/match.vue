<template>
  <el-dialog title="匹配测试" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="24" class="mb20">
          <el-form-item label="敏感词" prop="sensitiveWord">
            <el-input type="textarea" rows="3" v-model="form.sensitiveWord" placeholder="请输入敏感词"
                      @blur="onSubmit"/>
          </el-form-item>
        </el-col>
        <el-col :span="24" class="mb20">
          <el-form-item prop="result">
            <template #label>
              匹配结果
              <tip content="可点击敏感词加入白名单"/>
            </template>
            <div v-html="matchResult" @click="handleChildClick"/>
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
import {useMessage} from "/@/hooks/message";
import {testObj, addObj, getObj} from '/@/api/admin/sensitive'
import {rule} from '/@/utils/validate';

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
const matchResult = ref('')

// 提交表单数据
const form = reactive({
  sensitiveId: '',
  sensitiveWord: '',
});

// 定义校验规则
const dataRules = ref({
  sensitiveWord: [{validator: rule.overLength, trigger: 'blur'}, {
    required: true,
    message: '敏感词不能为空',
    trigger: 'blur'
  }]
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.sensitiveId = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });
};

const handleChildClick = async (event: any) => {
  try {
    if (event.target.tagName.toLowerCase() === 'a' && event.target.classList.contains('link-error')) {
      const {data} = await getObj({sensitiveWord: event.target.innerText, sensitiveType: '1'})
      if (data) {
        useMessage().error('数据已存在，请勿重新添加');
        return
      }
      await addObj({sensitiveWord: event.target.innerText, sensitiveType: '1'})
      useMessage().success('白名单添加成功');
      emit('refresh');
    }
  } catch (err: any) {
    useMessage().error(err.msg);
  }
}


// 提交
const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {
  });
  if (!valid) return false;

  try {
    loading.value = true;
    const {data} = await testObj(form);
    // 要处理的字符串
    matchResult.value = data;
    // 遍历关键词数组，并进行替换
    matchResult.value = matchResult.value.map((item: string) => {
      let modifiedItem = item;
      data.forEach((word: string) => {
        let regex = new RegExp(word, 'g');
        modifiedItem = modifiedItem.replace(regex, `
<div class="tooltip tooltip-open tooltip-bottom" data-tip="触发敏感词">
  <a class="link link-error" @click="$emit('click-child','${word}')">${word}</a>
</div>
    `);
      });
      return modifiedItem;
    });
    useMessage().success('操作成功');
    emit('refresh');
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};


// 暴露变量
defineExpose({
  openDialog
});
</script>
