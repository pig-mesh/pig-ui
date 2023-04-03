<template>
	<el-calendar v-model="calendar">
		<template #date-cell="{ data }">
			<div class="calendar-cell" @click="handleSchedule(data)">
				{{ data.day.split('-').slice(2).join('-') }}
				<div class="box-yello" v-if="filterCellSelected(data)"></div>
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
const scheduleDataList = ref([]);
const scheduleFormRef = ref();
const scheduleRef = ref();
const calendar = ref(new Date());

onMounted(() => {
	initscheduleList(formatDate(calendar.value, 'YYYY-mm'));
});

// 监听日历日期变化并更新日程数据
watch(calendar, (val, oldval) => {
	const newVal = formatDate(val, 'YYYY-mm');
	const old = formatDate(oldval, 'YYYY-mm');
	if (newVal !== old) {
		initscheduleList(newVal);
	}
});

/**
 * 初始化日程数据列表
 * @function
 * @param {string} date - YYYY-mm格式的日期字符串
 */
const initscheduleList = (date) => {
	list({
		month: `${date}-01`,
	}).then((res) => {
		scheduleDataList.value = res.data;
	});
};

/**
 * 过滤日历中选中的单元格是否有日程
 * @function
 * @param {object} data - 当前单元格包含的日期信息
 * @returns {boolean} 是否有日程
 */
const filterCellSelected = (data) => {
	return (
		scheduleDataList.value.filter((item) => {
			return item.date.indexOf(data.day) >= 0;
		}).length > 0
	);
};

/**
 * 处理日程安排事件，若当前日期下没有日程则打开表单对话框，否则打开日程详情页面
 * @function
 * @param {object} data - 当前单元格包含的日期信息
 */
const handleSchedule = (data) => {
	if (filterCellSelected(data)) {
		scheduleRef.value.open({ date: parseDate(data.date, null) });
	} else {
		scheduleFormRef.value.openDialog(null, { date: parseDate(data.date, null) });
	}
};
</script>

<style lang="scss" scoped>
.el-calendar-table {
	.calendar-cell {
		position: relative;
		text-align: center;
		height: 100%;
		align-items: center;
		display: flex;
		justify-content: center;
	}
	.box-yello {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #e6a23c;
		opacity: 0.6;
		padding: 0;
		border-radius: 5%;
	}
}
</style>
