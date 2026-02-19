<script lang="ts">
export default {
	title: '日程管理',
	icon: 'Calendar',
	description: '日历组件展示',
};
</script>

<template>
	<el-card class="h-96 box-card">
		<Calendar :first-day-of-week="1" view="weekly" :locale="locale" :attributes="reminders" ref="calendar"
			title-position="center" @did-move="weeknumberClick" @dayclick="dayClick" :masks="masks"
			v-bind="themeConfig?.isDark ? { 'is-dark': true } : {}" transparent borderless expanded />
		<div v-if="calendar" class="py-4 px-6 w-full h-[18rem] overflow-y-auto">
			<template v-for="{ day, cells } in Object.values(dayCells)">
				<ul v-if="cells.length > 0" class="py-2 space-y-2" :key="day">
					<li v-for="cell in cells" :key="cell.data.customData.id">
						<div class="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
							<div class="w-1 h-8 rounded-full bg-primary flex-shrink-0"></div>
							<div class="flex items-center justify-between flex-grow min-w-0">
								<div class="min-w-0">
									<p class="text-[13px] font-medium text-gray-700 dark:text-gray-300 truncate">
										{{ cell.data.customData.title }}
									</p>
									<p class="text-xs text-gray-400 mt-0.5">
										{{ cell.data.customData.scheduleDate }} {{ cell.data.customData.scheduleTime }}
									</p>
								</div>
							</div>
							<el-switch size="small" @change="changeSwitch(cell.data.customData.id)" />
						</div>
					</li>
				</ul>
			</template>
			<el-empty v-if="reminders.length === 0" :image-size="120" class="text-center" />
		</div>
		<schedule-form ref="scheduleFormRef" @refresh="initscheduleList()" />
		<schedule ref="scheduleRef" @refresh="initscheduleList()" />
	</el-card>
</template>

<script setup lang="ts" name="scheduleCalendar">
import { Calendar } from 'v-calendar';
import 'v-calendar/style.css';
import { useThemeConfig } from '/@/stores/themeConfig';
import { parseDate } from '/@/utils/formatTime';
import { list, putObj } from '/@/api/admin/schedule';

import ScheduleForm from '/@/views/home/schedule/form.vue';
import Schedule from '/@/views/home/schedule/index.vue';

const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const locale = computed(() => themeConfig.value.globalI18n);

const masks = ref({
	weekdays: 'WWW',
});

const reminders = ref([]);
const calendar = ref<any>(null);
const scheduleFormRef = ref();
const scheduleRef = ref();

interface DayCell {
	day: string;
	cells: Array<{
		data: {
			customData: {
				id: string;
				title: string;
				scheduleDate: string;
				scheduleTime: string;
			};
		};
	}>;
}

const dayCells = computed<Record<string, DayCell>>(() => {
	return calendar.value?.dayCells ?? {};
});

const startDateRef = ref();
const endDateRef = ref();

const weeknumberClick = (page: any) => {
	startDateRef.value = page[0].viewDays[0].id;
	endDateRef.value = page[0].viewDays[6].id;
	initscheduleList();
};

const dayClick = (day: any) => {
	if (filterCellSelected(day.id)) {
		scheduleRef.value.open({ date: parseDate(day.id, null) });
	} else {
		scheduleFormRef.value.openDialog(null, { date: parseDate(day.id, null) });
	}
};

const changeSwitch = async (id: string) => {
	await putObj({ id, scheduleState: '3' });
	initscheduleList();
};

const initscheduleList = async () => {
	const res = await list({
		startDate: startDateRef.value,
		endDate: endDateRef.value,
	});
	reminders.value = res.data.map((item: any) => ({
		key: item.id,
		highlight: {
			color: 'primary',
			fillMode: 'outline',
		},
		dates: item.scheduleDate,
		customData: item,
	}));
};

const filterCellSelected = (day: string) => {
	return reminders.value.some((item: any) => item.dates.includes(day));
};

onMounted(() => {
	initscheduleList();
});
</script>
<style scoped lang="scss"></style>
