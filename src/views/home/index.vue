<template>
	<div class="home-container layout-pd">
		<el-row :gutter="10">
			<el-col :span="16">
				<el-row :gutter="10">
					<!-- 基本信息 -->
					<el-col :span="24">
						<div class="home-card-item" v-loading="userLoading">
							<el-row>
								<el-col :span="4">
									<el-avatar shape="circle" :size="100" fit="cover" :src="userData.avatar" />
								</el-col>
								<el-col :span="2">
									<div>{{ userData.name }}</div>
									<div>{{ userData.deptName }} | {{ userData.postName }}</div>
								</el-col>
								<el-col :span="4" :offset="14"> {{ formatDate(date, 'YYYY-mm-dd HH:MM:SS') }} </el-col>
							</el-row>
						</div>
					</el-col>
					<!-- 快捷导航栏 -->
					<el-col :span="24">
						<div class="home-card-item">
							<div class="home-card-item-title">{{ $t('home.quickNavigationToolsTip') }}</div>
							<div class="home-monitor">
								<div class="flex-warp" v-if="favoriteRoutes.length > 0">
									<div class="flex-warp-item" v-for="(v, k) in favoriteRoutes" :key="k">
										<div class="flex-warp-item-box">
											<div class="flex-margin">
												<i :class="v.meta.icon"></i>
												<el-tag :key="v.path" @click="HandleRoute(v)" class="mx-1" closable :type="v.path" @close="handleCloseFavorite(v)">{{
													$t(v.name)
												}}</el-tag>
											</div>
										</div>
									</div>
								</div>
								<el-empty :description="$t('home.addFavoriteRoutesTip')" v-else />
							</div>
						</div>
					</el-col>
					<!-- 系统日志 -->
					<el-col :span="12">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									<span>{{ $t('home.systemLogsTip') }}</span>
									<el-button link class="button" text @click="handleRoutr('log')">{{ $t('home.moreTip') }}</el-button>
								</div>
							</template>
							<el-timeline v-if="logState.dataList.length > 0">
								<el-timeline-item v-for="(item, index) in logState.dataList" :key="index" :timestamp="item.createTime">
									{{ item.title }} - {{ item.remoteAddr }}
								</el-timeline-item>
							</el-timeline>
						</el-card>
					</el-col>
					<!-- 审计日志 -->
					<el-col :span="12">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									<span>{{ $t('home.auditLogsTip') }}</span>
									<el-button link class="button" text @click="handleRoutr('audit')">{{ $t('home.moreTip') }}</el-button>
								</div>
							</template>
							<el-timeline v-if="auditState.dataList.length > 0">
								<el-timeline-item v-for="(item, index) in auditState.dataList" :key="index" :timestamp="item.createTime">
									{{ item.createBy }} : {{ item.auditField }} {{ item.afterVal }} => {{ item.beforeVal }}
								</el-timeline-item>
							</el-timeline>
							<el-empty v-else />
						</el-card>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="8">
				<el-row>
					<!-- 日程 -->
					<el-col :span="24">
						<el-card class="box-card">
							<el-calendar v-model="calendar">
								<template #date-cell="{ data }">
									<div style="width: 100%; height: 100%" @click="handleSchedule(data)">
										{{ data.day.split('-').slice(2).join('-') }}
										<span v-if="filterCellSelected(data)">
											<el-icon><BellFilled /></el-icon>
										</span>
									</div>
								</template>
							</el-calendar>
						</el-card>
					</el-col>
					<!--  -->
					<el-col :span="24">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									<span>{{ $t('home.newsletterTip') }}</span>
								</div>
							</template>
							<el-timeline v-if="newsList.length > 0">
								<el-timeline-item v-for="(item, index) in newsList" :key="index" :timestamp="item.time">
									{{ item.label }} - {{ item.value }}
								</el-timeline-item>
							</el-timeline>
							<el-empty v-else />
						</el-card>
					</el-col>
				</el-row>
			</el-col>
		</el-row>

		<!-- 新增日程的表单 -->
		<schedule-form ref="scheduleFormRef" @refresh="initscheduleList(formatDate(calendar, 'YYYY-mm'))" />
		<!-- 日程查询 -->
		<schedule ref="scheduleRef" />
	</div>
</template>

