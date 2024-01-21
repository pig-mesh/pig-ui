<script lang="ts">
export default {
	title: '日程管理',
	icon: 'Calendar',
	description: '日历组件展示',
};
</script>

<template>
	<el-card class="h-96 box-card">
		<Calendar
			view="weekly"
			:locale="locale"
			:attributes="reminders"
			ref="calendar"
			title-position="center"
			@did-move="weeknumberClick"
			@dayclick="dayClick"
			:masks="masks"
			transparent
			borderless
			expanded
		/>
		<div v-if="calendar" class="py-4 px-6 w-full h-[18rem] overflow-y-auto">
			<template v-for="{ day, cells } in Object.values(dayCells)">
				<ul v-if="cells.length > 0" class="py-2 space-y-2" :key="day">
					<li v-for="cell in cells" :key="cell">
						<div class="flex items-center space-x-4">
							<!--Icon-->
							<div class="flex-grow-0 flex-shrink-0">
								<div :class="`flex justify-center items-center w-10 h-10 rounded-lg bg-blue-100 text-blue-500 dark:bg-blue-400 dark:text-white`">
									<el-icon><CircleCheck /></el-icon>
								</div>
							</div>
							<div class="flex items-center justify-between flex-grow">
								<div>
									<p class="font-medium">
										{{ cell.data.customData.title }}
									</p>
									<p class="text-xs font-medium text-gray-400 dark:text-gray-400 leading-2">
										{{ cell.data.customData.date }} {{ cell.data.customData.time }}
									</p>
								</div>
							</div>

							<el-switch @change="changeSwitch(cell.data.customData.id)"></el-switch>
						</div>
					</li>
				</ul>
			</template>
			<el-empty :image-size="120" v-if="reminders.length === 0" class="text-center" />
		</div>
		<!-- 新增日程的表单 -->
		<schedule-form ref="scheduleFormRef" @refresh="initscheduleList()" />
		<!-- 日程查询 -->
		<schedule ref="scheduleRef" @refresh="initscheduleList()" />
	</el-card>
</template>

<script setup lang="ts" name="scheduleCalendar">
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import { useThemeConfig } from '/@/stores/themeConfig';
import { parseDate } from '/@/utils/formatTime';
import { list, putObj } from '/@/api/admin/schedule';

const ScheduleForm = defineAsyncComponent(() => import('/@/views/home/schedule/form.vue'));
const Schedule = defineAsyncComponent(() => import('/@/views/home/schedule/index.vue'));

// 获取当前国际化方言
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const locale = computed(() => {
	return themeConfig.value.globalI18n;
});

const masks = ref({
	weekdays: 'WWW',
});

const reminders = ref([]);
const calendar = ref(null);
const scheduleFormRef = ref();
const scheduleRef = ref();
const dayCells = computed(() => {
	if (!calendar.value) return [];
	return calendar.value.dayCells;
});

// 日期范围的开始日期引用
const startDateRef = ref();
// 日期范围的结束日期引用
const endDateRef = ref();

// 点击周数的回调函数
const weeknumberClick = (page: any) => {
	// 获取当前周的第一天和最后一天的日期
	const startDate = page[0].viewDays[0].id;
	const endDate = page[0].viewDays[6].id;

	// 更新开始日期引用和结束日期引用
	startDateRef.value = startDate;
	endDateRef.value = endDate;

	// 初始化日程列表
	initscheduleList();
};

//处理日程安排事件，若当前日期下没有日程则打开表单对话框，否则打开日程详情页面
const dayClick = (day: any) => {
	if (filterCellSelected(day.id)) {
		scheduleRef.value.open({ date: parseDate(day.id, null) });
	} else {
		scheduleFormRef.value.openDialog(null, { date: parseDate(day.id, null) });
	}
};

// 修改开关状态
const changeSwitch = async (id: string) => {
	// 修改对象的状态为'3'
	await putObj({ id: id, state: '3' });
	// 初始化调度列表
	initscheduleList();
};

const initscheduleList = () => {
	// 初始化日程列表
	list({
		startDate: startDateRef.value,
		endDate: endDateRef.value,
	}).then((res) => {
		// 获取返回结果的数据并转换为合适的格式
		reminders.value = res.data.map((item: any) => {
			return {
				key: item.id,
				highlight: {
					color: 'primary',
					fillMode: 'outline',
				},
				dates: item.date,
				customData: item,
			};
		});
	});
};

// 过滤日历中选中的单元格是否有日程
const filterCellSelected = (day: string) => {
	return (
		reminders.value.filter((item: any) => {
			return item.dates.includes(day);
		}).length > 0
	);
};

onMounted(() => {
	initscheduleList();
});
</script>
<style scoped lang="scss">
.card-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}
</style>
