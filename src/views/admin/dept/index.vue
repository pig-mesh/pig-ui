<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row shadow="hover" v-show="showSearch" class="ml10">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item prop="deptName" :label="$t('sysdept.name')">
						<el-input :placeholder="$t('sysdept.inputdeptNameTip')" style="max-width: 180px" v-model="state.queryForm.deptName"> </el-input>
					</el-form-item>
					<el-form-item>
						<el-button icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button icon="folder-add" type="primary" class="ml10" @click="deptDialogRef.openDialog('add')" v-auth="'sys_dept_add'">
						{{ $t('common.addBtn') }}
					</el-button>
					<el-button plain icon="upload-filled" type="primary" class="ml10" @click="excelUploadRef.show()">
						{{ $t('common.importBtn') }}
					</el-button>
					<el-button @click="handleExpand"> {{ $t('common.expandBtn') }} </el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'sys_dept_add'"
						@exportExcel="exportExcel"
						class="ml10"
						style="float: right; margin-right: 20px"
						@queryTable="getDataList"
					></right-toolbar>
				</div>
			</el-row>
			<el-table
				ref="tableRef"
				:data="state.dataList"
				v-loading="state.loading"
				style="width: 100%"
				row-key="id"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle?.headerCellStyle"
			>
				<el-table-column :label="$t('sysdept.name')" prop="name" width="400" show-overflow-tooltip> </el-table-column>
				<el-table-column :label="$t('sysdept.weight')" prop="weight" show-overflow-tooltip width="80"></el-table-column>
				<el-table-column prop="createTime" :label="$t('sysdept.createTime')" show-overflow-tooltip></el-table-column>
				<el-table-column :label="$t('common.action')" show-overflow-tooltip width="250">
					<template #default="scope">
						<el-button text type="primary" icon="folder-add" @click="deptDialogRef.openDialog('add', scope.row?.id)" v-auth="'sys_dept_add'">
							{{ $t('common.addBtn') }}</el-button
						>
						<el-button text type="primary" icon="edit-pen" @click="deptDialogRef.openDialog('edit', scope.row?.id)" v-auth="'sys_dept_edit'">{{
							$t('common.editBtn')
						}}</el-button>
						<el-button text type="primary" icon="delete" @click="handleDelete(scope.row)" v-auth="'sys_dept_del'">
							{{ $t('common.delBtn') }}</el-button
						>
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
import { deptTree, delObj } from '/@/api/admin/dept';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { downBlobFile } from '/@/utils/other';
import { data } from 'autoprefixer';

// 引入组件
const DeptForm = defineAsyncComponent(() => import('./form.vue'));
const { t } = useI18n();
// 定义变量内容
const tableRef = ref();
const deptDialogRef = ref();
const excelUploadRef = ref();
const showSearch = ref(true);
const isExpand = ref(false);

const state: BasicTableProps = reactive<BasicTableProps>({
	pageList: deptTree,
	queryForm: {
		deptName: '',
	},
	isPage: false,
	descs: ['create_time'],
});

const { getDataList, tableStyle } = useTable(state);

// 展开折叠树
const handleExpand = async () => {
	isExpand.value = !isExpand.value;
	const dataList = await deptTree();
	toggleExpand(dataList.data, isExpand.value);
};

const toggleExpand = (children: any[], unfold = true) => {
	for (const key in children) {
		tableRef.value?.toggleRowExpansion(children[key], unfold);
		if (children[key].children) {
			toggleExpand(children[key].children!, unfold);
		}
	}
};

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
