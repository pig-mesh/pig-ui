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
			<div class="flex justify-between items-center">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">{{ $t('home.systemLogsTip') }}</span>
				<el-button text class="button" @click="handleRoutr">
					{{ $t('home.moreTip') }}
					<el-icon class="ml-1"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div class="flex flex-col gap-3" v-if="logState.dataList && logState.dataList.length > 0">
			<div v-for="(item, index) in logState.dataList" :key="index" class="py-2 border-b border-[var(--el-border-color-extra-light)] last:border-b-0">
				<div class="flex items-start gap-3">
					<div class="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
					<div class="flex-1 min-w-0">
						<p class="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">{{ item.title }}</p>
						<p class="text-xs text-gray-400 mt-0.5">{{ item.remoteAddr }}</p>
					</div>
					<span class="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{{ item.createTime }}</span>
				</div>
			</div>
		</div>
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
</style>
