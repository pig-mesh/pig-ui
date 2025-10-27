<template>
	<el-drawer v-model="visible" :title="$t('tenant.userListTitle')" size="60%" :before-close="handleClose" destroy-on-close>
		<div class="h-full flex flex-col">
			<!-- 搜索栏 -->
			<div class="mb-4">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('tenant.usernameLabel')" prop="username">
						<el-input
							v-model="state.queryForm.username"
							:placeholder="$t('tenant.inputUsernameTip')"
							style="width: 180px"
							clearable
						/>
					</el-form-item>
					<el-form-item :label="$t('tenant.nameLabel')" prop="name">
						<el-input
							v-model="state.queryForm.name"
							:placeholder="$t('tenant.inputnameTip')"
							style="width: 180px"
							clearable
						/>
					</el-form-item>
					<el-form-item :label="$t('tenant.emailLabel')" prop="email">
						<el-input
							v-model="state.queryForm.email"
							:placeholder="$t('tenant.inputEmailTip')"
							style="width: 180px"
							clearable
						/>
					</el-form-item>
					<el-form-item :label="$t('tenant.phoneLabel')" prop="phone">
						<el-input
							v-model="state.queryForm.phone"
							:placeholder="$t('tenant.inputPhoneTip')"
							style="width: 180px"
							clearable
						/>
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</div>

			<!-- 操作按钮栏 -->
			<div class="mb-4">
				<el-button
					@click="handleInviteUser"
					icon="UserFilled"
					type="primary"
				>
					{{ $t('tenant.inviteUserBtn') }}
				</el-button>
				<el-button
					plain
					:disabled="multiple"
					@click="handleBatchRemove"
					icon="Delete"
					type="primary"
				>
					{{ $t('tenant.batchRemoveBtn') }}
				</el-button>
				<span v-if="!multiple" class="ml-2 text-sm text-gray-500">
					{{ $t('tenant.selectedUsers', { count: selectObjs.length }) }}
				</span>
			</div>

			<!-- 用户列表 -->
			<div class="flex-1 overflow-hidden">
				<el-scrollbar class="h-full">
					<el-table
						v-loading="state.loading"
						:data="state.dataList"
						style="width: 100%"
						border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
						@selection-change="handleSelectionChange"
						row-key="userId"
					>
						<el-table-column type="selection" width="50" :selectable="checkSelectable" />
						<el-table-column type="index" :label="$t('tenant.index')" width="60" />
						<el-table-column prop="username" :label="$t('tenant.usernameLabel')" min-width="120" show-overflow-tooltip />
						<el-table-column prop="name" :label="$t('tenant.nameLabel')" min-width="100" show-overflow-tooltip />
						<el-table-column prop="email" :label="$t('tenant.emailLabel')" min-width="100" show-overflow-tooltip />
						<el-table-column prop="phone" :label="$t('tenant.phoneLabel')" min-width="100" show-overflow-tooltip />
						<el-table-column :label="$t('tenant.status')" min-width="60">
							<template #default="scope">
								<el-tag :type="scope.row.lockFlag === '0' ? 'success' : 'danger'">
									{{ scope.row.lockFlag === '0' ? $t('tenant.normalStatus') : $t('tenant.lockedStatus') }}
								</el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('common.action')" width="80" fixed="right">
							<template #default="scope">
								<el-button
									icon="delete"
									@click="handleRemoveUser(scope.row)"
									text
									type="primary"
									size="small"
									:disabled="scope.row.userId === '1' && currentTenantId === '1'"
									:title="scope.row.userId === '1' && currentTenantId === '1' ? $t('tenant.systemAdminCannotRemove') : ''"
								>
									{{ $t('tenant.removeBtn') }}
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-scrollbar>
			</div>

			<!-- 分页 -->
			<div class="mt-4">
				<pagination 
					@current-change="currentChangeHandle" 
					@size-change="sizeChangeHandle" 
					v-bind="state.pagination" 
				/>
			</div>
		</div>

		<!-- 邀请用户表单弹窗 -->
		<el-dialog
			v-model="inviteDialogVisible"
			:title="$t('tenant.inviteUserTitle')"
			width="500px"
			:close-on-click-modal="false"
			destroy-on-close
		>
			<el-form
				ref="inviteFormRef"
				:model="inviteForm"
				:rules="inviteFormRules"
				label-width="80px"
				v-loading="inviteLoading"
			>
				<el-form-item :label="$t('tenant.username')" prop="userId">
					<el-select
						v-model="inviteForm.userId"
						:placeholder="$t('tenant.selectUserTip')"
						filterable
						remote
						:remote-method="handleSearchUser"
						:loading="userSearchLoading"
						clearable
						style="width: 100%"
					>
						<el-option
							v-for="user in userList"
							:key="user.userId"
							:label="`${user.username} (${user.name || ''})`"
							:value="user.userId"
						/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('tenant.role')" prop="roleId">
					<el-select
						v-model="inviteForm.roleId"
						:placeholder="$t('tenant.selectRoleTip')"
						clearable
						style="width: 100%"
					>
						<el-option
							v-for="role in roleList"
							:key="role.roleId"
							:label="role.roleName"
							:value="role.roleId"
						/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('tenant.post')" prop="postId">
					<el-select
						v-model="inviteForm.postId"
						:placeholder="$t('tenant.selectPostTip')"
						clearable
						style="width: 100%"
					>
						<el-option
							v-for="post in postList"
							:key="post.postId"
							:label="post.postName"
							:value="post.postId"
						/>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('tenant.dept')" prop="deptId">
					<el-select
						v-model="inviteForm.deptId"
						:placeholder="$t('tenant.selectDeptTip')"
						clearable
						style="width: 100%"
					>
						<el-option
							v-for="dept in deptList"
							:key="dept.deptId"
							:label="dept.name"
							:value="dept.deptId"
						/>
					</el-select>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="handleCancelInvite">{{ $t('common.cancelButtonText') }}</el-button>
					<el-button
						type="primary"
						@click="handleSubmitInvite"
						:disabled="inviteLoading"
					>
						{{ $t('common.confirmButtonText') }}
					</el-button>
				</span>
			</template>
		</el-dialog>
	</el-drawer>
