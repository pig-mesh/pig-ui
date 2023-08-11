<template>
  <el-drawer v-model="visible" title="日志详情" size="50%">
    <el-descriptions :column="1">
      <el-descriptions-item :label="$t('syslog.createTime')">{{ data.createTime }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.createBy')">{{ data.createBy }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.requestUri')">{{ data.requestUri }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.title')">{{ data.title }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.remoteAddr')">{{ data.remoteAddr }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.method')">{{ data.method }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.ua')">{{ data.userAgent }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.serviceId')">{{ data.serviceId }}</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.time')">{{ data.time }}/ms</el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.params')" v-if="data.params">
        <code-editor v-model="data.params" theme="darcula" height="100" mode="go"></code-editor>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('syslog.exception')" v-if="data.exception">
        <code-editor v-model="data.exception" theme="darcula" height="200" mode="go"></code-editor>
      </el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script setup lang="ts" name="log-detail">
const CodeEditor = defineAsyncComponent(() => import('/@/components/CodeEditor/index.vue'));

const visible = ref(false);

const data = reactive({} as any);

const openDialog = (row: any) => {
  visible.value = true;
  Object.assign(data, row);
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
