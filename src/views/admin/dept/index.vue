<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<div class="mb15">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item prop="deptName">
						<el-input :placeholder="$t('sysdept.inputdeptNameTip')" style="max-width: 180px" v-model="state.queryForm.deptName"> </el-input>
					</el-form-item>
					<el-form-item class="ml2">
						<el-button icon="search" type="primary" class="ml10" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="folder-add" type="primary" class="ml10" @click="deptDialogRef.openDialog('add')" v-auth="'sys_dept_add'">
							{{ $t('common.addBtn') }}
						</el-button>
						<el-button icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()">
							{{ $t('common.importBtn') }}
						</el-button>
						<el-button icon="Download" type="primary" class="ml10" @click="exportExcel">
							{{ $t('common.exportBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</div>
			<el-table
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column :label="$t('sysdept.name')" prop="name" width="400" show-overflow-tooltip> </el-table-column>
				<el-table-column :label="$t('sysdept.weight')" prop="weight" show-overflow-tooltip width="80"></el-table-column>
				<el-table-column prop="createTime" :label="$t('sysdept.createTime')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="200">
					<template #default="scope">
						<el-button text type="primary" @click="deptDialogRef.openDialog('add', scope.row?.id)" v-auth="'sys_dept_add'">
							{{ $t('common.addBtn') }}</el-button
						>
						<el-button text type="primary" @click="deptDialogRef.openDialog('edit', scope.row?.id)" v-auth="'sys_dept_edit'">{{
							$t('common.editBtn')
						}}</el-button>
						<el-button text type="primary" @click="handleDelete(scope.row)" v-auth="'sys_dept_del'"> {{ $t('common.delBtn') }}</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<dept-form ref="deptDialogRef" @refresh="getDataList()" />
		<upload-excel
			ref="excelUploadRef"
			:title="$t('sysdept.importTip')"
			url="/admin/dept/import"
			temp-url="/admin/sys-file/local/file/dept.xlsx"
			@refreshDataList="getDataList"
		/>
	</div>
</template>

<script setup lang="ts" name="systemDept">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { depttree, delObj } from '/@/api/admin/dept';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { downBlobFile } from '/@/utils/other';

// 引入组件
const DeptForm = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义变量内容
const deptDialogRef = ref();
const excelUploadRef = ref();

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: depttree,
	queryForm: {
		deptName: '',
	},
	isPage: false,
	descs: ['create_time'],
});

const { getDataList } = useTable(state);

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/dept/export', state.queryForm, 'dept.xlsx');
};

// 删除当前行
const handleDelete = async (row: any) => {
	try {
		await useMessageBox().confirm(t('common.delConfirmText'));
	} catch {
		return;
	}

	try {
		await delObj(row.id);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
