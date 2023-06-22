<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('approle.roleName')" prop="roleName">
						<el-input :placeholder="$t('approle.inputRoleNameTip')" style="max-width: 180px" v-model="state.queryForm.roleName" />
					</el-form-item>
					<el-form-item>
						<el-button @click="getDataList" icon="search" type="primary">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button @click="resetQuery" icon="Refresh">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button @click="roleDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary" v-auth="'app_approle_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain @click="excelUploadRef.show()" class="ml10" icon="upload-filled" type="primary" v-auth="'app_approle_export'">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button
						plain
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
						class="ml10"
						icon="Delete"
						type="primary"
						v-auth="'app_approle_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						:export="'app_approle_export'"
						@exportExcel="exportExcel"
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				:data="state.dataList"
				@selection-change="handleSelectionChange"
				style="width: 100%"
				v-loading="state.loading"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column align="center" type="selection" width="40" />
				<el-table-column :label="$t('approle.index')" type="index" width="60" />
				<el-table-column :label="$t('approle.roleName')" prop="roleName" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('approle.roleCode')" prop="roleCode" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('approle.roleDesc')" prop="roleDesc" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('approle.createTime')" prop="createTime" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button icon="edit-pen" @click="roleDialogRef.openDialog(scope.row.roleId)" text type="primary" v-auth="'app_approle_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>

						<el-button icon="delete" @click="handleDelete([scope.row.roleId])" text type="primary" v-auth="'app_approle_del'"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>
		<!-- 角色编辑、新增  -->
		<role-dialog @refresh="getDataList()" ref="roleDialogRef" />
		<!-- 导入角色 -->
		<upload-excel
			:title="$t('sysuser.importUserTip')"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			temp-url="/admin/sys-file/local/file/approle.xlsx"
			url="/admin/approle/import"
		/>
	</div>
</template>

<script lang="ts" name="systemRole" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList } from '/@/api/app/approle';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

// 引入组件
const RoleDialog = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();

// 定义变量内容
const roleDialogRef = ref();
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
	pageList: fetchList, // H
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/app/approle/export', state.queryForm, 'approle.xlsx');
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