</template>

<script lang="ts" name="tenantUserList" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchUserPage, removeUsersFromTenant, inviteUserToTenant, getAvailableUsers, getTenantOrg } from '/@/api/admin/tenant';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 定义变量
const visible = ref(false);
const queryRef = ref();
const currentTenantId = ref('');

/**
 * 多选相关变量
 */
const selectObjs = ref([]) as any;
const multiple = ref(true);

/**
 * 邀请用户相关变量
 */
const inviteDialogVisible = ref(false);
const inviteFormRef = ref();
const inviteLoading = ref(false);
const userSearchLoading = ref(false);
const roleList = ref([]) as any;
const userList = ref([]) as any;
const postList = ref([]) as any;
const deptList = ref([]) as any;

/**
 * 邀请用户表单
 * @property {string} userId - 用户ID
 * @property {string} roleId - 角色ID
 * @property {string} postId - 岗位ID
 * @property {string} deptId - 部门ID
 */
const inviteForm = reactive({
	userId: '',
	roleId: '',
	postId: '',
	deptId: ''
});

// 邀请用户表单验证规则
const inviteFormRules = ref({
	userId: [
		{ required: true, message: t('tenant.selectUserTip'), trigger: 'change' }
	],
	roleId: [
		{ required: true, message: t('tenant.selectRoleTip'), trigger: 'change' }
	],
	deptId: [
		{ required: true, message: t('tenant.selectDeptTip'), trigger: 'change' }
	]
});

// 创建包装的 API 函数以适配 useTable
const wrappedFetchUserPage = (params: any) => {
	return fetchUserPage({
		...params,
		tenantId: currentTenantId.value
	});
};

// 使用 useTable hook
const state: BasicTableProps = reactive<BasicTableProps>({
	createdIsNeed: false, // 不在组件创建时自动加载数据
	queryForm: {
		username: '',
		name: '',
		email: '',
		phone: ''
	},
	pageList: wrappedFetchUserPage,
	pagination: {
		current: 1,
		size: 10,
		total: 0,
		pageSizes: [10, 20, 50, 100]
	}
});

// 使用 useTable hook
const { getDataList, currentChangeHandle, sizeChangeHandle, tableStyle } = useTable(state);

/**
 * 检查表格行是否可选择
 * @param {any} row - 表格行数据
 * @returns {boolean} 是否可选择
 */
const checkSelectable = (row: any) => {
	// 系统租户中的系统管理员不能被选择
	return !(row.userId === '1' && currentTenantId.value === '1');
};

/**
 * 多选事件处理
 * @param {Array} objs - 选中的用户对象数组
 */
const handleSelectionChange = (objs: { userId: string, tenantId: string }[]) => {
	const validSelection = objs.filter(obj => obj.userId !== '1' || currentTenantId.value !== '1');
	selectObjs.value = validSelection.map(({ userId }) => userId);
	multiple.value = !validSelection.length;
};

/**
 * 搜索可邀请的用户
 * @param {string} query - 搜索关键字
 */
