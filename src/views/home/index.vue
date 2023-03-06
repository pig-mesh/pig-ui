<template>
	<div class="home-container layout-pd">
		<el-row :gutter="10">
			<el-col :span="16">
				<el-row :gutter="10">
					<!-- 基本信息 -->
					<el-col :span="24">
						<div class="home-card-item">
							<current-user />
						</div>
					</el-col>
					<!-- 快捷导航栏 -->
					<el-col :span="24">
						<div class="home-card-item">
							<favorite />
						</div>
					</el-col>
					<!-- 系统日志 -->
					<el-col :span="12">
						<sys-log />
					</el-col>
					<!-- 审计日志 -->
					<el-col :span="12">
						<audit-log />
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="8">
				<el-row>
					<!-- 日程 -->
					<el-col :span="24">
						<el-card class="box-card">
							<schedule-calendar />
						</el-card>
					</el-col>
					<!-- 收件箱 -->
					<el-col :span="24">
						<news-letter />
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="home">
const Favorite = defineAsyncComponent(() => import('./favorite.vue'));
const CurrentUser = defineAsyncComponent(() => import('./current-user.vue'));
const NewsLetter = defineAsyncComponent(() => import('./newsletter.vue'));
const ScheduleCalendar = defineAsyncComponent(() => import('./schedule/calendar.vue'));
const SysLog = defineAsyncComponent(() => import('./log-dashboard/sys-log.vue'));
const AuditLog = defineAsyncComponent(() => import('./log-dashboard/audit-log.vue'));
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
