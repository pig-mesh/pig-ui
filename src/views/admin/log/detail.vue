<template>
  <el-drawer v-model="visible" :title="data.title" size="30%">
    <div class="w-full">
      <div class="coding inverse-toggle px-5 pt-4 shadow-lg text-gray-100 text-sm font-mono subpixel-antialiased
              bg-gray-800  pb-6 pt-4 rounded-lg leading-normal overflow-hidden">
        <div class="top mb-2 flex">
          <div class="h-3 w-3 bg-red-500 rounded-full"></div>
          <div class="ml-2 h-3 w-3 bg-orange-300 rounded-full"></div>
          <div class="ml-2 h-3 w-3 bg-green-500 rounded-full"></div>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.createTime') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.createTime }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.createBy') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.createBy }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.requestUri') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.requestUri }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.remoteAddr') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.remoteAddr }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.method') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.method }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.serviceId') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.serviceId }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.time') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.time }}/ms
            <br>
          </p>
        </div>
        <div class="mt-4 flex">
          <span class="text-green-400">{{ $t('syslog.ua') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.userAgent }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex" v-if="data.params">
          <span class="text-green-400">{{ $t('syslog.params') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.params }}
            <br>
          </p>
        </div>
        <div class="mt-4 flex" v-if="data.exception">
          <span class="text-green-400">{{ $t('syslog.exception') }}: </span>
          <p class="flex-1 typing items-center pl-2 whitespace-normal overflow-hidden break-all">
            {{ data.exception }}
            <br>
          </p>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="log-detail">
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
