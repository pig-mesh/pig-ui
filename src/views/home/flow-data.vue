<template>
  <el-card>
    <el-row>
      <el-col :span="12">
        <router-link to="/task/pending">
          <el-statistic title="待办任务✍️" :value="state.pendingNum"/>
        </router-link>
      </el-col>
      <el-col :span="12">
        <router-link to="/task/cc">
          <el-statistic title="抄送任务🔖️" :value="state.copyNum"/>
        </router-link>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup name="flowData">
import {queryTaskData} from "/@/api/flow/task";

const state = reactive({
  pendingNum: 0,
  copyNum: 0
})

onMounted(async () => {
  const { data } = await queryTaskData();
  state.pendingNum = data?.pendingNum || 0;
  state.copyNum = data?.copyNum || 0;
});
</script>
<style scoped>
.el-col {
  text-align: center;
}
</style>
