<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('sysrole.roleName')" prop="roleName">
						<el-input :placeholder="$t('sysrole.inputRoleNameTip')" v-model="state.queryForm.roleName" />
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="roleDialogRef.openDialog()" v-auth="'sys_role_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()" v-auth="'sys_user_add'">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button plain :disabled="multiple" icon="Delete" type="primary" class="ml10" v-auth="'sys_user_del'" @click="handleDelete(selectObjs)">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'sys_role_export'"
						@exportExcel="exportExcel"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
        row-key="roleId"
        @selection-change="handleSelectionChange"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" :selectable="handleSelectable" width="50" align="center" />
				<el-table-column type="index" :label="$t('sysrole.index')" width="80" />
				<el-table-column prop="roleName" :label="$t('sysrole.roleName')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleCode" :label="$t('sysrole.roleCode')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="roleDesc" :label="$t('sysrole.roleDesc')" show-overflow-tooltip></el-table-column>
				<el-table-column prop="data_authority" :label="$t('sysrole.data_authority')" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="dictType" :value="scope.row.dsType"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" :label="$t('sysrole.createTime')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button text type="primary" icon="edit-pen" v-auth="'sys_role_edit'" @click="roleDialogRef.openDialog(scope.row.roleId)">{{
							$t('common.editBtn')
						}}</el-button>

						<el-button text type="primary" icon="turn-off" v-auth="'sys_role_del'" @click="permessionRef.openDialog(scope.row)">{{
							$t('sysrole.permissionTip')
						}}</el-button>

						<el-tooltip :content="$t('sysrole.deleteDisabledTip')" :disabled="scope.row.roleId !== '1'" placement="top">
							<span style="margin-left: 12px">
								<el-button
									text
									type="primary"
									icon="delete"
									:disabled="scope.row.roleId === '1'"
									v-auth="'sys_role_del'"
									@click="handleDelete([scope.row.roleId])"
									>{{ $t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 角色编辑、新增  -->
		<role-dialog ref="roleDialogRef" @refresh="getDataList()" />
		<!-- 导入角色 -->
		<upload-excel
			ref="excelUploadRef"
			:title="$t('sysuser.importUserTip')"
			url="/admin/role/import"
			temp-url="/admin/sys-file/local/file/role.xlsx"
			@refreshDataList="getDataList"
		/>
		<!-- 授权 -->
		<permession ref="permessionRef" />
	</div>
</template>

<script setup lang="ts" name="systemRole">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { pageList, delObj } from '/@/api/admin/role';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('./form.vue'));
const Permession = defineAsyncComponent(() => import('./permession.vue'));
const { t } = useI18n();

// 定义变量内容
const roleDialogRef = ref();
const permessionRef = ref();
const excelUploadRef = ref();
const queryRef = ref();
const showSearch = ref(true);
// 多选rows
const selectObjs = ref([]) as any;
// 是否可以多选
const multiple = ref(true);

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {
		roleName: '',
	},
	pageList: pageList, // H
	descs: ['create_time'],
});

const dictType = ref([
	{
		label: '全部',
		value: '0',
	},
	{
		label: '自定义',
		value: '1',
	},
	{
		label: '本级及子级',
		value: '2',
	},
	{
		label: '本级',
		value: '3',
	},
  {
    label: '本人',
    value: '4',
  },
]);

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/role/export',Object.assign(state.queryForm,{ids:selectObjs}), 'role.xlsx');
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.roleId !== '1';
};

// 多选事件
const handleSelectionChange = (objs: { roleId: string }[]) => {
	selectObjs.value = objs.map(({ roleId }) => roleId);
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
</script>
