<template>
	<el-drawer title="路由配置" size="50%" v-model="visible">
		<vue-jsoneditor mode="tree" :queryLanguagesIds="queryLanguages" v-model:json="jsonData" v-if="show"/>
		<div class="flex items-center justify-center mt-4">
			<el-button type="primary" @click="submit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
		</div>
	</el-drawer>
</template>

<script lang="ts" name="routeForm" setup>
import type {QueryLanguageId} from 'vue3-ts-jsoneditor';
import VueJsoneditor from 'vue3-ts-jsoneditor';
import {addObj, fetchList} from '/@/api/admin/route';
import {useI18n} from 'vue-i18n';
import {useMessage} from '/@/hooks/message';

const emit = defineEmits(['refresh']);
const { t } = useI18n();
const jsonData = ref({});
const show = ref(false);
const queryLanguages = ref<QueryLanguageId[]>(['javascript']);
const visible = ref(false);
const loading = ref(false);

// 初始化数据
const demoData = reactive({
	routeId: new Date().getTime(),
	routeName: '路由名称',
	predicates: [{ args: { _genkey_0: '/路由前缀/**' }, name: 'Path' }],
	filters: '[]',
	uri: 'lb://服务名称',
	sortOrder: 0,
	metadata: '{}',
});

// 定义一个异步函数 submit
const submit = async () => {
  // 设置 loading 的值为 true
  loading.value = true;
  try {
    // 调用 addObj 方法向服务器发送请求，传入 jsonData 的值
    await addObj(jsonData.value);
    // 调用 useMessage().success 方法，显示成功的提示信息
    useMessage().success(t('common.optSuccessText'));
  } catch (err: any) {
    // 调用 useMessage().error 方法，显示错误的提示信息
    useMessage().error(err.msg);
  } finally {
    // 设置 loading 的值为 false
    loading.value = false;
    // 设置 visible 的值为 false
    visible.value = false;
    // 触发 refresh 事件
    emit('refresh');
  }
};


/**
 * 获取数据
 * @param {string} id - 路径ID
 * @returns {Promise<Array<Object>>} - 返回一个包含对象的数组
 */
const getData = async (id: string) => {
  let response = await fetchList({routeId: id});
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
};

const openDialog = async (id?: string) => {
	visible.value = true;
	if (id) {
		await getData(id).then((data) => {
			jsonData.value = data;
		});
	} else {
    jsonData.value = demoData;
  }
  show.value = true
	return;
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
