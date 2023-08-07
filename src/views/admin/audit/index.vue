<template>
	<div class="layout-padding">
		<div class="layout-padding-auto layout-padding-view">
			<el-row v-show="showSearch">
				<el-form :model="state.queryForm" ref="queryRef" :inline="true" @keyup.enter="getDataList">
					<el-form-item :label="$t('audit.auditName')" prop="auditName">
						<el-input :placeholder="t('audit.inputAuditNameTip')" v-model="state.queryForm.auditName" style="max-width: 180px" />
					</el-form-item>
					<el-form-item :label="$t('audit.auditField')" prop="auditField">
						<el-input :placeholder="t('audit.inputAuditFieldTip')" v-model="state.queryForm.auditField" style="max-width: 180px" />
					</el-form-item>
					<el-form-item :label="$t('audit.createBy')" prop="createBy">
						<el-input :placeholder="t('audit.inputCreateByTip')" v-model="state.queryForm.createBy" style="max-width: 180px" />
					</el-form-item>
					<el-form-item>
						<el-button formDialogRef icon="search" type="primary" @click="getDataList">
							{{ $t('common.queryBtn') }}
						</el-button>
						<el-button icon="Refresh" formDialogRef @click="resetQuery">{{ $t('common.resetBtn') }}</el-button>
					</el-form-item>
				</el-form>
			</el-row>
			<el-row>
				<div class="mb8" style="width: 100%">
					<el-button
						plain
						formDialogRef
						:disabled="multiple"
						icon="Delete"
						type="primary"
						class="ml10"
						v-auth="'sys_audit_del'"
						@click="handleDelete(selectObjs)"
					>
						{{ $t('common.delBtn') }}
					</el-button>
					<right-toolbar
						v-model:showSearch="showSearch"
						:export="'sys_audit_export'"
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
        row-key="id"
				@selection-change="handleSelectionChange"
				@sort-change="sortChangeHandle"
				border
				:cell-style="tableStyle.cellStyle"
				:header-cell-style="tableStyle.headerCellStyle"
			>
				<el-table-column type="selection" width="40" align="center" />
				<el-table-column type="index" :label="$t('audit.index')" width="80" />
				<el-table-column prop="auditName" :label="$t('audit.auditName')" show-overflow-tooltip />
				<el-table-column prop="auditField" :label="$t('audit.auditField')" show-overflow-tooltip />
				<el-table-column prop="beforeVal" :label="$t('audit.beforeVal')" show-overflow-tooltip />
				<el-table-column prop="afterVal" :label="$t('audit.afterVal')" show-overflow-tooltip />
				<el-table-column prop="createBy" :label="$t('audit.createBy')" show-overflow-tooltip />
				<el-table-column prop="createTime" :label="$t('audit.createTime')" show-overflow-tooltip />
				<el-table-column :label="$t('common.action')" width="150">
					<template #default="scope">
						<el-button icon="delete" text type="primary" v-auth="'sys_audit_del'" @click="handleDelete([scope.row.id])"
							>{{ $t('common.delBtn') }}
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" v-bind="state.pagination" />
		</div>
	</div>
</template>

<script setup lang="ts" name="systemSysAuditLog">
import { BasicTableProps, useTable } from '/@/hooks/table';
import { fetchList, delObjs } from '/@/api/admin/audit';
import { useMessage, useMessageBox } from '/@/hooks/message';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
// 搜索变量
const queryRef = ref();
const showSearch = ref(true);
// 多选变量
const selectObjs = ref([]) as any;
const multiple = ref(true);

//  table hook
const state: BasicTableProps = reactive<BasicTableProps>({
	queryForm: {},
	pageList: fetchList,
	descs: ['create_time'],
});
const { getDataList, currentChangeHandle, sizeChangeHandle, sortChangeHandle, downBlobFile, tableStyle } = useTable(state);

// 清空搜索条件
const resetQuery = () => {
	// 清空搜索条件
	queryRef.value?.resetFields();
	// 清空多选
	selectObjs.value = [];
	getDataList();
};

// 导出excel
const exportExcel = () => {
	downBlobFile('/admin/audit/export', Object.assign(state.queryForm,{ids:selectObjs}), 'audit.xlsx');
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
		await delObjs(ids);
		getDataList();
		useMessage().success(t('common.delSuccessText'));
	} catch (err: any) {
		useMessage().error(err.msg);
	}
};
</script>
