<template>
  <div class="layout-padding-auto layout-padding-view">
    <el-card shadow="never">
      <el-form ref="dataFormRef" class="form" :model="form" label-width="85px" :rules="dataRules">
        <div class="flex">
          <div>
            <el-form-item label="文章标题" prop="title">
              <div class="w-80">
                <el-input
                    v-model="form.title"
                    placeholder="请输入文章标题"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 3 }"
                    maxlength="64"
                    show-word-limit
                    clearable
                />
              </div>
            </el-form-item>
            <el-form-item label="文章简介" prop="intro">
              <div class="w-80">
                <el-input
                    v-model="form.intro"
                    placeholder="请输入文章简介"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 6 }"
                    :maxlength="200"
                    show-word-limit
                    clearable
                />
              </div>
            </el-form-item>
            <el-form-item label="摘要" prop="summary">
              <div class="w-80">
                <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 6 }" v-model="form.summary" maxlength="200"
                          show-word-limit clearable/>
              </div>
            </el-form-item>
            <el-form-item label="文章封面" prop="image">
              <div>
                <div>
                  <upload-img v-model:imageUrl="form.image"/>
                </div>
                <div class="form-tips">建议尺寸：240*180px</div>
              </div>
            </el-form-item>
          </div>
          <div class="xl:ml-20">
            <el-row class="xl:mb-8">
              <el-col :span="12">
                <el-form-item label="文章栏目" prop="cid">
                  <el-select class="w-80" v-model="form.cid" placeholder="请选择文章栏目" clearable>
                    <el-option v-for="item in articleCateList" :key="item.id" :label="item.name" :value="item.id"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="作者" prop="author">
                  <div class="w-80">
                    <el-input v-model="form.author" placeholder="请输入作者名称"/>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="xl:mb-8">
              <el-col :span="12">
                <el-form-item label="初始浏览量" prop="visit">
                  <template #label> 浏览量
                    <tip content="初始值"/>
                  </template>
                  <el-input-number class="!w-80" v-model="form.visit" :min="0" :max="9999"/>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="sort">
                  <template #label> 排序
                    <tip content="默认为0， 数值越大越排前"/>
                  </template>
                  <el-input-number class="!w-80" v-model="form.sort" :min="0" :max="9999"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="文章内容" required prop="content">
              <editor v-model:get-html="form.content" height="500" width="600" :disable="form.id !== ''"/>
            </el-form-item>
            <div style="text-align: center">
              <el-button type="primary" @click="onSubmit">保存</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="AppArticleDialog">
import mittBus from '/@/utils/mitt';
import { useMessage } from '/@/hooks/message';
import { getObj, addObj, putObj } from '/@/api/app/appArticle';
import { getObjList } from '/@/api/app/appArticleCategory';

const route = useRoute();
const dataFormRef = ref();
const loading = ref(false);
const articleCateList = ref([]);

const form = reactive({
  id: '',
  cid: '',
  title: '',
  intro: '',
  summary: '',
  image: '',
  content: '',
  author: '',
  visit: 0,
  sort: 0,
});

const dataRules = ref({
  cid: [{ required: true, message: '分类不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  intro: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
  summary: [{ required: true, message: '摘要不能为空', trigger: 'blur' }],
  image: [{ required: true, message: '封面不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
  author: [{ required: true, message: '作者不能为空', trigger: 'blur' }],
  visit: [{ required: true, message: '浏览不能为空', trigger: 'blur' }],
});

const onSubmit = async () => {
  const valid = await dataFormRef.value.validate().catch(() => {});
  if (!valid) return false;

  try {
    loading.value = true;
    form.id ? await putObj(form) : await addObj(form);
    useMessage().success(form.id ? '修改成功' : '添加成功');
    mittBus.emit('onCurrentContextmenuClick', { contextMenuClickId: 1, ...route });
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
  }
};

const getAppArticleData = (id: string) => {
  loading.value = true;
  getObj(id)
    .then((res: any) => {
      Object.assign(form, res.data);
    })
    .finally(() => {
      loading.value = false;
    });
};

const getAppCateList = () => {
  getObjList().then((res: any) => {
    articleCateList.value = res.data;
  });
};

onMounted(() => {
  getAppCateList();
  if (route.query?.id) {
    getAppArticleData(route.query.id as string);
  }
});
</script>
