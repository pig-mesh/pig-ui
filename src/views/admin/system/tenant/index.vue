<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row class="ml10" v-show="showSearch">
				<el-form :inline="true" :model="state.queryForm" @keyup.enter="getDataList" ref="queryRef">
					<el-form-item :label="$t('tenant.name')" prop="name">
						<el-input :placeholder="$t('tenant.inputnameTip')" style="max-width: 180px" v-model="state.queryForm.name" />
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
					<el-button @click="formDialogRef.openDialog()" class="ml10" icon="folder-add" type="primary" v-auth="'sys_systenant_add'">
						{{ $t('common.addBtn') }}
					</el-button>

					<el-button
						plain
						:disabled="multiple"
						@click="handleDelete(selectObjs)"
						class="ml10"
						icon="Delete"
						type="primary"
						v-auth="'sys_systenant_del'"
					>
						{{ $t('common.delBtn') }}
					</el-button>

					<right-toolbar
						:export="'sys_systenant_export'"
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
        row-key="id"
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column :selectable="handleSelectable" align="center" type="selection" width="40" />
				<el-table-column :label="t('tenant.index')" type="index" width="60" />
				<el-table-column :label="t('tenant.name')" prop="name" show-overflow-tooltip />
				<el-table-column :label="t('tenant.code')" prop="code" show-overflow-tooltip />
				<el-table-column :label="t('tenant.tenantDomain')" prop="tenantDomain" show-overflow-tooltip />
				<el-table-column :label="t('tenant.startTime')" prop="startTime" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ parseDate(scope.row.startTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column :label="t('tenant.endTime')" prop="endTime" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ parseDate(scope.row.endTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column :label="t('tenant.status')" prop="status" show-overflow-tooltip>
					<template #default="scope">
						<dict-tag :options="status_type" :value="scope.row.status"></dict-tag>
					</template>
				</el-table-column>
				<el-table-column :label="$t('common.action')" width="250">
					<template #default="scope">
						<el-button icon="HomeFilled" @click="individuationRef.openDialog(scope.row.id)" text type="primary" v-auth="'sys_systenant_edit'"
							>{{ $t('tenant.individuationBtn') }}
						</el-button>

						<el-button icon="edit-pen" @click="formDialogRef.openDialog(scope.row.id)" text type="primary" v-auth="'sys_systenant_edit'"
							>{{ $t('common.editBtn') }}
						</el-button>

						<el-tooltip :content="$t('tenant.deleteDisabledTip')" :disabled="scope.row.id !== '1'" placement="top">
							<span style="margin-left: 12px">
								<el-button
									icon="delete"
									:disabled="scope.row.id === '1'"
									@click="handleDelete([scope.row.id])"
									text
									type="primary"
									v-auth="'sys_systenant_del'"
									>{{ $t('common.delBtn') }}
								</el-button>
							</span>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>
			<pagination @current-change="currentChangeHandle" @size-change="sizeChangeHandle" v-bind="state.pagination" />
		</div>

		<!-- 编辑、新增  -->
		<form-dialog @refresh="getDataList()" ref="formDialogRef" />

		<!-- 编辑、新增  -->
		<individuation ref="individuationRef" />

		<!-- 导入excel -->
		<upload-excel
			:title="$t('tenant.importTenantTip')"
			@refreshDataList="getDataList"
			ref="excelUploadRef"
			temp-url="/admin/sys-file/local/file/tenant.xlsx"
			url="/admin/tenant/import"
		/>
	</div>
</template>

<script lang="ts" name="systemTenant" setup>
import { BasicTableProps, useTable } from '/@/hooks/table';
import { delObj, fetchPage } from '/@/api/admin/tenant';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';
import { useDict } from '/@/hooks/dict';

// 引入组件
const FormDialog = defineAsyncComponent(() => import('./form.vue'));
const Individuation = defineAsyncComponent(() => import('./individuation.vue'));
const { t } = useI18n();

// 定义变量内容
const formDialogRef = ref();
const individuationRef = ref();
const excelUploadRef = ref();
const tenantMenuRef = ref();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

// 字典
const { status_type } = useDict('status_type');

const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchPage,
});

//  table hook
const { getDataList, currentChangeHandle, sizeChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	queryRef.value.resetFields();
	getDataList();
};

// 是否可以多选
const handleSelectable = (row: any) => {
	return row.id !== '1';
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/tenant/export', Object.assign(state.queryForm,{ids:selectObjs}), 'tenant.xlsx');
};

// 多选事件
const handleSelectionChange = (objs: { id: string }[]) => {
	selectObjs.value = objs.map(({ id }) => id);
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
