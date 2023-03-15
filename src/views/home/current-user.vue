<template>
	<el-row>
		<el-skeleton animated :loading="loading">
			<el-col :span="4">
				<el-avatar shape="circle" :size="100" fit="cover" :src="userData.avatar" />
			</el-col>
			<el-col :span="2">
				<div>{{ userData.name }}</div>
				<div>{{ userData.deptName }} | {{ userData.postName }}</div>
			</el-col>
			<el-col :span="4" :offset="14"> {{ parseTime(date) }} </el-col>
		</el-skeleton>
	</el-row>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
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
  } finally {
    loading.value = false; // 结束加载状态
  }
};

</script>
