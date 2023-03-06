<template>
	<el-row>
		<el-col :span="4">
			<el-avatar shape="circle" :size="100" fit="cover" :src="userData.avatar" />
		</el-col>
		<el-col :span="2">
			<div>{{ userData.name }}</div>
			<div>{{ userData.deptName }} | {{ userData.postName }}</div>
		</el-col>
		<el-col :span="4" :offset="14"> {{ parseTime(date) }} </el-col>
	</el-row>
</template>

<script setup lang="ts" name="SysFavoriteDashboard">
import { useUserInfo } from '/@/stores/userInfo';
import { getObj } from '/@/api/admin/user';

const date = ref(new Date());

const userData = ref({} as any);

setInterval(() => {
	date.value = new Date();
}, 1000);

onMounted(() => {
	const data = useUserInfo().userInfos;
	initUserInfo(data.user.userId);
});

const initUserInfo = (userId: any) => {
	getObj(userId)
		.then((res) => {
			userData.value = res.data;
			userData.value.postName = res.data.postList
				.map((item) => {
					return item.postName;
				})
				.join(',');
		})
};
</script>
