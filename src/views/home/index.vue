<template>
  <div>
    <div v-if="pageLoading">
      <el-main>
        <el-card shadow="never">
          <el-skeleton :rows="1"></el-skeleton>
        </el-card>
        <el-card shadow="never" style="margin-top: 15px;">
          <el-skeleton></el-skeleton>
        </el-card>
      </el-main>
    </div>
    <widgets/>
    
    <!-- 提醒窗口 -->
    <HomeNotice
      v-if="isShowNotice"
      v-model:show="showDemoNotice"
    />
  </div>
</template>

<script setup lang="ts" name="dashboard">
import HomeNotice from './notice/index.vue';

const Widgets = defineAsyncComponent(() => import('./widgets/index.vue'));

/**
 * 页面加载状态
 */
const pageLoading = ref(true);

/**
 * 是否显示演示提醒窗口
 */
const showDemoNotice = ref(false);

/**
 * 是否启用首页通知（从环境变量读取）
 */
const isShowNotice = ref(import.meta.env.VITE_HOME_NOTICE_ENABLED === 'true');

/**
 * 组件挂载时初始化
 */
onMounted(() => {
	pageLoading.value = false;

	// 延迟显示演示提醒窗口
	if (isShowNotice.value) {
		setTimeout(() => {
			showDemoNotice.value = true;
		}, 500);
	}
});
</script>
