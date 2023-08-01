<template>
	<el-card style="height: 100%">
		<div style="display: flex; justify-content: space-between">
			<div style="display: flex">
				<el-avatar style="width: 60px; height: 60px" shape="circle" :size="100" fit="cover" :src="userData.avatar" />
				<div class="info">
					<span style="font-weight: 600; margin: 2px; font-size: 18px">{{ userData.name }}</span>
					<span style="color: #6d737b; margin: 2px">{{ userData.deptName }} | {{ userData.postName }}</span>
				</div>
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
