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

const auditState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

useTable(auditState);

const handleRoutr = () => {
	router.push({
		path: '/admin/audit/index',
	});
};
</script>

<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
