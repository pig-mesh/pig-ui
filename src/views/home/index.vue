<template>
	<div class="home-container layout-pd">
		<el-row :gutter="10">
			<el-col :span="16">
				<el-row :gutter="10">
					<el-col :span="24">
						<div class="home-card-item">
							<el-avatar shape="circle" :size="100" fit="cover" :src="userData.avatar" />
							{{ userData }}
						</div>
					</el-col>
					<el-col :span="24">
						<div class="home-card-item" style="height: 200px">
							<div class="home-card-item-title">快捷导航工具</div>
							<div class="home-monitor">
								<div class="flex-warp">
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
							</div>
						</div>
					</el-col>
					<el-col :span="12">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									<span>系统日志</span>
									<el-button link class="button" text @click="handleRoutr('log')">更多</el-button>
								</div>
							</template>
							<el-timeline>
								<el-timeline-item v-for="(item, index) in logState.dataList" :key="index" :timestamp="item.createTime">
									{{ item.title }} - {{ item.remoteAddr }}
								</el-timeline-item>
							</el-timeline>
						</el-card>
					</el-col>
					<el-col :span="12">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									<span>审计日志</span>
									<el-button link class="button" text @click="handleRoutr('audit')">更多</el-button>
								</div>
							</template>
							<el-timeline>
								<el-timeline-item v-for="(item, index) in auditState.dataList" :key="index" :timestamp="item.createTime">
									{{ item.createBy }} : {{ item.auditField }} {{ item.afterVal }} => {{ item.beforeVal }}
								</el-timeline-item>
							</el-timeline>
						</el-card>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="8">
				<el-row>
					<el-col :span="24">
						<el-calendar />
					</el-col>
					<el-col :span="24">
						<el-card class="box-card">
							<template #header>
								<div class="card-header">
									<span>站内信</span>
								</div>
							</template>
							<el-timeline>
								<el-timeline-item v-for="(item, index) in newsList" :key="index" :timestamp="item.time">
									{{ item.label }} - {{ item.value }}
								</el-timeline-item>
							</el-timeline>
						</el-card>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { useTagsViewRoutes } from '/@/stores/tagsViewRoutes';
import { useRouter } from 'vue-router';
import { useUserInfo } from '/@/stores/userInfo';
import { useMsg } from '/@/stores/msg';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList } from '/@/api/admin/log';
import { fetchList } from '/@/api/admin/audit';
const router = useRouter();
const storesTagsViewRoutes = useTagsViewRoutes();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const { isTagsViewCurrenFull, favoriteRoutes } = storeToRefs(storesTagsViewRoutes);

const HandleRoute = (item: any) => {
	router.push(item.path);
};

const handleCloseFavorite = (item: any) => {
	storesTagsViewRoutes.delFavoriteRoutes(item);
};

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

useTable(logState);

const auditState: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});

useTable(auditState);

// 定义变量内容
const userData = reactive({
	username: '',
	name: '',
	email: '',
	avatar: '',
	nickname: '',
	phone: '',
});
const newsList = computed(() => {
	return useMsg().getAllMsg();
});

onMounted(() => {
	const data = useUserInfo().userInfos;
	Object.assign(userData, data.user);
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
</style>