const handleSearchUser = async (query: string) => {
	if (!query) {
		userList.value = [];
		return;
	}

	try {
		userSearchLoading.value = true;
		const { data } = await getAvailableUsers({
			tenantId: currentTenantId.value,
			username: query
		});
		userList.value = data || [];
	} catch (err: any) {
		useMessage().error(err.msg || t('tenant.searchUserFailed'));
		userList.value = [];
	} finally {
		userSearchLoading.value = false;
	}
};

/**
 * 打开邀请用户弹窗
 */
const handleInviteUser = async () => {
	try {
		// 获取组织数据（角色、岗位、部门）
		const { data } = await getTenantOrg({
			tenantId: currentTenantId.value
		});
		roleList.value = data.sysRoles || [];
		postList.value = data.sysPosts || [];
		deptList.value = data.sysDepts || [];

		// 重置表单
		inviteForm.userId = '';
		inviteForm.roleId = '';
		inviteForm.postId = '';
		inviteForm.deptId = '';
		userList.value = [];

		// 打开弹窗
		inviteDialogVisible.value = true;
	} catch (err: any) {
		useMessage().error(err.msg || t('tenant.getRoleListFailed'));
	}
};

/**
 * 提交邀请用户
 */
const handleSubmitInvite = async () => {
	try {
		const valid = await inviteFormRef.value.validate();
		if (!valid) return;

		inviteLoading.value = true;

		await inviteUserToTenant({
			tenantId: currentTenantId.value,
			userIds: [inviteForm.userId],
			roleId: inviteForm.roleId,
			postId: inviteForm.postId,
			deptId: inviteForm.deptId
		});

		useMessage().success(t('tenant.inviteUserSuccess'));
		inviteDialogVisible.value = false;
		getDataList(); // 刷新用户列表
	} catch (err: any) {
		useMessage().error(err.msg || t('tenant.inviteUserFailed'));
	} finally {
		inviteLoading.value = false;
	}
};

/**
 * 取消邀请用户
 */
const handleCancelInvite = () => {
	inviteDialogVisible.value = false;
	inviteForm.userId = '';
	inviteForm.roleId = '';
	inviteForm.postId = '';
	inviteForm.deptId = '';
	userList.value = [];
};

/**
 * 批量移除用户
 */
const handleBatchRemove = async () => {
	if (selectObjs.value.length === 0) {
		useMessage().warning(t('tenant.selectUserWarning'));
		return;
	}

	try {
		await useMessageBox().confirm(t('tenant.batchRemoveConfirm', { count: selectObjs.value.length }));
	} catch {
		return;
	}

	try {
		await removeUsersFromTenant({
			tenantId: currentTenantId.value,
			userIds: selectObjs.value
		});

		useMessage().success(t('tenant.removeSuccess'));
		getDataList();
		// 清空选择
		selectObjs.value = [];
		multiple.value = true;
	} catch (err: any) {
		useMessage().error(err.msg || t('tenant.removeFailed'));
	}
};

/**
 * 移除单个用户
 * @param {any} user - 用户对象
 */
const handleRemoveUser = async (user: any) => {
	try {
		await useMessageBox().confirm(t('tenant.removeConfirm', { name: user.name || user.username }));
	} catch {
		return;
	}

	try {
		await removeUsersFromTenant({
			tenantId: currentTenantId.value,
			userIds: [user.userId]
		});

		useMessage().success(t('tenant.removeSuccess'));
		getDataList();
	} catch (err: any) {
		useMessage().error(err.msg || t('tenant.removeFailed'));
	}
};

/**
 * 重置查询条件
 */
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

/**
 * 关闭抽屉并重置所有状态
 */
const handleClose = () => {
	visible.value = false;
	// 重置数据
	state.dataList = [];
	state.queryForm = {
		username: '',
		name: '',
		email: '',
		phone: ''
	};
	state.pagination!.current = 1;
	// 重置选择状态
	selectObjs.value = [];
	multiple.value = true;
	// 重置邀请用户表单状态
	inviteDialogVisible.value = false;
	inviteForm.userId = '';
	inviteForm.roleId = '';
	inviteForm.postId = '';
	inviteForm.deptId = '';
	userList.value = [];
	postList.value = [];
	deptList.value = [];
};

/**
 * 打开用户列表抽屉
 * @param {string} tenantId - 租户 ID
 */
const openDrawer = (tenantId: string) => {
	currentTenantId.value = tenantId;
	visible.value = true;
	// 延迟加载数据，确保抽屉已经打开
	nextTick(() => {
		getDataList();
	});
};

// 暴露方法
defineExpose({
	openDrawer
});
</script>