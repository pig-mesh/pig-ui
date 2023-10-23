<template>
  <el-drawer title="路由配置" size="50%" v-model="visible">
    <vue-jsoneditor mode="tree" :queryLanguagesIds="queryLanguages" v-model:json="jsonData"/>
    <div class="flex justify-center items-center mt-4">
      <el-button type="primary" @click="submit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
    </div>
  </el-drawer>
</template>

<script lang="ts" name="routeForm" setup>
import type {QueryLanguageId} from 'vue3-ts-jsoneditor';
import VueJsoneditor from 'vue3-ts-jsoneditor';
import {addObj, fetchList} from '/@/api/admin/route';
import {useI18n} from 'vue-i18n';
import {useMessage} from "/@/hooks/message";

const emit = defineEmits(['refresh']);
const {t} = useI18n();
const jsonData = ref({});
const show = ref(false);
const queryLanguages = ref<QueryLanguageId[]>(['javascript']);
const visible = ref(false);
const loading = ref(false);

// 初始化数据
const demoData = reactive({
  "routeId": new Date().getTime(),
  "routeName": "路由名称",
  "predicates": [{"args": {"_genkey_0": "/路由前缀/**"}, "name": "Path"}],
  "filters": "[]",
  "uri": "lb://服务名称",
  "sortOrder": 0,
  "metadata": "{}",
})

const submit = async () => {
  loading.value = true;
  try {
    await addObj(jsonData.value);
    useMessage().success(t('common.optSuccessText'));
  } catch (err: any) {
    useMessage().error(err.msg);
  } finally {
    loading.value = false;
    visible.value = false;
    emit('refresh')
  }
};

const getData = (id: string) => {
  return fetchList({routeId: id}).then((response) => {
    const result = response.data[0];
    for (let i = 0; i < result.length; i++) {
      const route = result[i];
      if (route.predicates) {
        const predicates = route.predicates;
        route.predicates = JSON.parse(predicates);
      }
      if (route.filters) {
        const filters = route.filters;
        route.filters = JSON.parse(filters);
      }
    }

    return result;
  })
}


const openDialog = async (id: string) => {
  jsonData.value = demoData
  visible.value = true;
  return
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
