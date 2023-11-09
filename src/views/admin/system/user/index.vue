<template>
	<div class="layout-padding">
		<splitpanes>
			<pane size="15">
				<div class="layout-padding-auto layout-padding-view">
					<el-scrollbar>
						<query-tree :placeholder="$t('common.queryDeptTip')" :query="deptData.queryList" :show-expand="true" @node-click="handleNodeClick">
							<!-- 没有数据权限提示 -->
							<template #default="{ node, data }">
								<el-tooltip v-if="data.isLock" class="item" effect="dark" :content="$t('sysuser.noDataScopeTip')" placement="right-start">
									<span
										>{{ node.label }}
										<SvgIcon name="ele-Lock" />
									</span>
								</el-tooltip>
								<span v-if="!data.isLock">{{ node.label }}</span>
							</template>
						</query-tree>
					</el-scrollbar>
				</div>
			</pane>
			<pane class="ml8">
				<div class="layout-padding-auto layout-padding-view">
					<el-row v-show="showSearch">
						<el-form ref="queryRef" :inline="true" :model="state.queryForm" @keyup.enter="getDataList">
							<el-form-item :label="$t('sysuser.username')" prop="username">
								<el-input v-model="state.queryForm.username" :placeholder="$t('sysuser.inputUsernameTip')" clearable />
							</el-form-item>
							<el-form-item :label="$t('sysuser.phone')" prop="phone">
								<el-input v-model="state.queryForm.phone" :placeholder="$t('sysuser.inputPhoneTip')" clearable />
							</el-form-item>
							<el-form-item>
								<el-button icon="Search" type="primary" @click="getDataList">{{ $t('common.queryBtn') }}</el-button>
								<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
							</el-form-item>
						</el-form>
					</el-row>
					<el-row>
						<div class="mb8" style="width: 100%">
							<el-button v-auth="'sys_user_add'" icon="folder-add" type="primary" @click="userDialogRef.openDialog()">
								{{ $t('common.addBtn') }}
							</el-button>
							<el-button plain v-auth="'sys_user_add'" class="ml10" icon="upload-filled" type="primary" @click="excelUploadRef.show()">
								{{ $t('common.importBtn') }}
							</el-button>

							<el-button
								plain
								v-auth="'sys_user_del'"
								:disabled="multiple"
								class="ml10"
								icon="Delete"
								type="primary"
								@click="handleDelete(selectObjs)"
							>
								{{ $t('common.delBtn') }}
							</el-button>

							<right-toolbar
								v-model:showSearch="showSearch"
								:export="'sys_user_export'"
								@exportExcel="exportExcel"
								@queryTable="getDataList"
								class="ml10 mr20"
								style="float: right"
							/>
						</div>
					</el-row>
					<el-table
						v-loading="state.loading"
						:data="state.dataList"
						@selection-change="handleSelectionChange"
						row-key="userId"
						border
						:cell-style="tableStyle.cellStyle"
						:header-cell-style="tableStyle.headerCellStyle"
					>
						<el-table-column :selectable="handleSelectable" type="selection" width="40" />
						<el-table-column :label="$t('sysuser.index')" type="index" width="60" fixed="left" />
						<el-table-column :label="$t('sysuser.username')" prop="username" fixed="left" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.name')" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.phone')" prop="phone" show-overflow-tooltip></el-table-column>
						<el-table-column :label="$t('sysuser.post')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.postList" :key="index">{{ item.postName }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.role')" show-overflow-tooltip>
							<template #default="scope">
								<el-tag v-for="(item, index) in scope.row.roleList" :key="index">{{ item.roleName }}</el-tag>
							</template>
						</el-table-column>
						<el-table-column :label="$t('sysuser.lockFlag')" show-overflow-tooltip>
							<template #default="scope">
								<el-switch v-model="scope.row.lockFlag" @change="changeSwitch(scope.row)" active-value="0" inactive-value="9"></el-switch>
							</template>
						</el-table-column>
						<el-table-column :label="$t('common.action')" width="200" fixed="right">
							<template #default="scope">
								<div style="display: flex">
									<!-- 重置密码 -->
									<popover-input v-model="inputPassword" @confirm="changePassword(scope.row)">
										<template #default>
											<el-button v-auth="'sys_user_edit'" icon="RefreshLeft" text type="primary" class="mr-4">
												{{ $t('sysuser.passwordBtn') }}
											</el-button>
										</template>
									</popover-input>
									<!-- 修改信息 -->
									<el-button v-auth="'sys_user_edit'" icon="edit-pen" text type="primary" @click="userDialogRef.openDialog(scope.row.userId)">
										{{ $t('common.editBtn') }}
									</el-button>
									<!-- 删除用户 -->
									<el-tooltip :content="$t('sysuser.deleteDisabledTip')" :disabled="scope.row.userId !== '1'" placement="top">
										<span style="margin-left: 12px">
											<el-button
												icon="delete"
												v-auth="'sys_user_del'"
												:disabled="scope.row.username === 'admin'"
												text
												type="primary"
												@click="handleDelete([scope.row.userId])"
												>{{ $t('common.delBtn') }}
											</el-button>
										</span>
									</el-tooltip>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<pagination v-bind="state.pagination" @current-change="currentChangeHandle" @size-change="sizeChangeHandle"> </pagination>
				</div>
			</pane>
		</splitpanes>

		<user-form ref="userDialogRef" @refresh="getDataList(false)" />

		<upload-excel
			ref="excelUploadRef"
			:title="$t('sysuser.importUserTip')"
			temp-url="/admin/sys-file/local/file/user.xlsx"
			url="/admin/user/import"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script lang="ts" name="systemUser" setup>
import { delObj, pageList, putObj } from '/@/api/admin/user';
import { deptTree } from '/@/api/admin/dept';
import { BasicTableProps, useTable } from '/@/hooks/table';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 动态引入组件
const UserForm = defineAsyncComponent(() => import('./form.vue'));
const QueryTree = defineAsyncComponent(() => import('/@/components/QueryTree/index.vue'));
const PopoverInput = defineAsyncComponent(() => import('/@/components/PopoverInput/index.vue'));

const { t } = useI18n();

// 定义变量内容
const userDialogRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);
const inputPassword = ref();

// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

// 定义表格查询、后台调用的API
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		deptId: '',
		username: '',
		phone: '',
	},
	pageList: pageList,
});
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 部门树使用的数据
const deptData = reactive({
	queryList: (name: String) => {
		return deptTree({
			deptName: name,
		});
	},
});

// 清空搜索条件
const resetQuery = () => {
	queryRef.value?.resetFields();
	state.queryForm.deptId = '';
	getDataList();
};

// 点击树
const handleNodeClick = (e: any) => {
	state.queryForm.deptId = e.id;
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/user/export', Object.assign(state.queryForm, { ids: selectObjs }), 'users.xlsx');
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.username !== 'admin';
};

// 多选事件
const handleSelectionChange = (objs: { userId: string }[]) => {
	selectObjs.value = objs.map(({ userId }) => userId);
	multiple.value = !objs.length;
};

// 删除操作
const handleDelete = async (ids: string[]) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};

//表格内开关 (用户状态)
const changeSwitch = async (row: any) => {
	// 不修改密码
	row.password = undefined;
	row.phone = undefined;
	await putObj(row);
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};

//修改用户密码
const changePassword = async (row: any) => {
	if (!inputPassword.value || inputPassword.value.length < 6 || inputPassword.value.length > 20) {
		useMessage().error(t('sysuser.inputPasswordTip'));
		return;
	}

	row.phone = undefined;
	row.password = inputPassword.value;
	await putObj(row);
	useMessage().success(t('common.optSuccessText'));
	getDataList();
};
</script>
