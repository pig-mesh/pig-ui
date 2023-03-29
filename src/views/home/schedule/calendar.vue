<template>
	<el-calendar v-model="calendar">
		<template #date-cell="{ data }">
			<div style="width: 100%" @click="handleSchedule(data)">
				{{ data.day.split('-').slice(2).join('-') }}
				<span v-if="filterCellSelected(data)">
					<el-icon><BellFilled /></el-icon>
				</span>
			</div>
		</template>
	</el-calendar>

	<!-- 新增日程的表单 -->
	<schedule-form ref="scheduleFormRef" @refresh="initscheduleList(formatDate(calendar, 'YYYY-mm'))" />
	<!-- 日程查询 -->
	<schedule ref="scheduleRef" @refresh="initscheduleList(formatDate(calendar, 'YYYY-mm'))" />
</template>

<script setup lang="ts" name="SysScheduleCalendar">
import { formatDate, parseDate } from '/@/utils/formatTime';
import { list } from '/@/api/admin/schedule';

const ScheduleForm = defineAsyncComponent(() => import('./form.vue'));
const Schedule = defineAsyncComponent(() => import('./index.vue'));
const scheduleDataList = ref([] as any);
const scheduleFormRef = ref();
const scheduleRef = ref();
const calendar = ref(new Date());

onMounted(() => {
	initscheduleList(formatDate(calendar.value, 'YYYY-mm'));
});

watch(calendar, (val, oldval) => {
	const newVal = formatDate(val, 'YYYY-mm');
	const old = formatDate(oldval, 'YYYY-mm');
	if (newVal !== old) {
		initscheduleList(newVal);
	}
});

const initscheduleList = (date) => {
	list({
		month: `${date}-01`,
	}).then((res) => {
		scheduleDataList.value = res.data;
	});
};

const filterCellSelected = (data) => {
	return (
		scheduleDataList.value.filter((item) => {
			return item.date.indexOf(data.day) >= 0;
		}).length > 0
	);
};

const handleSchedule = (data) => {
	//如果当前日期下日程为空则打开form
	if (filterCellSelected(data)) {
		scheduleRef.value.open({ date: parseDate(data.date, null) });
	} else {
		scheduleFormRef.value.openDialog(null, { date: parseDate(data.date, null) });
	}
};
</script>
