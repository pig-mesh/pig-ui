<script lang="ts">
export default {
	title: '当前用户',
	icon: 'User',
	description: '获取当前用户信息展示',
};
</script>

<template>
	<el-card class="current-user-card group h-[189px]">
		<div class="flex items-center h-full px-6">
			<!-- 头像 -->
			<div class="flex-shrink-0 mr-5">
				<img
					v-if="userData.avatar && !avatarError"
					class="object-cover w-16 h-16 transition-transform duration-200 rounded-full shadow-md shadow-black/5 dark:shadow-black/20 ring-2 ring-white dark:ring-gray-700 group-hover:scale-105"
					:src="baseURL + userData.avatar"
					alt="Avatar"
					@error="avatarError = true"
				/>
				<NameAvatar v-else :name="userData.name || userData.username" :size="64" class="transition-transform duration-200 shadow-md shadow-black/5 dark:shadow-black/20 ring-2 ring-white dark:ring-gray-700 group-hover:scale-105" />
			</div>

			<!-- 信息区域：主 → 次 → 辅 三层 -->
			<div class="flex-1 min-w-0">
				<!-- 主层：姓名 + 用户名 -->
				<h2 class="text-lg font-semibold leading-tight tracking-tight text-gray-900 truncate dark:text-gray-50">
					{{ userData.name || userData.username }}
				</h2>
				<p class="mt-0.5 text-xs text-gray-400 truncate dark:text-gray-500">@{{ userData.username }}</p>

				<!-- 次层：角色标签 -->
				<div v-if="userRoles.length" class="flex flex-wrap gap-1.5 mt-3">
					<span
						v-for="role in userRoles"
						:key="role.roleId"
						class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20"
					>
						{{ role.roleName }}
					</span>
				</div>

				<!-- 辅层：部门/职位 · 租户 -->
				<p v-if="subInfo" class="mt-2.5 text-xs text-gray-400 dark:text-gray-500 truncate">{{ subInfo }}</p>
			</div>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="currentUser">
import { useUserInfo } from '/@/stores/userInfo';
import NameAvatar from '/@/components/NameAvatar/index.vue';

const { userInfos } = storeToRefs(useUserInfo());

const avatarError = ref(false);

const userData = computed(() => {
	const user = userInfos.value?.user;
	if (!user) return { postName: '', name: '', username: '', avatar: '', deptName: '', tenantName: '' };
	return {
		...user,
		postName: user.postList?.map((item: PostItem) => item.postName).join(',') || '',
		tenantName: userInfos.value?.tenantName || '',
	};
});

const userRoles = computed(() => userInfos.value?.roles || []);

const subInfo = computed(() => {
	const parts: string[] = [];
	const org = [userData.value.deptName, userData.value.postName].filter(Boolean).join('/');
	if (org) parts.push(org);
	if (userData.value.tenantName) parts.push(userData.value.tenantName);
	return parts.join(' · ');
});
</script>

<style scoped>
.current-user-card :deep(.el-card__body) {
	padding: 0;
	height: 100%;
}
</style>
