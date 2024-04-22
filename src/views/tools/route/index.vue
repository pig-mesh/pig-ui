<template>
  <div class="layout-padding">
    <div class="layout-padding-auto layout-padding-view">
      <el-row>
        <div class="mt-4" style="width: 100%">
          <el-button icon="folder-add" type="primary" class="ml10" @click="routeFormRef.openDialog()">
            {{ $t('common.addBtn') }}
          </el-button>
          <el-button plain icon="Refresh" type="primary" class="ml10" @click="refresh">
            {{ $t('common.refreshCacheBtn') }}
          </el-button>
        </div>
      </el-row>
      <el-scrollbar class="mt-2">
        <div class="flex flex-col">
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div v-for="item in jsonData"
                 class="flex items-start rounded-xl p-4 shadow-lg bg-blue-50 hover:scale-105 hover:shadow-lg relative"
                 @click="routeFormRef.openDialog(item.routeId)">
              <div class="flex h-12 w-12 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
                <svg t="1698042326978" class="icon" viewBox="0 0 1024 1024" version="1.1"
                     xmlns="http://www.w3.org/2000/svg" p-id="5403" width="32" height="32">
                  <path d="M77 403.4v228.5c1.5 93.7 195.7 183.5 435 183.5s433.4-89.8 435-183.5V403.4H77z" fill="#1B9BDB"
                        p-id="5404"></path>
                  <path d="M947 402.7c0 99.4-194.8 194-435 194s-435-94.6-435-194 194.8-180 435-180 435 80.5 435 180z"
                        fill="#3ED6FF" p-id="5405"></path>
                  <path
                      d="M474.1 311.4H503l0.1 63.2h29.5l-0.7-63.2h28.9l-43.7-75.1zM533 417.2h-29.9l0.1 73.9h-30.6l46.2 75.2 45.5-75.2h-30.6zM654.5 380.9l-1.4-30-72.1 45 76.4 45.1-1.4-30h126.2l-2.6-30.1zM381.1 380.9h-125l-2.3 30.1H380l-1.1 30 75.9-45.1-72.5-45z"
                      fill="#FFFFFF" p-id="5406"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h2 class="font-semibold">{{ item.routeName }}</h2>
                <p class="mt-2 text-sm text-gray-500">{{ item.routeId }}</p>
              </div>
              <div class="absolute top-0 right-0 h-12 w-12 flex items-center justify-center"
                   @click.stop="deleteRoute(item.routeId)">
                <el-icon>
                  <Delete/>
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <route-form ref="routeFormRef" @refresh="getData"/>
    </div>
  </div>
</template>

<script lang="ts" name="routeConfig" setup>
import {deleteObj, fetchList, refreshObj} from '/@/api/admin/route';
import type {QueryLanguageId} from 'vue3-ts-jsoneditor';
import {useMessage} from '/@/hooks/message';
import {useI18n} from 'vue-i18n';

const RouteForm = defineAsyncComponent(() => import('./form.vue'));

const {t} = useI18n();
const jsonData = ref({});
const loading = ref(false);
const routeFormRef = ref();
const queryLanguages = ref<QueryLanguageId[]>(['javascript', 'lodash', 'jmespath']);


const refresh = async () => {
  await refreshObj();
  useMessage().success(t('common.optSuccessText'));
}

const deleteRoute = (id: string) => {
  deleteObj(id).then(async res => {
    await refreshObj();
    await getData();
    useMessage().success(t('common.optSuccessText'));
  })
}

const getData = async () => {
  const { data } = await fetchList()

  for (let i = 0; i < data.length; i++) {
    const route = data[i];
    if (route.predicates) {
      const predicates = route.predicates;
      route.predicates = JSON.parse(predicates);
    }
    if (route.filters) {
      const filters = route.filters;
      route.filters = JSON.parse(filters);
    }
  }
  jsonData.value = data;
}

onMounted(() => {
  getData();
});
</script>

<style lang="scss" scoped>
.copy_btn {
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 9;
  color: rgb(255, 255, 255);
}
</style>
