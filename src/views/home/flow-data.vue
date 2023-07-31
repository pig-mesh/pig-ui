<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <router-link to="/task/pending">
          <el-statistic title="待办任务✍️" :value="data.pendingNum"/>
        </router-link>
      </el-col>
      <el-col :span="12">
        <router-link to="/task/cc">
          <el-statistic title="抄送任务🔖️" :value="data.copyNum"/>
        </router-link>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup name="flowData">
import {queryTaskData} from "/@/api/flow/task";

const data = reactive({
  pendingNum: 0,
  copyNum: 0
})

onMounted(async () => {
  const { data } = await queryTaskData();
  data.pendingNum = data?.pendingNum || 0;
  data.copyNum = data?.copyNum || 0;
});
</script>
<style scoped>
.el-col {
  text-align: center;
}
</style>
