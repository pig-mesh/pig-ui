<template>
  <el-dialog :title="form.id ? '编辑' : '新增'" v-model="visible"
             :close-on-click-modal="false" draggable>
    <el-form ref="dataFormRef" :model="form" :rules="dataRules" formDialogRef label-width="90px" v-loading="loading">
      <el-row :gutter="24">
        <el-col :span="12" class="mb20">
          <el-form-item label="分类" prop="category">
            <el-radio-group v-model="form.category">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in message_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="全部通知" prop="allFlag">
            <el-radio-group v-model="form.allFlag">
              <el-radio :key="index" :label="item.value" border v-for="(item, index) in yes_no_type">{{
                  item.label
                }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20">
          <el-form-item prop="sort">
            <template #label>排序
              <tip content="越大越在前"/>
            </template>
            <el-input-number v-model="form.sort" placeholder="请输入排序 （越大越在前）"/>
          </el-form-item>
        </el-col>

        <el-col :span="12" class="mb20" v-if="form.allFlag !== '1'" >
          <el-form-item prop="allFlag">
            <template #label>范围
              <tip content="不选群发全部"/>
            </template>
            <!-- 组织架构   -->
            <org-selector v-model:orgList="form.userList" type="user" :multiple="true" />
          </el-form-item>
        </el-col>

        <el-col :span="24" class="mb20">
          <el-form-item label="内容" prop="content">
            <editor v-if="visible" v-model:get-html="form.content" placeholder="请输入内容"></editor>
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

<script setup lang="ts" name="SysMessageDialog">
import orgSelector from '/@/components/OrgSelector/index.vue';
import {useDict} from '/@/hooks/dict';
import {useMessage} from "/@/hooks/message";
import {addObj, getObj, putObj} from '/@/api/admin/message'

const emit = defineEmits(['refresh']);

// 定义变量内容
const dataFormRef = ref();
const visible = ref(false)
const loading = ref(false)
// 定义字典
const {yes_no_type,message_type} = useDict('yes_no_type','message_type')
// 提交表单数据
const form = reactive({
  id: '',
  category: '0',
  title: '',
  content: '',
  allFlag: '0',
  sort: 0,
  userList:[] as any,
});

// 定义校验规则
const dataRules = ref({
  category: [{required: true, message: '分类不能为空', trigger: 'blur'}],
  title: [{required: true, message: '标题不能为空', trigger: 'blur'}],
  content: [{required: true, message: '内容不能为空', trigger: 'blur'}],
  allFlag: [{required: true, message: '实时通知（0否，1是）不能为空', trigger: 'blur'}],
  sort: [{required: true, message: '排序 （越大越在前）不能为空', trigger: 'blur'}],
})

// 打开弹窗
const openDialog = (id: string) => {
  visible.value = true
  form.id = ''
  form.content = ''

  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  // 获取sysMessage信息
  if (id) {
    form.id = id
    getsysMessageData(id)
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
const getsysMessageData = (id: string) => {
  // 获取数据
  loading.value = true
  getObj(id).then((res: any) => {
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
