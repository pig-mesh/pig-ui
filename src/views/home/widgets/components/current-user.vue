<script lang="ts">
export default {
	title: '当前用户',
	icon: 'User',
	description: '获取当前用户信息展示',
};
</script>

<template>
	<el-card class="flex items-center justify-center h-[191px]">
		<div class="flex items-center justify-center">
			<div class="relative">
				<img class="object-cover w-16 h-16 rounded-full" :src="userData.avatar" alt="Avatar" />
				<div class="absolute inset-0 rounded-full shadow-inner"></div>
			</div>
			<div class="ml-8">
				<h2 class="text-lg font-bold text-gray-800">{{ userData.name }}</h2>
				<p class="text-gray-600">{{ userData.deptName }} | {{ userData.postName }}</p>
			</div>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="currentUser">
import { useUserInfo } from '/@/stores/userInfo';
import { getObj } from '/@/api/admin/user';

const { proxy } = getCurrentInstance();

const userData = ref({
	postName: '',
	name: '',
	username: '',
	userId: '',
	avatar: '',
	deptName: '',
} as any);
const loading = ref(false);

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
		userData.value.avatar = proxy.baseURL + res.data.avatar;
	} finally {
		loading.value = false; // 结束加载状态
	}
};
</script>

<style scoped>
.info {
	margin-left: 8px;
	display: flex;
	flex-direction: column;
	justify-content: center;
}
</style>
