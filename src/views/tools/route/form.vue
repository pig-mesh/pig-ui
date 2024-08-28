<template>
  <el-drawer title="路由配置" size="40%" v-model="visible">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基础模式" name="first">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5"/>
          </svg>
          基础模式
        </template>
        <el-form :model="formData" :rules="dataRules" label-width="100px" ref="dataFormRef" v-loading="loading">
          <el-form-item label="路由ID" prop="routeId">
            <el-input clearable v-model="formData.routeId"></el-input>
          </el-form-item>
          <el-form-item label="路由名称" prop="routeName">
            <el-input clearable v-model="formData.routeName"></el-input>
          </el-form-item>
          <el-form-item label="路由前缀" prop="path">
            <template #label>
              路由前缀
              <tip content="访问微服务的公共前缀 "/>
            </template>
            <el-input clearable v-model="formData.path">
              <template #prepend>/</template>
            </el-input>
          </el-form-item>
          <el-form-item label="目标服务" prop="serviceName">
            <template #label>
              目标服务
              <tip content="注册到注册中心对应的服务名称 "/>
            </template>
            <el-input clearable v-model="formData.serviceName"></el-input>
          </el-form-item>
          <el-collapse v-model="collapseActive">
            <el-collapse-item name="1" title="安全属性">
              <template #title>
                <el-icon class="header-icon">
                  <info-filled/>
                </el-icon>
                高级属性
              </template>
              <el-form-item label="允许跨域" prop="cors">
                <el-switch v-model="formData.cors" :active-value="true" :inactive-value="false"></el-switch>
              </el-form-item>
              <el-form-item label="超时时间" prop="timeout">
                <el-input type="number" clearable v-model="formData.timeout">
                  <template #suffix>毫秒</template>
                </el-input>
              </el-form-item>
              <el-form-item label="IP限制" prop="replenishRate">
                <template #label>
                  IP限制
                  <tip content="每个IP每秒最大请求多少次 "/>
                </template>
                <el-input type="number" clearable v-model="formData.replenishRate">
                  <template #suffix>次/秒</template>
                </el-input>
              </el-form-item>
              <el-form-item label="总数限制" prop="timeout">
                <template #label>
                  总数限制
                  <tip content="当前服务器每秒最大的请求数量"/>
                </template>
                <el-input type="number" :min="1000" clearable v-model="formData.burstCapacity">
                  <template #suffix>次/秒</template>
                </el-input>
              </el-form-item>
              <el-form-item label="优先级" prop="sortOrder">
                <el-input type="number" clearable v-model="formData.sortOrder"></el-input>
              </el-form-item>
            </el-collapse-item>
          </el-collapse>

        </el-form>
      </el-tab-pane>
      <el-tab-pane label="编码模式" name="second">
        <template #label>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" class="size-4">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"/>
          </svg>
          编码模式
        </template>
        <json-editor
            ref="jsonEditorRef"
            v-model="jsonData"
            codec
            @change="handleJsonChange"
        />
      </el-tab-pane>
    </el-tabs>
    <div class="flex items-center justify-center mt-4">
      <el-button type="primary" @click="submit" :disabled="loading">{{ $t('common.confirmButtonText') }}</el-button>
    </div>
  </el-drawer>
</template>

<script lang="ts" name="routeForm" setup>
// @ts-ignore
import JsonEditor from '@axolo/json-editor-vue'

import {addObj, fetchList, validateExist} from '/@/api/admin/route';
import {useI18n} from 'vue-i18n';
import {useMessage} from '/@/hooks/message';
import {rule} from "/@/utils/validate";
import Tip from "/@/components/Tip/index.vue";

const emit = defineEmits(['refresh']);
const {t} = useI18n();
const activeName = ref('first')
const visible = ref(false);
const loading = ref(false);
const jsonData = ref({});
const dataFormRef = ref();
const collapseActive = ref('1');

const formData = ref({
  routeId: '',
  routeName: '',
  path: '',
  sortOrder: 0,
  serviceName: '',
  timeout: 30000,
  burstCapacity: 100000,
  replenishRate: 10000,
  cors: false,
});
// 初始化数据
const demoData = reactive({
  routeId: new Date().getTime(),
  routeName: '路由名称',
  predicates: [{args: {_genkey_0: '/路由前缀/**'}, name: 'Path'}],
  filters: [],
  uri: 'lb://服务名称',
  sortOrder: 0,
  metadata: {},
});

