<template>
	<el-card class="box-card">
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

const logState: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	descs: ['create_time'],
	pagination: {
		size: 5,
	},
});

useTable(logState);

const handleRoutr = () => {
	router.push({
		path: '/admin/log/index',
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
