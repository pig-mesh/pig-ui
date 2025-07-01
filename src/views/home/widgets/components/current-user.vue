<script lang="ts">
export default {
	title: '当前用户',
	icon: 'User',
	description: '获取当前用户信息展示',
};
</script>

<template>
	<el-card class="user-card h-[240px] hover:shadow-xl transition-all duration-300 ease-in-out border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
		<div class="flex items-center justify-center p-6 h-full relative overflow-hidden">
			
			<!-- 主内容区域 - 水平垂直居中 -->
			<div class="flex items-center justify-center w-full max-w-md">
				
				<!-- 头像区域 -->
				<div class="avatar-container relative flex-shrink-0 mr-24">
					<div class="relative">
						<img 
							class="object-cover w-24 h-24 rounded-full shadow-lg ring-4 ring-white dark:ring-gray-700" 
							:src="baseURL + userData.avatar" 
							alt="Avatar" 
						/>
						<div class="status-indicator absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 dark:bg-green-400 rounded-full border-3 border-white dark:border-gray-800 flex items-center justify-center shadow-sm">
							<div class="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
						</div>
					</div>
				</div>
				
				<!-- 信息区域 -->
				<div class="info-section flex-1 flex flex-col justify-center space-y-3">
					<!-- 真实姓名 -->
					<div class="name-section">
						<div class="flex items-center mb-1">
							<h2 class="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
								{{ userData.name || userData.username }}
							</h2>
						</div>
						<!-- 用户名 -->
						<p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
							@{{ userData.username }}
						</p>
					</div>
					
					<!-- 部门和职位 -->
					<div class="dept-section" v-if="userData.deptName || userData.postName">
						<div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
							<span class="font-medium">{{ userData.deptName }}</span>
							<span class="mx-2 text-gray-400" v-if="userData.deptName && userData.postName">·</span>
							<span class="text-gray-500 dark:text-gray-400">{{ userData.postName }}</span>
						</div>
					</div>
					
					<!-- 角色信息 -->
					<div class="roles-section" v-if="userRoles && userRoles.length > 0">
						<div class="flex flex-wrap gap-1">
							<el-tag 
								v-for="role in userRoles" 
								:key="role.roleId" 
								size="small" 
								type="primary" 
								effect="plain"
								class="text-xs"
							>
								{{ role.roleName }}
							</el-tag>
						</div>
					</div>

					<!-- 租户信息 -->
					<div class="tenant-section" v-if="userData.tenantName">
						<div class="flex items-center text-sm text-gray-600 dark:text-gray-300">
							<el-icon class="mr-2 text-blue-500 dark:text-green-400" size="16">
								<OfficeBuilding />
							</el-icon>
							<span class="font-medium">{{ userData.tenantName }}</span>
						</div>
					</div>
				</div>
			</div>
			
			<!-- 装饰背景 -->
			<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-purple-100/20 dark:from-blue-900/10 dark:to-purple-900/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
		</div>
	</el-card>
</template>

<script setup lang="ts" name="currentUser">
import { useUserInfo } from '/@/stores/userInfo';
import { OfficeBuilding } from '@element-plus/icons-vue';

const userData = ref({
	postName: '',
	name: '',
	username: '',
	userId: '',
	avatar: '',
	deptName: '',
	tenantName: '',
} as any);

const userRoles = ref<any[]>([]);

const userInfoStore = useUserInfo();
const { userInfos } = storeToRefs(userInfoStore);

// 监听 userInfo 变化，自动更新用户数据
watch(
	() => userInfos.value,
	(newUserInfos) => {
		if (newUserInfos?.user) {
			const { user, roles, tenantName } = newUserInfos;
			
			// 更新用户数据
			userData.value = user;
			userData.value.postName = user?.postList?.map((item: any) => item.postName).join(',') || '';
			userData.value.avatar = user.avatar;
			userData.value.tenantName = tenantName;
			
			// 设置角色信息
			if (roles && roles.length > 0) {
				userRoles.value = roles;
			}
		}
	},
	{ 
		immediate: true,
		deep: true 
	}
);
</script>

<style scoped lang="scss">
.user-card {
	border-radius: 16px;
	overflow: hidden;
	backdrop-filter: blur(10px);
	
	:deep(.el-card__body) {
		padding: 0;
		height: 100%;
	}
	
	// 悬停效果
	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}
	
	// 头像效果
	.avatar-container {
		img {
			transition: all 0.3s ease;
		}
		
		&:hover img {
			transform: scale(1.05);
		}
	}
	
	// 状态指示器动画
	.status-indicator {
		.animate-pulse {
			animation: pulse 2s infinite;
		}
	}
	
	// 姓名区域
	.name-section {
		h2 {
			transition: color 0.2s ease;
		}
	}
	
	// 部门区域
	.dept-section {
		.el-icon {
			transition: color 0.2s ease;
		}
	}
	
	// 角色标签
	.roles-section {
		.el-tag {
			transition: all 0.2s ease;
			
			&:hover {
				transform: translateY(-1px);
				box-shadow: 0 4px 8px rgba(59, 130, 246, 0.2);
			}
		}
	}
	
	// 深色模式优化
	:deep(.dark) {
		.el-tag {
			border: 1px solid rgba(59, 130, 246, 0.2);
		}
	}
}

// 脉冲动画
@keyframes pulse {
	0%, 100% {
		opacity: 1;
	}
	50% {
		opacity: 0.7;
	}
}

// 响应式优化
@media (max-width: 768px) {
	.user-card {
		.flex {
			flex-direction: column;
			text-align: center;
		}
		
		// 主内容区域在移动端的调整
		.flex.items-center.justify-center.w-full.max-w-md {
			flex-direction: column;
			align-items: center;
			max-width: 100%;
		}
		
		.avatar-container {
			margin-right: 0;
			margin-bottom: 1rem;
		}
		
		.info-section {
			align-items: center;
		}
	}
}
</style>
