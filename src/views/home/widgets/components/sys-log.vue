<script lang="ts">
export default {
	title: '系统日志',
	icon: 'Monitor',
	description: '系统日志列表',
};
</script>
<template>
	<el-card class="h-96 box-card">
		<template #header>
			<div class="card-header">
				<span>{{ $t('home.systemLogsTip') }}</span>
				<el-button text class="button" @click="handleRoutr">{{ $t('home.moreTip') }}</el-button>
			</div>
		</template>
		<el-timeline v-if="logState.dataList && logState.dataList.length > 0">
			<el-timeline-item v-for="(item, index) in logState.dataList" :key="index">
				<div>{{ item.title }} - {{ item.remoteAddr }}</div>
				<div style="font-size: 0.8rem; color: #909399">{{ item.createTime }}</div>
			</el-timeline-item>
		</el-timeline>
		<el-empty v-else :description="$t('common.noDataText')" />
	</el-card>
</template>

<script setup lang="ts" name="SysLogDashboard">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList } from '/@/api/admin/log';

const router = useRouter();

// 创建基本表格参数对象
const logState: BasicTableProps = reactive({
	dataList: [], // Explicitly initialize dataList
	pageList, // 分页列表数据
	descs: ['create_time'], // 排序方式
	pagination: {
		size: 4, // 每页显示数据量
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
