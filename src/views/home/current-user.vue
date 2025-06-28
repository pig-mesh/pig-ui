<template>
	<el-card class="h-full shadow-sm hover:shadow-md transition-shadow">
		<div class="flex items-center justify-between">
			<!-- 用户信息 -->
			<div class="flex items-center gap-4">
				<el-avatar 
					:size="56" 
					shape="circle" 
					:src="baseURL + userData.avatar"
					class="ring-1 ring-gray-100" 
				/>
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">{{ userData.name }}</h3>
					<div class="flex items-center gap-2 text-sm">
						<span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{{ userData?.dept?.name }}</span>
						<span v-if="userData.postName" class="px-3 py-1 bg-green-50 text-green-600 rounded-full">{{ userData.postName }}</span>
					</div>
				</div>
			</div>

			<!-- 时间 -->
			<div class="flex items-center gap-2 text-sm text-gray-500">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>{{ parseTime(date) }}</span>
			</div>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="currentUser">
import { useUserInfo } from '/@/stores/userInfo';
import { getObj } from '/@/api/admin/user';

const date = ref(new Date());

const userData = ref({
	postName: '',
	name: '',
	username: '',
	userId: '',
	avatar: '',
	deptName: '',
} as any);
const loading = ref(false);

setInterval(() => {
	date.value = new Date();
}, 1000);

onMounted(() => {
	const data = useUserInfo().userInfos;
	initUserInfo(data.user.userId);
});

/**
 * 根据用户 ID 初始化用户信息。
 * @param {any} userId - 要查询的用户 ID。
 * @returns {Promise<void>} - 初始化用户信息的 Promise 实例。
 */
const initUserInfo = async (userId: any): Promise<void> => {
	try {
		loading.value = true; // 显示加载状态

		const res = await getObj(userId); // 执行查询操作
		userData.value = res.data; // 将查询到的数据保存到 userData 变量中
		userData.value.postName = res.data?.postList?.map((item: any) => item.postName).join(',') || ''; // 将 postList 中的 postName 合并成字符串并保存到 userData 变量中
		// 文件上传增加后端前缀
		userData.value.avatar = res.data.avatar;
	} finally {
		loading.value = false; // 结束加载状态
	}
};
</script>

<style scoped>
.el-card {
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	transition: all 0.2s ease;
}

.el-card :deep(.el-card__body) {
	padding: 24px;
}

/* 头像轻微悬停效果 */
.el-avatar {
	transition: transform 0.2s ease;
}

.el-avatar:hover {
	transform: scale(1.05);
}

/* 标签悬停效果 */
.px-3.py-1 {
	transition: all 0.2s ease;
	font-weight: 500;
}

.px-3.py-1:hover {
	transform: translateY(-1px);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式适配 */
@media (max-width: 640px) {
	.flex.items-center.justify-between {
		flex-direction: column;
		align-items: flex-start;
		gap: 16px;
	}
	
	.el-card :deep(.el-card__body) {
		padding: 16px;
	}
}
</style>

