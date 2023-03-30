<template>
	<el-card class="box-card" style="height: 100%">
		<template #header>
			<div class="card-header">
				<span>{{ $t('home.systemLogsTip') }}</span>
				<el-button link class="button" text @click="handleRoutr">{{ $t('home.moreTip') }}</el-button>
			</div>
		</template>
		<el-timeline v-if="logState.dataList.length > 0">
			<el-timeline-item v-for="(item, index) in logState.dataList" :key="index" :timestamp="item.createTime">
				{{ item.title }} - {{ item.remoteAddr }}
			</el-timeline-item>
		</el-timeline>
	</el-card>
</template>

<script setup lang="ts" name="SysLogDashboard">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList } from '/@/api/admin/log';

const router = useRouter();

// 创建基本表格参数对象
const logState: BasicTableProps = reactive({
	pageList, // 分页列表数据
	descs: ['create_time'], // 排序方式
	pagination: {
		size: 5, // 每页显示数据量
	},
});

// 使用实例
useTable(logState);

/**
 * 处理路由跳转事件
 * @function
 */
const handleRoutr = () => {
	router.push('/admin/log/index'); // 跳转到日志管理页面
};
</script>

<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