<script setup lang="ts" name="home">
import { storeToRefs } from 'pinia';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useRouter } from 'vue-router';
import { useUserInfo } from '/@/stores/userInfo';
import { useMsg } from '/@/stores/msg';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList } from '/@/api/admin/log';
import { fetchList } from '/@/api/admin/audit';
import { formatDate, parseDate } from '/@/utils/formatTime';
import { getObj } from '/@/api/admin/user';
import { list } from '/@/api/admin/schedule';
const ScheduleForm = defineAsyncComponent(() => import('/@/views/home/schedule/form.vue'));
const Schedule = defineAsyncComponent(() => import('/@/views/home/schedule/index.vue'));

const router = useRouter();
const storesTagsViewRoutes = useTagsViewRoutes();
const { favoriteRoutes } = storeToRefs(storesTagsViewRoutes);
const userLoading = ref(false);
const date = ref(new Date());
const scheduleFormRef = ref();
const scheduleRef = ref();
const calendar = ref(new Date());
const userData = ref({} as any);
const scheduleDataList = ref([] as any);

const newsList = computed(() => {
	return useMsg().getAllMsg();
});

const HandleRoute = (item: any) => {
	router.push(item.path);
};

const handleCloseFavorite = (item: any) => {
	storesTagsViewRoutes.delFavoriteRoutes(item);
};

setInterval(() => {
	date.value = new Date();
}, 1000);

const logState: BasicTableProps = reactive<BasicTableProps>({
	pageList: pageList,
	descs: ['create_time'],
	pagination: {
		current: 1,
		size: 5,
		total: 0,
		pageSizes: [1, 10, 20, 50, 100, 200],
		layout: 'total, sizes, prev, pager, next, jumper',
	},
});

const auditState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

useTable(logState);

useTable(auditState);

watch(calendar, (val, oldval) => {
	const newVal = formatDate(val, 'YYYY-mm');
	const old = formatDate(oldval, 'YYYY-mm');
	if (newVal !== old) {
		initscheduleList(newVal);
	}
});

onMounted(() => {
	const data = useUserInfo().userInfos;
	initUserInfo(data.user.userId);
	initscheduleList(formatDate(calendar.value, 'YYYY-mm'));
});

const handleRoutr = (type) => {
	if (type === 'log') {
		router.push({
			path: '/admin/log/index',
		});
	} else if (type === 'audit') {
		router.push({
			path: '/admin/audit/index',
		});
	}
};

const initUserInfo = (userId: any) => {
	userLoading.value = true;
	getObj(userId)
		.then((res) => {
			userData.value = res.data;
			userData.value.postName = res.data.postList
				.map((item) => {
					return item.postName;
				})
				.join(',');
		})
		.finally(() => {
			userLoading.value = false;
		});
};

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

<style scoped lang="scss">
.el-col {
	margin-bottom: 10px;
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.text {
		font-size: 14px;
	}

	.item {
		margin-bottom: 18px;
	}

	.box-card {
		width: 100%;
	}
}
.home-container {
	overflow: hidden;
	.home-card-item {
		width: 100%;
		min-height: 130px;
		border-radius: 4px;
		transition: all ease 0.3s;
		padding: 20px;
		overflow: hidden;
		background: var(--el-color-white);
		color: var(--el-text-color-primary);
		border: 1px solid var(--next-border-color-light);

		.flex-warp-item-box {
			margin: auto;
			text-align: center;
			color: var(--el-text-color-primary);
			display: flex;
			border-radius: 5px;
			background: var(--next-bg-color);
			cursor: pointer;
			transition: all 0.3s ease;

			&:hover {
				background: var(--el-color-primary-light-9);
				transition: all 0.3s ease;
			}
		}

		&:hover {
			box-shadow: 0 2px 12px var(--next-color-dark-hover);
			transition: all ease 0.3s;
		}

		&-icon {
			width: 70px;
			height: 70px;
			border-radius: 100%;
			flex-shrink: 1;

			i {
				color: var(--el-text-color-placeholder);
			}
		}

		&-title {
			font-size: 15px;
			font-weight: bold;
			height: 30px;
		}
		.flex-warp-item {
			width: 15%;
			height: 56px;
		}
	}
}

li {
	list-style: none;
}
</style>
