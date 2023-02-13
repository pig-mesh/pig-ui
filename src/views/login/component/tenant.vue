<template>
  <div>
    <el-select
        v-model="tenant"
        style="width: 100%"
        placeholder="点击请选择租户"
        @change="handleCommand"
    >
      <el-option
          v-for="tenant in tenantList"
          :key="tenant.id"
          :label="tenant.name"
          :value="tenant.id"
      ></el-option>
    </el-select>
  </div>
</template>

<script setup lang="ts" name="register">

import {fetchList} from "/@/api/admin/tenant";
import {Local, Session} from "/@/utils/storage";

const tenantList = ref([])
const tenant = ref()

onMounted(async () => {
  await getTenantList()
  tenant.value = Local.get("tenantId");
  handleAutoTenant()
})

const getTenantList = () => {
  return fetchList().then((response) => {
    tenantList.value = response.data;
  })
}

const handleAutoTenant = () => {
  let domain = window.location.host
  tenantList.value.forEach((tenant: any) => {
    if (domain.indexOf(tenant.tenantDomain) >= 0) {
      handleCommand(tenant.id)
    }
  })
}

const handleCommand = (command: string) => {
  // 写入到 sessionStore 方便 axios 每次请求获取 tab 范围内的租户ID
  Session.set("tenantId", command)
  Local.set("tenantId", command)
}

</script>

<style scoped lang="scss">

</style>
