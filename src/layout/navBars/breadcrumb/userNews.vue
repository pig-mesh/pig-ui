<template>
	<div class="layout-navbars-breadcrumb-user-news">
		<div class="head-box">
			<div class="head-box-title">{{ $t('user.newTitle') }}</div>
			<div class="head-box-btn" v-if="newsList.length > 0" @click="onAllReadClick">{{ $t('user.newBtn') }}</div>
		</div>
		<div class="content-box">
			<template v-if="newsList.length > 0">
				<div class="content-box-item" v-for="(v, k) in newsList" :key="k">
					<div>{{ v.label }}</div>
					<div class="content-box-msg">
						{{ v.value }}
					</div>
					<div class="content-box-time">{{ v.time }}</div>
				</div>
			</template>
			<el-empty :description="$t('user.newDesc')" v-else></el-empty>
		</div>
	</div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUserNews">
// 定义变量内容
import { useMsg } from '/@/stores/msg';

const newsList = computed(() => {
	return useMsg().getAllMsg();
});

// 全部已读点击
const onAllReadClick = () => {
	useMsg().removeAll();
};
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
	.head-box {
		display: flex;
		border-bottom: 1px solid var(--el-border-color-lighter);
		box-sizing: border-box;
		color: var(--el-text-color-primary);
		justify-content: space-between;
		height: 35px;
		align-items: center;

		.head-box-btn {
			color: var(--el-color-primary);
			font-size: 13px;
			cursor: pointer;
			opacity: 0.8;

			&:hover {
				opacity: 1;
			}
		}
	}

	.content-box {
		font-size: 13px;

		.content-box-item {
			padding-top: 12px;

			&:last-of-type {
				padding-bottom: 12px;
			}

			.content-box-msg {
				color: var(--el-text-color-secondary);
				margin-top: 5px;
				margin-bottom: 5px;
			}

			.content-box-time {
				color: var(--el-text-color-secondary);
			}
		}
	}

	.foot-box {
		height: 35px;
		color: var(--el-color-primary);
		font-size: 13px;
		cursor: pointer;
		opacity: 0.8;
		display: flex;
		align-items: center;
		justify-content: center;
		border-top: 1px solid var(--el-border-color-lighter);

		&:hover {
			opacity: 1;
		}
	}

	:deep(.el-empty__description p) {
		font-size: 13px;
	}
}
</style>