// 定义校验规则
const dataRules = ref({
  routeId: [
    {required: true, message: '路由标识不能为空', trigger: 'blur'},
    {
      validator: (rule: any, value: any, callback: any) => {
        validateExist(rule, value, callback, selectRouteId.value);
      },
      trigger: 'blur',
    },
    {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'},
  ],
  routeName: [
    {required: true, message: '路由名称不能为空', trigger: 'blur'},
    {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'},
  ],
  path: [
    {required: true, message: '路由前缀不能为空', trigger: 'blur'},
    {validator: rule.validatorLower, trigger: 'blur'},
    {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'},
  ],
  serviceName: [
    {required: true, message: '目标服务不能为空', trigger: 'blur'},
    {min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur'},
  ],
  sortOrder: [
    {required: true, message: '排序值不能为空', trigger: 'blur'}
  ],
});

// 监听 formData 的变化并同步更新 jsonData
watch(formData, (val) => {
  jsonData.value = {
    routeId: val.routeId,
    routeName: val.routeName,
    sortOrder: val.sortOrder,
    predicates: [{args: {_genkey_0: `/${val.path}/**`}, name: 'Path'}],
    uri: `lb://${val.serviceName}`,
    metadata: {
      "response-timeout": val.timeout,
      ...(val.cors ? {
        cors: {
          "allowedOrigins": "*",
          "allowedMethods": "*",
          "allowedHeaders": "*",
          "allowedCredentials": true
        }
      } : {})
    },
    filters: [
      {
        "name": "RequestRateLimiter", "args": {
          "redis-rate-limiter.replenishRate": val.replenishRate
          , "redis-rate-limiter.burstCapacity": val.burstCapacity
          , "key-resolver": "#{@remoteAddrKeyResolver}"
        }
      }
    ]
  };
}, {deep: true});

/**
 * 处理 json 数据变化
 * @param val
 */
const handleJsonChange = (val: any) => {
  formData.value.routeId = val.routeId;
  formData.value.routeName = val.routeName;
  formData.value.sortOrder = val.sortOrder;
  // 提取 属性为 name:path 的 path 字段
  val.predicates.forEach((item: any) => {
    if (item.name === 'Path') {
      // 提取 path 字段 /路由前缀/**  只需要路由前缀 不带/
      formData.value.path = item.args._genkey_0.replace('/**', '').replace('/', '');
    }
  });

  formData.value.serviceName = val.uri.replace('lb://', '');
  // 提出 filters 中的数据 给 formData replenishRate burstCapacity 赋值
  val.filters.forEach((item: any) => {
    if (item.name === 'RequestRateLimiter') {
      formData.value.replenishRate = item.args['redis-rate-limiter.replenishRate'];
      formData.value.burstCapacity = item.args['redis-rate-limiter.burstCapacity'];
    }
  });

  // 提取metadata中的timeout字段
  formData.value.timeout = val.metadata['response-timeout'];

  // 检查 metadata 中是否有 cors 配置，并设置 formData.cors
  formData.value.cors = !!val.metadata['cors'];

  jsonData.value = val;
}

/**
 * 校验 json 数据
 * @param data
 */
const validateJsonData = (data: any): boolean => {

  if (!data.predicates || !Array.isArray(data.predicates) || data.predicates.length === 0) {
    useMessage().error('路由前缀配置不合法');
    return false;
  }

  // 检查是否存在 name 为 'Path' 的 predicate
  const pathPredicate = data.predicates.find((p: any) => p.name === 'Path');
  if (!pathPredicate) {
    useMessage().error('路由配置中必须包含 Path 规则');
    return false;
  }

  if (!data.uri || typeof data.uri !== 'string' || !data.uri.startsWith('lb://')) {
    useMessage().error('目标服务不合法');
    return false;
  }
  // redis-rate-limiter.burstCapacity 不能小于 1000
  if (data.filters && Array.isArray(data.filters)) {
    const rateLimiter = data.filters.find((f: any) => f.name === 'RequestRateLimiter');
    if (rateLimiter) {
      if (rateLimiter.args['redis-rate-limiter.burstCapacity'] < 1000) {
        useMessage().error('总数限制不能小于1000');
        return false;
      }
    }
  }
  return true;
};

const submit = async () => {
  // 设置 loading 的值为 true
  loading.value = true;
  try {
    const valid = await dataFormRef.value.validate().catch(() => {
    });
    if (!valid) return false;


    // 添加对 jsonData 的校验
    if (!validateJsonData(jsonData.value)) {
      loading.value = false;
      return false;
    }

    // 调用 addObj 方法向服务器发送请求，传入 jsonData 的值
    await addObj(jsonData.value);
    // 调用 useMessage().success 方法，显示成功的提示信息
    useMessage().success(t('common.optSuccessText'));
    // 设置 visible 的值为 false
    visible.value = false;
  } catch (err: any) {
    // 调用 useMessage().error 方法，显示错误的提示信息
    useMessage().error(err.msg);
  } finally {
    // 设置 loading 的值为 false
    loading.value = false;
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
  // 获取数据
  const response = await fetchList({routeId: id});
  const result = response.data[0];

  // 解析 predicates 字段
  if (result.predicates) {
    result.predicates = JSON.parse(result.predicates);
  }

  // 解析 filters 字段
  if (result.filters) {
    result.filters = JSON.parse(result.filters);
  }

  // 解析 metadata 字段
  if (result.metadata) {
    result.metadata = JSON.parse(result.metadata);
  }

  return result;
};

const selectRouteId = ref()

const openDialog = async (id?: string) => {
  selectRouteId.value = id;
  visible.value = true;
  // 重置表单数据
  nextTick(() => {
    dataFormRef.value?.resetFields();
  });

  if (id) {
    await getData(id).then((data) => {
      jsonData.value = data;
      // parse data to formData
      handleJsonChange(data);
    });
  } else {
    jsonData.value = demoData;
  }
  return;
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
