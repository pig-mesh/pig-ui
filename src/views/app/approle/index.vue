<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="mb8" shadow="hover" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('approle.roleName')" prop="roleName">
						<el-input :placeholder="$t('approle.inputRoleNameTip')" style="max-width: 180px" v-model="state.queryForm.roleName" />
					</el-form-item>
					<el-form-item class="ml2">
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
					<el-button @click="excelUploadRef.show()" class="ml10" icon="upload-filled" type="primary" v-auth="'app_approle_export'">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button @click="exportExcel" class="ml10" icon="Download" type="primary">
						{{ $t('common.exportBtn') }}
					</el-button>
					<el-button :disabled="multiple" @click="handleDelete(selectObjs)" class="ml10" icon="Delete" type="primary" v-auth="'app_approle_del'">
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						@queryTable="getDataList"
						class="ml10"
						style="float: right; margin-right: 20px"
						v-model:showSearch="showSearch"
					></right-toolbar>
				</div>
			</el-row>
			<el-table :data="state.dataList" @selection-change="handleSelectionChange" style="width: 100%" v-loading="state.loading">
				<el-table-column align="center" type="selection" width="50" />
				<el-table-column :label="$t('approle.index')" type="index" width="80" />
				<el-table-column :label="$t('approle.roleName')" prop="roleName" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('approle.roleCode')" prop="roleCode" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('approle.roleDesc')" prop="roleDesc" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('approle.createTime')" prop="createTime" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button @click="roleDialogRef.openDialog(scope.row.roleId)" text type="primary" v-auth="'app_approle_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>

						<el-button @click="handleDelete([scope.row.roleId])" text type="primary" v-auth="'app_approle_del'">{{ $t('common.delBtn') }} </el-button>

						<el-button @click="permessionRef.openDialog(scope.row)" text type="primary" v-auth="'app_approle_perm'"
							>{{ $t('approle.permissionTip') }}
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
			temp-url="/admin/sys-file/local/file/role.xlsx"
			url="/admin/approle/import"
		/>
		<!-- 授权 -->
		<permession ref="permessionRef" />
	</div>
</template>

<script lang="ts" name="systemRole" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchList } from '/@/api/app/approle';
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
	pageList: fetchList, // H
	descs: ['create_time'],
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 多选事件
const handleSelectionChange = (objs: any) => {
	selectObjs.value = [];
	objs.forEach((val: any) => {
		selectObjs.value.push(val.roleId);
	});
	multiple.value = !objs.length;
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/approle/export', state.queryForm, 'approle.xlsx');
};

// 删除操作
const handleDelete = (ids: string[]) => {
	useMessageBox()
		.confirm(t('common.delConfirmText'))
		.then(() => {
			delObj(ids)
				.then(() => {
					getDataList();
					useMessage().success(t('common.delSuccessText'));
				})
				.catch((err: any) => {
					useMessage().error(err.msg);
				});
		});
};
</script>
