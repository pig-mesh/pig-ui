<template>
  <el-card style="height: 100%">
    <el-row>
      <el-col :span="12">
        <router-link to="/task/pending">
          <el-statistic :title="$t('home.pendingTask')" :value="state.pendingNum"/>
        </router-link>
      </el-col>
      <el-col :span="12">
        <router-link to="/task/cc">
          <el-statistic :title="$t('home.copyTask')" :value="state.copyNum"/>
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
  state.pendingNum = Number.parseInt(data?.pendingNum || 0)
  state.copyNum = Number.parseInt(data?.copyNum || 0)
});
</script>
<style scoped>
.el-col {
  text-align: center;
}
</style>
