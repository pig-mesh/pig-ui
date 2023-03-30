<template>
	<el-card class="box-card" style="height: 100%">
		<template #header>
			<div class="card-header">
				<span>{{ $t('home.auditLogsTip') }}</span>
				<el-button link class="button" text @click="handleRoutr">{{ $t('home.moreTip') }}</el-button>
			</div>
		</template>
		<el-timeline v-if="auditState.dataList.length > 0">
			<el-timeline-item v-for="(item, index) in auditState.dataList" :key="index" :timestamp="item.createTime">
				{{ item.createBy }} : {{ item.auditField }} {{ item.afterVal }} => {{ item.beforeVal }}
			</el-timeline-item>
		</el-timeline>
		<el-empty v-else />
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
});

// 使用实例
useTable(auditState);

// 跳转路由
const handleRoutr = () => {
	router.push('/admin/audit/index');
};
</script>

<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
