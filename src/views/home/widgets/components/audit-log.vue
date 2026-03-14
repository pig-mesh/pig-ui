<script lang="ts">
export default {
	title: '审计日志',
	icon: 'DocumentCopy',
	description: '审计日志列表',
};
</script>
<template>
	<el-card class="box-card h-96">
		<template #header>
			<div class="flex justify-between items-center">
				<span class="text-[15px] font-semibold text-gray-800 dark:text-gray-100">{{ $t('home.auditLogsTip') }}</span>
				<el-button text class="button" @click="handleRoutr">
					{{ $t('home.moreTip') }}
					<el-icon class="ml-1"><ArrowRight /></el-icon>
				</el-button>
			</div>
		</template>
		<div class="flex flex-col gap-3" v-if="auditState.dataList.length > 0">
			<div v-for="(item, index) in auditState.dataList" :key="index" class="py-2 border-b border-[var(--el-border-color-extra-light)] last:border-b-0">
				<div class="flex items-start gap-3">
					<div class="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
					<div class="flex-1 min-w-0">
						<p class="text-[13px] text-gray-700 dark:text-gray-300 leading-relaxed">
							<span class="text-gray-400 dark:text-gray-500">{{ item.createBy }}</span>
							{{ item.auditField }} {{ item.afterVal }} → {{ item.beforeVal }}
						</p>
					</div>
					<span class="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{{ item.createTime }}</span>
				</div>
			</div>
		</div>
		<el-empty :image-size="120" v-else />
	</el-card>
</template>

<script setup lang="ts" name="SysAuditLogDashboard">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList } from '/@/api/admin/audit';

const router = useRouter();

// 创建基本表格参数对象
const auditState: BasicTableProps = reactive({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
	pagination: {
		size: 4, // 每页显示数据量
	},
});

// 使用实例
useTable(auditState);

// 跳转路由
const handleRoutr = () => {
	router.push('/admin/audit/index');
};
</script>

<style scoped lang="scss">
</style>
